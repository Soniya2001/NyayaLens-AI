import os
from fastapi import FastAPI, UploadFile, File, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from typing import List, Dict, Any

from app.models.schemas import (
    DocumentSummary, BeforeYouSignReport, ChatRequest, ChatResponse,
    ContractComparisonResponse, PrepKit, Clause
)
from app.agents.orchestrator import MultiAgentOrchestrator, DOC_STORE
from app.samples.synthetic_contracts import SYNTHETIC_DOCUMENTS

app = FastAPI(
    title="NyayaLens AI - Legal Intelligence Platform",
    description="Evidence-First GenAI Legal Information & Document Assistance API",
    version="1.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

orchestrator = MultiAgentOrchestrator()

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "app": "NyayaLens AI",
        "tagline": "Understand the fine print. Navigate your next step."
    }

@app.get("/api/samples")
def get_sample_documents():
    """
    Returns pre-packaged synthetic document metadata for instant testing.
    """
    samples = []
    for doc_id, data in SYNTHETIC_DOCUMENTS.items():
        samples.append({
            "doc_id": doc_id,
            "title": data["title"],
            "file_name": data["file_name"],
            "file_type": data["file_type"],
            "executive_summary": data["executive_summary"],
            "classification": data.get("classification")
        })
    return samples

@app.post("/api/documents/upload", response_model=DocumentSummary)
async def upload_document(file: UploadFile = File(...)):
    """
    [Ingestion Workflow] Uploads PDF/DOCX, extracts text, categorizes document type, and builds analysis.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file selected")
    
    contents = await file.read()
    summary = orchestrator.ingest_document(contents, file.filename)
    return summary

@app.get("/api/documents", response_model=List[Dict[str, Any]])
def list_documents():
    """
    Lists all ingested and sample documents with classification metadata.
    """
    docs = []
    for doc_id, data in DOC_STORE.items():
        docs.append({
            "doc_id": doc_id,
            "title": data.get("title", "Untitled Document"),
            "file_name": data.get("file_name", "document.pdf"),
            "file_type": data.get("file_type", "pdf"),
            "uploaded_at": data.get("uploaded_at"),
            "page_count": data.get("page_count", 1),
            "executive_summary": data.get("executive_summary", ""),
            "classification": data.get("classification")
        })
    return docs

@app.get("/api/documents/{doc_id}", response_model=DocumentSummary)
def get_document(doc_id: str):
    """
    Retrieves full document analysis by ID.
    """
    if doc_id not in DOC_STORE:
        raise HTTPException(status_code=404, detail="Document not found")
    return DocumentSummary(**DOC_STORE[doc_id])

@app.get("/api/documents/{doc_id}/before-you-sign", response_model=BeforeYouSignReport)
def get_before_you_sign_report(doc_id: str):
    """
    Retrieves the 'Before You Sign' analysis for a document (Legal Documents only).
    """
    if doc_id not in DOC_STORE:
        raise HTTPException(status_code=404, detail="Document not found")
    data = DOC_STORE[doc_id]
    if not data.get("before_you_sign"):
        raise HTTPException(status_code=400, detail="Before You Sign report is not applicable for non-legal documents.")
    return BeforeYouSignReport(**data["before_you_sign"])

@app.get("/api/documents/{doc_id}/clauses", response_model=List[Clause])
def get_document_clauses(doc_id: str):
    """
    Retrieves extracted clauses with risk indicators.
    """
    if doc_id not in DOC_STORE:
        raise HTTPException(status_code=404, detail="Document not found")
    data = DOC_STORE[doc_id]
    return [Clause(**c) for c in data.get("clauses", [])]

@app.post("/api/documents/{doc_id}/chat", response_model=ChatResponse)
def ask_document_question(doc_id: str, request: ChatRequest):
    """
    [Document-Grounded RAG Q&A]
    Answers natural language queries using strictly retrieved document chunks with citations.
    """
    return orchestrator.answer_question(doc_id, request.query)

@app.post("/api/compare", response_model=ContractComparisonResponse)
def compare_contracts(doc_a_id: str = Body(..., embed=True), doc_b_id: str = Body(..., embed=True)):
    """
    [Contract Comparison Engine]
    Compares Document A vs Document B and displays semantic clause diffs. Validates legal eligibility.
    """
    try:
        return orchestrator.compare_contracts(doc_a_id, doc_b_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/documents/{doc_id}/prep-kit", response_model=PrepKit)
def generate_prep_kit(doc_id: str):
    """
    [Legal Professional Preparation Kit]
    Generates downloadable preparation packet for consultation with a lawyer. Validates legal eligibility.
    """
    try:
        return orchestrator.generate_prep_kit(doc_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# Single Container Cloud Run Frontend Static Delivery
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../frontend/dist"))
if os.path.exists(frontend_dist):
    assets_dir = os.path.join(frontend_dist, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        if full_path.startswith("api"):
            raise HTTPException(status_code=404, detail="API endpoint not found")
        file_path = os.path.join(frontend_dist, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_dist, "index.html"))
