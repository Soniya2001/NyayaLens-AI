# NyayaLens AI — Evidence-First Legal Information & Document Intelligence Platform

> **Tagline:** *"Understand the fine print. Navigate your next step."*  
> **Core Differentiator:** Evidence-First Legal Intelligence (Page/Section cited, verbatim quoted, grounded RAG, non-deterministic risk labels, legal consultation preparation kits).

---

## 🌟 Overview & Product Vision

Legal documents are intentionally complex, packed with hidden obligations, restrictive covenants, lengthy notice periods, and financial penalties.

**NyayaLens AI** is a GenAI-powered legal document intelligence platform engineered to make legal agreements understandable for students, renters, employees, freelancers, and small business owners without providing unauthorized legal advice.

Every answer produced by NyayaLens AI strictly adheres to **Evidence-First Legal Intelligence**:
1. **What the document says:** Verbatim quote & section header.
2. **What it means in plain English:** Simple, accessible breakdown.
3. **Why it matters:** Real-world implications and risk context.
4. **What information is missing:** Unclear terms or omissions.
5. **What to ask a lawyer:** Recommended questions to bring to legal counsel.
6. **Exact Source Citation:** Verbatim page numbers and chunk excerpts.

---

## 🚀 Key Features

### 1. "Before You Sign" Report
An instant breakdown generated upon document upload answering:
- What am I agreeing to?
- What do I have to pay?
- What are my responsibilities?
- What are the cancellation & exit rules?
- What information is missing or ambiguous?
- Which questions should I clarify before signing?

### 2. Evidence-Grounded RAG Legal Q&A
Ask natural language questions (*"Can I exit early?"*, *"What happens if I miss a payment?"*) and receive answers supported by exact page number citations and verbatim quotes.

### 3. Clause Risk Explorer
Categorizes document provisions using transparent, non-deterministic risk labels:
- `Important to Understand`
- `Potential Concern`
- `Missing or Unclear Information`
- `Requires Professional Review`
- `No Obvious Issue Found`

### 4. Side-by-Side Contract Comparison Engine
Compares two contract versions (e.g. original offer vs revised draft), highlighting added, removed, and modified clauses with practical change explanations and implications.

### 5. Legal Professional Preparation Kit
Generates an exportable and printable consultation packet containing:
- Matter Summary & Event Timeline
- Involved Parties & Contact Particulars
- Key Clause Inventory
- Evidence & Documents Checklist
- Tailored Questions for Legal Counsel

---

## 🏗️ Technical Architecture & Ecosystem

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      React + TypeScript + Tailwind UI                   │
│                     (Vite Single Page Workspace)                        │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ REST / Streaming APIs
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        FastAPI Multi-Agent Backend                      │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                    Multi-Agent Orchestrator                       │  │
│  │                                                                   │  │
│  │  Ingestion Agent ──► Document Understanding ──► Clause Risk       │  │
│  │                                  │                 Explorer       │  │
│  │  Contract Comparer ◄────── Q&A RAG Agent ───► Prep Kit Agent      │  │
│  └──────────────────────────────────┬────────────────────────────────┘  │
└─────────────────────────────────────┬───────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│       Google GenAI SDK (Gemini 2.5) & Hybrid Vector Retriever           │
└─────────────────────────────────────────────────────────────────────────┘
```

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React Icons.
- **Backend:** Python 3.11, FastAPI, Pydantic v2, PyPDF, python-docx, Uvicorn.
- **AI Engine:** Google GenAI SDK (`google.genai`) with Gemini 2.5 models and hybrid dense/lexical vector store for grounded page citations.

---

## 📦 Quick Start Guide

### Prerequisites
- Python 3.11+
- Node.js v18+ & npm

### Running the App (Single Command)

```bash
python run_app.py
```

This launches both servers simultaneously:
- **Frontend Dashboard:** [http://localhost:3000](http://localhost:3000)
- **Backend Swagger API Docs:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 🧪 Testing & Verification

Run the automated backend test suite:

```bash
.\backend\venv\Scripts\pytest backend/tests
```

Run the frontend production build test:

```bash
cd frontend
npm run build
```

---

## ⚖️ Legal Safety & Compliance Statement

> **Notice:** NyayaLens AI provides general legal document information and educational assistance. It does not provide legal advice or create an attorney-client relationship. For binding determinations regarding legal rights, obligations, or disputes, consult a qualified attorney.
