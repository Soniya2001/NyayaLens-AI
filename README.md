# NyayaLens AI — Evidence-First Legal Information & Document Intelligence Platform

> **Tagline:** *"Understand the fine print. Navigate your next step."*  
> **Live Cloud Run Deployment:** [https://nyayalens-ai-99798674090.us-central1.run.app](https://nyayalens-ai-99798674090.us-central1.run.app)  
> **Core Differentiator:** Evidence-First Legal Intelligence (Verbatim quotes, exact page citations, grounded RAG, non-deterministic risk labels, contract comparison, legal consultation preparation kits).

---

## ⚖️ Problem Statement & Objective Alignment

> **Problem Statement Challenge:**  
> *"Legal information can often be complex, difficult to understand, and challenging to navigate without professional assistance. Build a GenAI-powered solution that makes legal information and basic legal assistance more accessible by helping users understand, compare, and navigate legal documents and information."*

NyayaLens AI is built specifically to address this challenge by providing an accessible, transparent, and evidence-grounded GenAI platform.

### 🎯 Direct Mapping to Required Use Cases

| Required Use Case | NyayaLens AI Implementation & Feature | Alignment Status |
| :--- | :--- | :---: |
| **1. Simplifying complex legal documents** | **"Before You Sign" Report Engine & Executive Summarization**: Translates legalese into plain English breakdowns of obligations, payments, and notice periods. | ✅ 100% Fully Implemented |
| **2. Comparing contracts, agreements, or policies** | **Side-by-Side Contract Comparison Engine**: Performs semantic clause diffing between contract versions, highlighting additions, removals, and risk implications. | ✅ 100% Fully Implemented |
| **3. Highlighting important clauses, obligations, risks, or inconsistencies** | **Clause Risk Explorer**: Categorizes provisions using transparent risk labels (`Important to Understand`, `Potential Concern`, `Missing or Unclear Information`). | ✅ 100% Fully Implemented |
| **4. Answering questions based on provided legal documents** | **Evidence-Grounded RAG Q&A Engine**: Answers user queries with strict page-level citations and verbatim quotes to eliminate AI hallucinations. | ✅ 100% Fully Implemented |
| **5. Helping users understand their options and potential next steps** | **Options & Next Steps Navigator**: Outlines exit rules, cancellation procedures, and pre-signature decision pathways. | ✅ 100% Fully Implemented |
| **6. Generating summaries, checklists, or other actionable outputs** | **Actionable Summary & Evidence Checklist Generator**: Creates financial schedules, missing clause alerts, and document evidence checklists. | ✅ 100% Fully Implemented |
| **7. Helping users prepare information or questions for a legal professional** | **Professional Legal Consultation Preparation Kit**: Generates exportable, printable briefs with timeline summaries and tailored attorney question planners. | ✅ 100% Fully Implemented |

---

## 🔒 Legal Safety & Non-Advice Disclaimer

> **IMPORTANT COMPLIANCE NOTICE:**  
> NyayaLens AI is designed strictly to provide **legal information and assistance**, rather than replacing professional legal advice. The platform does not create an attorney-client relationship. Users are advised to consult a qualified legal professional for binding legal determinations.

---

## 🛡️ Security & Technical Architecture

### Security Hardening Measures
- **File Upload Security**: Enforces strict file extension whitelist (`.pdf`, `.docx`, `.txt`), file size cap (Max 10MB limit per payload), and regex-based filename sanitization against path traversal attacks.
- **HTTP Security Headers**: Incorporates FastAPI middleware setting `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection: 1; mode=block`, and `Referrer-Policy`.
- **CORS Scoping**: Configured with explicit origins and methods for secure frontend-backend REST communication.

### Accessibility (WCAG 2.1 Compliant)
- **Screen Reader Support**: Integrated ARIA roles (`role="main"`, `role="navigation"`, `role="region"`, `role="dialog"`), explicit `aria-label` attributes, and semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`).
- **Keyboard Navigation & High Contrast**: Built with accessible focus rings, keyboard tab ordering, and color combinations meeting high contrast ratio requirements.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    React 19 + TypeScript + ARIA UI                      │
│                    (Single-Page Workspace - Vite)                       │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ REST / JSON APIs
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    FastAPI Multi-Agent Backend Engine                   │
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
│      Google GenAI SDK (Gemini 2.5) & Hybrid Vector Retriever            │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 📦 Quick Start Guide

### Running Locally with Single Command

```bash
python run_app.py
```

- **Frontend Application**: [http://localhost:3000](http://localhost:3000)
- **Interactive OpenAPI Documentation**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### Deploying to Google Cloud Run

```powershell
gcloud run deploy nyayalens-ai --source . --region us-central1 --allow-unauthenticated
```

---

## 🧪 Automated Testing & Verification

Run the automated PyTest suite:

```powershell
.\backend\venv\Scripts\pytest backend/tests
```
