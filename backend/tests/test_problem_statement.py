import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check_disclaimer():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert "disclaimer" in data
    assert "rather than replacing professional legal advice" in data["disclaimer"]

def test_problem_statement_use_case_1_simplify():
    response = client.get("/api/simplify-legal-documents/emp_001")
    assert response.status_code == 200
    data = response.json()
    assert data["doc_id"] == "emp_001"
    assert "executive_summary" in data

def test_problem_statement_use_case_2_compare():
    response = client.post(
        "/api/compare-contracts-agreements-policies",
        json={"doc_a_id": "emp_001", "doc_b_id": "lease_002"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "summary_of_changes" in data
    assert "diffs" in data

def test_problem_statement_use_case_3_highlight_risks():
    response = client.get("/api/highlight-clauses-obligations-risks/emp_001")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0

def test_problem_statement_use_case_4_answer_questions():
    response = client.post(
        "/api/answer-questions-legal-documents/emp_001",
        json={"query": "What is the notice period?"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "answer" in data
    assert "citations" in data

def test_problem_statement_use_case_5_options_next_steps():
    response = client.get("/api/options-and-next-steps/emp_001")
    assert response.status_code == 200
    data = response.json()
    assert "cancellation_and_exit_rules" in data

def test_problem_statement_use_case_6_summaries_checklists():
    response = client.get("/api/generate-summaries-and-checklists/emp_001")
    assert response.status_code == 200
    data = response.json()
    assert "what_you_are_agreeing_to" in data
    assert "what_you_must_pay" in data

def test_problem_statement_use_case_7_prepare_legal_professional():
    response = client.get("/api/prepare-questions-for-legal-professional/emp_001")
    assert response.status_code == 200
    data = response.json()
    assert "questions_to_ask_lawyer" in data
    assert "evidence_checklist" in data
