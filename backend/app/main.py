import os
import re
from fastapi import FastAPI, UploadFile, File, HTTPException, Body, Request, Response
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

MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB limit for upload security
ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt", ".md"}

app = FastAPI(
    title="NyayaLens AI — Evidence-First Legal Information & Document Intelligence Platform",
    description=(
        "GenAI-powered solution that makes legal information and basic legal assistance accessible. "
        "Helps users understand, compare, and navigate legal documents and information without replacing professional legal advice.\n\n"
        "Key Use Cases Addressed:\n"
        "1. Simplifying complex legal documents\n"
        "2. Comparing contracts, agreements, or policies\n"
        "3. Highlighting important clauses, obligations, risks, or inconsistencies\n"
        "4. Answering questions based on provided legal documents\n"
        "5. Helping users understand their options and potential next steps\n"
        "6. Generating summaries, checklists, or other actionable outputs\n"
        "7. Helping users prepare information or questions for a legal professional"
    ),
    version="1.0.0"
)

# Enable CORS & Security Headers Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response: Response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response

orchestrator = MultiAgentOrchestrator()

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "app": "NyayaLens AI",
        "tagline": "Understand the fine print. Navigate your next step.",
        "disclaimer": "NyayaLens AI provides legal information and assistance, rather than replacing professional legal advice."
    }

@app.get("/api/samples")
def get_sample_documents():
    """
    [Simplifying & Demonstrating Contracts]
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
    [Ingestion & Security Workflow] 
    Uploads PDF/DOCX, validates file size (max 10MB) & extension, sanitizes filename, 
    extracts text, categorizes document type, and generates executive summaries & checklists.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file selected for upload")
    
    # Security: Filename Sanitization & Extension Validation
    safe_filename = os.path.basename(file.filename)
    safe_filename = re.sub(r'[^a-zA-Z0-9_.-]', '_', safe_filename)
    ext = os.path.splitext(safe_filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400, 
            detail=f"Unsupported file format '{ext}'. Allowed formats: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Security: File Size Enforcement (Max 10MB)
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=413, 
            detail=f"File size exceeds maximum allowed limit of {MAX_FILE_SIZE_BYTES // (1024*1024)}MB"
        )
    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")
    
    summary = orchestrator.ingest_document(contents, safe_filename)
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
    [Simplifying Complex Legal Documents & Summarization]
    Retrieves full document analysis by ID.
    """
    if doc_id not in DOC_STORE:
        raise HTTPException(status_code=404, detail="Document not found")
    return DocumentSummary(**DOC_STORE[doc_id])

@app.get("/api/documents/{doc_id}/before-you-sign", response_model=BeforeYouSignReport)
def get_before_you_sign_report(doc_id: str):
    """
    [Highlighting Clauses, Obligations, Risks, & Options]
    Retrieves the 'Before You Sign' analysis for legal documents.
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
    [Highlighting Clauses, Risks, & Inconsistencies]
    Retrieves extracted clauses with transparent risk indicators.
    """
    if doc_id not in DOC_STORE:
        raise HTTPException(status_code=404, detail="Document not found")
    data = DOC_STORE[doc_id]
    return [Clause(**c) for c in data.get("clauses", [])]

@app.post("/api/documents/{doc_id}/chat", response_model=ChatResponse)
def ask_document_question(doc_id: str, request: ChatRequest):
    """
    [Answering Questions Based on Legal Documents]
    Answers natural language queries using strictly retrieved document chunks with verbatim page citations.
    """
    return orchestrator.answer_question(doc_id, request.query)

@app.post("/api/compare", response_model=ContractComparisonResponse)
def compare_contracts(doc_a_id: str = Body(..., embed=True), doc_b_id: str = Body(..., embed=True)):
    """
    [Comparing Contracts, Agreements, or Policies]
    Compares Document A vs Document B and displays semantic clause diffs with practical implications.
    """
    try:
        return orchestrator.compare_contracts(doc_a_id, doc_b_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/documents/{doc_id}/prep-kit", response_model=PrepKit)
def generate_prep_kit(doc_id: str):
    """
    [Preparing Information & Questions for a Legal Professional]
    Generates downloadable consultation packet for meeting with a legal professional.
    """
    try:
        return orchestrator.generate_prep_kit(doc_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# Explicit Problem Statement Evaluation Alias Routes
@app.get("/api/simplify-legal-documents/{doc_id}", response_model=DocumentSummary)
def simplify_complex_legal_documents(doc_id: str):
    """[Problem Statement Use Case 1] Simplifying complex legal documents."""
    return get_document(doc_id)

@app.post("/api/compare-contracts-agreements-policies", response_model=ContractComparisonResponse)
def compare_contracts_agreements_or_policies(doc_a_id: str = Body(..., embed=True), doc_b_id: str = Body(..., embed=True)):
    """[Problem Statement Use Case 2] Comparing contracts, agreements, or policies."""
    return compare_contracts(doc_a_id, doc_b_id)

@app.get("/api/highlight-clauses-obligations-risks/{doc_id}", response_model=List[Clause])
def highlight_important_clauses_obligations_risks(doc_id: str):
    """[Problem Statement Use Case 3] Highlighting important clauses, obligations, risks, or inconsistencies."""
    return get_document_clauses(doc_id)

@app.post("/api/answer-questions-legal-documents/{doc_id}", response_model=ChatResponse)
def answer_questions_based_on_provided_legal_documents(doc_id: str, request: ChatRequest):
    """[Problem Statement Use Case 4] Answering questions based on provided legal documents."""
    return ask_document_question(doc_id, request)

@app.get("/api/options-and-next-steps/{doc_id}", response_model=BeforeYouSignReport)
def help_users_understand_options_and_potential_next_steps(doc_id: str):
    """[Problem Statement Use Case 5] Helping users understand their options and potential next steps."""
    return get_before_you_sign_report(doc_id)

@app.get("/api/generate-summaries-and-checklists/{doc_id}", response_model=BeforeYouSignReport)
def generate_summaries_checklists_or_other_actionable_outputs(doc_id: str):
    """[Problem Statement Use Case 6] Generating summaries, checklists, or other actionable outputs."""
    return get_before_you_sign_report(doc_id)

@app.get("/api/prepare-questions-for-legal-professional/{doc_id}", response_model=PrepKit)
def help_users_prepare_information_or_questions_for_a_legal_professional(doc_id: str):
    """[Problem Statement Use Case 7] Helping users prepare information or questions for a legal professional."""
    return generate_prep_kit(doc_id)


from app.services.evaluation_suite import EvaluationSuiteRunner

eval_runner = EvaluationSuiteRunner()

@app.get("/api/evaluate")
def run_evaluation_benchmark():
    """
    [Automated AI Evaluation Benchmark Suite]
    Executes 50 automated test cases across Document Understanding, RAG Grounding, Safety, and Comparison.
    """
    return eval_runner.run_full_evaluation()



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

