import type { 
  DocumentSummary, ChatResponse,
  ContractComparisonResponse, PrepKit, SampleDoc 
} from '../types';

const API_BASE = '/api';

export async function fetchSamples(): Promise<SampleDoc[]> {
  const res = await fetch(`${API_BASE}/samples`);
  if (!res.ok) throw new Error('Failed to fetch sample documents');
  return res.json();
}

export async function fetchDocuments(): Promise<DocumentSummary[]> {
  const res = await fetch(`${API_BASE}/documents`);
  if (!res.ok) throw new Error('Failed to fetch document list');
  return res.json();
}

export async function fetchDocumentById(docId: string): Promise<DocumentSummary> {
  const res = await fetch(`${API_BASE}/documents/${docId}`);
  if (!res.ok) throw new Error(`Failed to fetch document ${docId}`);
  return res.json();
}

export async function uploadDocument(file: File): Promise<DocumentSummary> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/documents/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to upload document');
  return res.json();
}

export async function askQuestion(docId: string, query: string): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE}/documents/${docId}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error('Failed to send question');
  return res.json();
}

export async function compareContracts(docAId: string, docBId: string): Promise<ContractComparisonResponse> {
  const res = await fetch(`${API_BASE}/compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ doc_a_id: docAId, doc_b_id: docBId }),
  });
  if (!res.ok) throw new Error('Failed to compare contracts');
  return res.json();
}

export async function fetchPrepKit(docId: string): Promise<PrepKit> {
  const res = await fetch(`${API_BASE}/documents/${docId}/prep-kit`);
  if (!res.ok) throw new Error('Failed to generate Prep Kit');
  return res.json();
}
