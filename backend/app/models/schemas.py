from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class RiskLabel(str, Enum):
    IMPORTANT = "Important to Understand"
    POTENTIAL_CONCERN = "Potential Concern"
    MISSING_UNCLEAR = "Missing or Unclear Information"
    REQUIRES_REVIEW = "Requires Professional Review"
    NO_OBVIOUS_ISSUE = "No Obvious Issue Found"

class ClauseCategory(str, Enum):
    PAYMENT = "Payment & Compensation"
    TERMINATION = "Termination & Notice Period"
    LIABILITY = "Liability & Indemnity"
    INTELLECTUAL_PROPERTY = "Intellectual Property"
    CONFIDENTIALITY = "Confidentiality & Data Privacy"
    NON_COMPETE = "Non-Compete & Restrictive Covenants"
    DISPUTE = "Dispute Resolution & Jurisdiction"
    OBLIGATIONS = "General Rights & Obligations"
    OTHER = "General Provision"

class Clause(BaseModel):
    id: str
    section_number: Optional[str] = None
    title: str
    category: ClauseCategory
    risk_label: RiskLabel
    original_text: str
    plain_summary: str
    why_it_matters: str
    suggested_questions: List[str]
    page_number: int

class BeforeYouSignReport(BaseModel):
    document_title: str
    document_type: str
    what_you_are_agreeing_to: List[str]
    what_you_must_pay: List[str]
    your_key_obligations: List[str]
    cancellation_and_exit_rules: List[str]
    missing_or_ambiguous_information: List[str]
    questions_for_lawyer_or_other_party: List[str]
    jurisdiction_noted: Optional[str] = "India (or as stated in contract)"

class DocumentClassification(BaseModel):
    document_type: str
    is_legal_document: bool
    confidence: Optional[float] = None
    reason: str

class DocumentSummary(BaseModel):
    doc_id: str
    title: str
    file_name: str
    file_type: str
    uploaded_at: datetime
    page_count: int
    executive_summary: str
    classification: DocumentClassification
    parties_involved: List[str] = []
    key_dates_and_deadlines: List[str] = []
    total_financial_value: Optional[str] = None
    key_topics: List[str] = []
    key_takeaways: List[str] = []
    before_you_sign: Optional[BeforeYouSignReport] = None
    clauses: List[Clause] = []

class Citation(BaseModel):
    page_number: int
    section_title: str
    verbatim_quote: str

class ChatRequest(BaseModel):
    query: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    answer: str
    citations: List[Citation]
    information_missing: bool = False
    is_legal_document: bool = True
    document_type: str = "General Document"
    suggested_followups: List[str]
    disclaimer: str = (
        "NyayaLens AI provides general document information. "
        "Consult a qualified attorney for legal determinations."
    )

class ClauseDiff(BaseModel):
    category: ClauseCategory
    clause_title: str
    change_type: str # "ADDED", "REMOVED", "MODIFIED", "UNCHANGED"
    doc_a_text: Optional[str] = None
    doc_b_text: Optional[str] = None
    practical_meaning: str
    potential_implications: str
    questions_for_review: List[str]

class ContractComparisonResponse(BaseModel):
    doc_a_id: str
    doc_a_title: str
    doc_b_id: str
    doc_b_title: str
    summary_of_changes: str
    added_count: int
    removed_count: int
    modified_count: int
    diffs: List[ClauseDiff]

class PrepKit(BaseModel):
    doc_id: str
    doc_title: str
    matter_summary: str
    timeline: List[Dict[str, str]]
    parties_involved: List[str]
    key_clauses_inventory: List[Dict[str, str]]
    missing_information: List[str]
    evidence_checklist: List[str]
    questions_to_ask_lawyer: List[str]
    desired_outcome_checklist: List[str]
