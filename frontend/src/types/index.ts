export type RiskLabel = 
  | "Important to Understand"
  | "Potential Concern"
  | "Missing or Unclear Information"
  | "Requires Professional Review"
  | "No Obvious Issue Found";

export type ClauseCategory = 
  | "Payment & Compensation"
  | "Termination & Notice Period"
  | "Liability & Indemnity"
  | "Intellectual Property"
  | "Confidentiality & Data Privacy"
  | "Non-Compete & Restrictive Covenants"
  | "Dispute Resolution & Jurisdiction"
  | "General Rights & Obligations"
  | "General Provision";

export interface Clause {
  id: string;
  section_number?: string;
  title: string;
  category: ClauseCategory;
  risk_label: RiskLabel;
  original_text: string;
  plain_summary: string;
  why_it_matters: string;
  suggested_questions: string[];
  page_number: number;
}

export interface BeforeYouSignReport {
  document_title: string;
  document_type: string;
  what_you_are_agreeing_to: string[];
  what_you_must_pay: string[];
  your_key_obligations: string[];
  cancellation_and_exit_rules: string[];
  missing_or_ambiguous_information: string[];
  questions_for_lawyer_or_other_party: string[];
  jurisdiction_noted?: string;
}

export interface DocumentClassification {
  document_type: string;
  is_legal_document: boolean;
  confidence?: number | null;
  reason: string;
}

export interface DocumentSummary {
  doc_id: string;
  title: string;
  file_name: string;
  file_type: string;
  uploaded_at: string;
  page_count: number;
  classification: DocumentClassification;
  executive_summary: string;
  parties_involved: string[];
  key_dates_and_deadlines: string[];
  total_financial_value?: string | null;
  key_topics?: string[];
  key_takeaways?: string[];
  before_you_sign?: BeforeYouSignReport | null;
  clauses: Clause[];
}

export interface Citation {
  page_number: number;
  section_title: string;
  verbatim_quote: string;
}

export interface ChatResponse {
  answer: string;
  citations: Citation[];
  information_missing: boolean;
  is_legal_document?: boolean;
  document_type?: string;
  suggested_followups: string[];
  disclaimer: string;
}

export interface ClauseDiff {
  category: ClauseCategory;
  clause_title: string;
  change_type: "ADDED" | "REMOVED" | "MODIFIED" | "UNCHANGED";
  doc_a_text?: string;
  doc_b_text?: string;
  practical_meaning: string;
  potential_implications: string;
  questions_for_review: string[];
}

export interface ContractComparisonResponse {
  doc_a_id: string;
  doc_a_title: string;
  doc_b_id: string;
  doc_b_title: string;
  summary_of_changes: string;
  added_count: number;
  removed_count: number;
  modified_count: number;
  diffs: ClauseDiff[];
}

export interface PrepKit {
  doc_id: string;
  doc_title: string;
  matter_summary: string;
  timeline: { date: string; event: string }[];
  parties_involved: string[];
  key_clauses_inventory: { clause: string; detail: string }[];
  missing_information: string[];
  evidence_checklist: string[];
  questions_to_ask_lawyer: string[];
  desired_outcome_checklist: string[];
}

export interface SampleDoc {
  doc_id: string;
  title: string;
  file_name: string;
  file_type: string;
  executive_summary: string;
  classification?: DocumentClassification;
}
