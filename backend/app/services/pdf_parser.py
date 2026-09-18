import io
import re
import logging
from typing import List, Dict, Any
from pypdf import PdfReader
from docx import Document as DocxDocument

logger = logging.getLogger("nyayalens.parser")

class ParsedChunk:
    def __init__(self, page_number: int, section_title: str, text: str):
        self.page_number = page_number
        self.section_title = section_title
        self.text = text

class DocumentParser:
    @staticmethod
    def parse_file(file_bytes: bytes, filename: str) -> Dict[str, Any]:
        """
        Parses PDF, DOCX, or TXT content into pages and structured chunks.
        Preserves page numbers and section headers.
        """
        lower_name = filename.lower()
        if lower_name.endswith('.pdf'):
            return DocumentParser._parse_pdf(file_bytes)
        elif lower_name.endswith('.docx'):
            return DocumentParser._parse_docx(file_bytes)
        else:
            return DocumentParser._parse_txt(file_bytes)

    @staticmethod
    def _parse_pdf(file_bytes: bytes) -> Dict[str, Any]:
        try:
            reader = PdfReader(io.BytesIO(file_bytes))
            page_count = len(reader.pages)
            pages_content = []
            chunks = []

            current_section = "Preamble"
            for i, page in enumerate(reader.pages, start=1):
                text = page.extract_text() or ""
                pages_content.append({"page": i, "text": text})

                lines = text.split('\n')
                current_chunk_lines = []

                for line in lines:
                    clean_line = line.strip()
                    if not clean_line:
                        continue

                    if re.match(r'^(?:SECTION|CLAUSE|ARTICLE|\d+\.|\([a-z0-9]+\))\s+[A-Z\s]{3,}', clean_line, re.IGNORECASE):
                        if current_chunk_lines:
                            chunk_text = ' '.join(current_chunk_lines).strip()
                            if len(chunk_text) > 30:
                                chunks.append(ParsedChunk(i, current_section, chunk_text))
                            current_chunk_lines = []
                        current_section = clean_line[:60]
                    else:
                        current_chunk_lines.append(clean_line)

                if current_chunk_lines:
                    chunk_text = ' '.join(current_chunk_lines).strip()
                    if len(chunk_text) > 30:
                        chunks.append(ParsedChunk(i, current_section, chunk_text))

            full_text = "\n\n".join([p["text"] for p in pages_content])
            if full_text.strip():
                return {
                    "page_count": max(1, page_count),
                    "full_text": full_text,
                    "pages": pages_content,
                    "chunks": chunks
                }
        except Exception as e:
            logger.warning(f"PDF Parsing failed or corrupt stream, falling back to text extractor: {e}")

        return DocumentParser._parse_txt(file_bytes)

    @staticmethod
    def _parse_docx(file_bytes: bytes) -> Dict[str, Any]:
        try:
            doc = DocxDocument(io.BytesIO(file_bytes))
            full_text_lines = []
            chunks = []
            current_section = "General Provision"
            page_est = 1
            para_count = 0

            for para in doc.paragraphs:
                text = para.text.strip()
                if not text:
                    continue
                full_text_lines.append(text)
                para_count += 1
                page_est = max(1, para_count // 12)

                if para.style.name.startswith('Heading') or re.match(r'^\d+\.\s+[A-Z]', text):
                    current_section = text[:60]
                
                chunks.append(ParsedChunk(page_est, current_section, text))

            full_text = "\n".join(full_text_lines)
            if full_text.strip():
                return {
                    "page_count": page_est,
                    "full_text": full_text,
                    "pages": [{"page": 1, "text": full_text}],
                    "chunks": chunks
                }
        except Exception as e:
            logger.warning(f"DOCX Parsing failed, falling back to text extractor: {e}")

        return DocumentParser._parse_txt(file_bytes)

    @staticmethod
    def _parse_txt(file_bytes: bytes) -> Dict[str, Any]:
        text = file_bytes.decode('utf-8', errors='ignore')
        paragraphs = [p.strip() for p in text.split('\n\n') if p.strip()]
        chunks = []
        current_section = "Main Text"
        
        for i, para in enumerate(paragraphs, start=1):
            page_est = (i // 5) + 1
            if len(para) < 60 and para.isupper():
                current_section = para
            chunks.append(ParsedChunk(page_est, current_section, para))

        return {
            "page_count": max(1, (len(paragraphs) // 5) + 1),
            "full_text": text,
            "pages": [{"page": 1, "text": text}],
            "chunks": chunks
        }
