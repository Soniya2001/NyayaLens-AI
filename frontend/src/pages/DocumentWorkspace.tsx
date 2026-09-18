import React, { useState, useEffect } from 'react';
import { fetchDocumentById } from '../services/api';
import type { DocumentSummary, Clause } from '../types';
import { BeforeYouSignCard } from '../components/document/BeforeYouSignCard';
import { ClauseExplorer } from '../components/document/ClauseExplorer';
import { QAChatWindow } from '../components/chat/QAChatWindow';
import { FileText, Layers, Loader2, FileCheck2 } from 'lucide-react';

interface Props {
  docId: string;
  onNavigateToPrep: (docId: string) => void;
}

export const DocumentWorkspace: React.FC<Props> = ({ docId, onNavigateToPrep }) => {
  const [doc, setDoc] = useState<DocumentSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'before' | 'clauses' | 'summary'>('before');
  const [highlightClause, setHighlightClause] = useState<Clause | null>(null);

  useEffect(() => {
    if (docId) {
      loadDoc(docId);
    }
  }, [docId]);

  const loadDoc = async (id: string) => {
    setLoading(true);
    try {
      const data = await fetchDocumentById(id);
      setDoc(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !doc) {
    return (
      <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
        <p className="text-sm font-medium">Extracting clauses and constructing evidence index...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-white">{doc.title}</h1>
              <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono border border-indigo-500/30">
                {doc.page_count} Pages
              </span>
            </div>
            <p className="text-xs text-slate-400 line-clamp-1">{doc.executive_summary}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('before')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'before'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Before You Sign
          </button>
          <button
            onClick={() => setActiveTab('clauses')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'clauses'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Clause Explorer ({doc.clauses.length})
          </button>
          <button
            onClick={() => onNavigateToPrep(doc.doc_id)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center space-x-1.5"
          >
            <FileCheck2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Generate Prep Kit</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Clause Inventory</span>
          </h3>

          <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
            {doc.clauses.map(c => (
              <div
                key={c.id}
                onClick={() => {
                  setActiveTab('clauses');
                  setHighlightClause(c);
                }}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                  highlightClause?.id === c.id
                    ? 'bg-indigo-950/60 border-indigo-500/60 text-white'
                    : 'bg-slate-950 border-slate-850 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span>Page {c.page_number}</span>
                  <span className="text-indigo-400 font-semibold">{c.category}</span>
                </div>
                <div className="font-bold text-slate-100 line-clamp-1">{c.title}</div>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{c.plain_summary}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          {activeTab === 'before' && (
            <BeforeYouSignCard report={doc.before_you_sign} />
          )}

          {activeTab === 'clauses' && (
            <ClauseExplorer clauses={doc.clauses} />
          )}
        </div>

        <div className="lg:col-span-4">
          <QAChatWindow docId={doc.doc_id} docTitle={doc.title} />
        </div>
      </div>
    </div>
  );
};
