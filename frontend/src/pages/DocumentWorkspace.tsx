import React, { useState, useEffect } from 'react';
import { fetchDocumentById } from '../services/api';
import type { DocumentSummary, Clause } from '../types';
import { BeforeYouSignCard } from '../components/document/BeforeYouSignCard';
import { ClauseExplorer } from '../components/document/ClauseExplorer';
import { QAChatWindow } from '../components/chat/QAChatWindow';
import { 
  FileText, Layers, Loader2, FileCheck2, AlertCircle,
  CheckCircle2, Sparkles, BookOpen, Tag 
} from 'lucide-react';

interface Props {
  docId: string;
  onNavigateToPrep: (docId: string) => void;
}

export const DocumentWorkspace: React.FC<Props> = ({ docId, onNavigateToPrep }) => {
  const [doc, setDoc] = useState<DocumentSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'before' | 'clauses' | 'summary'>('summary');
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
      // Default active tab based on whether document is legal
      if (data.classification?.is_legal_document && data.before_you_sign) {
        setActiveTab('before');
      } else {
        setActiveTab('summary');
      }
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
        <p className="text-sm font-medium">Categorizing document & parsing evidence index...</p>
      </div>
    );
  }

  const isLegal = doc.classification?.is_legal_document ?? true;
  const docType = doc.classification?.document_type || "Document";

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Document Workspace Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md ${
            isLegal 
              ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-indigo-500/20' 
              : 'bg-gradient-to-tr from-amber-600 to-orange-500 shadow-amber-500/20'
          }`}>
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <h1 className="text-xl font-bold text-white">{doc.title}</h1>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono border border-slate-700">
                {doc.page_count} Pages
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Detected: {docType}
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                isLegal 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}>
                Status: {isLegal ? 'Legal Analysis Mode' : 'General Document Mode'}
              </span>
            </div>
            <p className="text-xs text-slate-400 line-clamp-1 mt-1">{doc.executive_summary}</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 shrink-0">
          {isLegal && doc.before_you_sign && (
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
          )}

          {isLegal && (
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
          )}

          <button
            onClick={() => setActiveTab('summary')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'summary'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isLegal ? 'General Summary' : 'Document Overview'}
          </button>

          {isLegal ? (
            <button
              onClick={() => onNavigateToPrep(doc.doc_id)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center space-x-1.5"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Generate Prep Kit</span>
            </button>
          ) : (
            <span 
              title="Prep kit is only available for legal contracts."
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-900 text-slate-600 border border-slate-850 cursor-not-allowed flex items-center space-x-1.5"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-slate-600" />
              <span>Prep Kit N/A</span>
            </span>
          )}
        </div>
      </div>

      {/* NON-LEGAL DOCUMENT NOTICE BANNER */}
      {!isLegal && (
        <div className="bg-amber-950/30 border border-amber-500/40 rounded-2xl p-4 flex items-start space-x-3 text-amber-200 text-xs shadow-lg">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-sm text-amber-300">Non-Legal Document Detected</span>
            <p className="text-slate-300 leading-relaxed">
              This document appears to contain interview preparation material rather than a legal agreement. Legal contract analysis is not applicable.
            </p>
          </div>
        </div>
      )}

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar: Clauses (Legal) or Key Topics (Non-Legal) */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
            {isLegal ? (
              <>
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>Clause Inventory</span>
              </>
            ) : (
              <>
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Document Structure & Topics</span>
              </>
            )}
          </h3>

          <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
            {isLegal ? (
              doc.clauses.map(c => (
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
              ))
            ) : (
              (doc.key_topics && doc.key_topics.length > 0 ? doc.key_topics : ["Document Overview"]).map((topic, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-850 text-xs space-y-1"
                >
                  <div className="flex items-center space-x-1.5 text-amber-400 font-semibold text-[11px]">
                    <Tag className="w-3 h-3" />
                    <span>Topic #{idx + 1}</span>
                  </div>
                  <div className="font-bold text-slate-200 line-clamp-2">{topic}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Center Main Analysis Panel */}
        <div className="lg:col-span-5 space-y-6">
          {isLegal && activeTab === 'before' && doc.before_you_sign && (
            <BeforeYouSignCard report={doc.before_you_sign} />
          )}

          {isLegal && activeTab === 'clauses' && (
            <ClauseExplorer clauses={doc.clauses} />
          )}

          {/* General Document Overview / Non-Legal Summary */}
          {(!isLegal || activeTab === 'summary') && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {docType}
                  </span>
                  <span className="text-xs text-slate-400 border border-slate-700 px-2 py-0.5 rounded-md">
                    Confidence: {doc.classification?.confidence ? `${Math.round(doc.classification.confidence * 100)}%` : 'Rule Heuristic'}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white mt-2">{doc.title}</h2>
                <p className="text-xs text-slate-400 mt-1">{doc.classification?.reason}</p>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>Executive Summary</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {doc.executive_summary}
                  </p>
                </div>

                {doc.key_topics && doc.key_topics.length > 0 && (
                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
                    <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-sm">
                      <BookOpen className="w-4 h-4" />
                      <span>Key Topics Covered</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {doc.key_topics.map((item, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {doc.key_takeaways && doc.key_takeaways.length > 0 && (
                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
                    <div className="flex items-center space-x-2 text-amber-400 font-semibold text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Key Takeaways & Important Information</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {doc.key_takeaways.map((item, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className="text-amber-400 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Evidence-Grounded Q&A Chat */}
        <div className="lg:col-span-4">
          <QAChatWindow 
            docId={doc.doc_id} 
            docTitle={doc.title} 
            isLegalDocument={isLegal}
            documentType={docType}
          />
        </div>
      </div>
    </div>
  );
};
