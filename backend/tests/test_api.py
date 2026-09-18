import sys
import os
import pytest
from fastapi.testclient import TestClient

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "NyayaLens" in data["app"]

def test_get_samples():
    response = client.get("/api/samples")
    assert response.status_code == 200
    samples = response.json()
    assert len(samples) >= 2
    assert "emp_001" in [s["doc_id"] for s in samples]

def test_get_document():
    response = client.get("/api/documents/emp_001")
    assert response.status_code == 200
    doc = response.json()
    assert doc["doc_id"] == "emp_001"
    assert "before_you_sign" in doc
    assert len(doc["clauses"]) > 0

def test_chat_query():
    response = client.post("/api/documents/emp_001/chat", json={"query": "What is the notice period?"})
    assert response.status_code == 200
    chat = response.json()
    assert "notice" in chat["answer"].lower() or len(chat["citations"]) > 0
    assert "disclaimer" in chat

def test_compare_contracts():
    response = client.post("/api/compare", json={"doc_a_id": "emp_001", "doc_b_id": "lease_002"})
    assert response.status_code == 200
    comp = response.json()
    assert len(comp["diffs"]) > 0

def test_generate_prep_kit():
    response = client.get("/api/documents/emp_001/prep-kit")
    assert response.status_code == 200
    kit = response.json()
    assert len(kit["questions_to_ask_lawyer"]) > 0
