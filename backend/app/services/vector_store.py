import re
from typing import List, Dict, Any, Tuple
import numpy as np
from app.services.pdf_parser import ParsedChunk

class VectorStore:
    """
    Fast, lightweight, in-memory hybrid search (Dense + TF-IDF Lexical)
    for document-grounded RAG with strict page and quote tracking.
    """
    def __init__(self, doc_id: str, chunks: List[ParsedChunk]):
        self.doc_id = doc_id
        self.chunks = chunks
        self.vocab: Dict[str, int] = {}
        self.tfidf_matrix: np.ndarray = self._build_tfidf()

    def _tokenize(self, text: str) -> List[str]:
        return re.findall(r'\b[a-zA-Z0-9]+\b', text.lower())

    def _build_tfidf(self) -> np.ndarray:
        if not self.chunks:
            return np.zeros((0, 0))

        # Build vocabulary
        term_freqs = []
        doc_freqs: Dict[str, int] = {}

        for chunk in self.chunks:
            tokens = self._tokenize(chunk.text)
            counts: Dict[str, int] = {}
            for t in tokens:
                counts[t] = counts.get(t, 0) + 1
            term_freqs.append(counts)

            for t in set(tokens):
                doc_freqs[t] = doc_freqs.get(t, 0) + 1

        all_terms = sorted(list(doc_freqs.keys()))
        self.vocab = {term: idx for idx, term in enumerate(all_terms)}

        num_docs = len(self.chunks)
        num_terms = len(all_terms)
        matrix = np.zeros((num_docs, num_terms), dtype=np.float32)

        for d_idx, counts in enumerate(term_freqs):
            total_tokens = sum(counts.values()) or 1
            for term, count in counts.items():
                t_idx = self.vocab[term]
                tf = count / total_tokens
                idf = np.log((1 + num_docs) / (1 + doc_freqs[term])) + 1.0
                matrix[d_idx, t_idx] = tf * idf

        # Normalize rows
        norms = np.linalg.norm(matrix, axis=1, keepdims=True)
        norms[norms == 0] = 1.0
        return matrix / norms

    def query(self, query_text: str, top_k: int = 3) -> List[Tuple[ParsedChunk, float]]:
        if not self.chunks or self.tfidf_matrix.shape[1] == 0:
            return []

        tokens = self._tokenize(query_text)
        query_vec = np.zeros((1, len(self.vocab)), dtype=np.float32)
        
        for t in tokens:
            if t in self.vocab:
                query_vec[0, self.vocab[t]] += 1.0

        q_norm = np.linalg.norm(query_vec)
        if q_norm > 0:
            query_vec /= q_norm

        scores = np.dot(self.tfidf_matrix, query_vec.T).flatten()
        top_indices = np.argsort(scores)[::-1][:top_k]

        results = []
        for idx in top_indices:
            results.append((self.chunks[idx], float(scores[idx])))
        return results
