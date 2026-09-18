import React, { useState, useEffect } from 'react';
import { fetchDocuments, compareContracts } from '../../services/api';
import type { DocumentSummary, ContractComparisonResponse, ClauseDiff } from '../../types';
import { GitCompare, PlusCircle, MinusCircle, RefreshCw, AlertCircle, HelpCircle, Loader2 } from 'lucide-react';

export const ContractComparer: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [docAId, setDocAId] = useState<string>('');
  const [docBId, setDocBId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [comparison, setComparison] = useState<ContractComparisonResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = async () => {
    try {
      const list = await fetchDocuments();
      setDocuments(list);
      if (list.length >= 2) {
        setDocAId(list[0].doc_id);
        setDocBId(list[1].doc_id);
      } else if (list.length === 1) {
        setDocAId(list[0].doc_id);
      }
    } catch (err) {
      setError('Failed to load documents for comparison');
    }
  };

  const handleRunComparison = async () => {
    if (!docAId || !docBId) {
      setError('Please select two documents to compare');
      return;
    }
    if (docAId === docBId) {
      setError('Please select two distinct contract versions');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const res = await compareContracts(docAId, docBId);
      setComparison(res);
    } catch (err) {
      setError('Error generating contract comparison diff');
    } finally {
      setLoading(false);
    }
  };

  const getBadge = (changeType: ClauseDiff['change_type']) => {
    switch (changeType) {
      case 'ADDED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Clause Added in Doc B</span>
          </span>
        );
      case 'REMOVED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <MinusCircle className="w-3.5 h-3.5" />
            <span>Clause Removed in Doc B</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Terms Modified</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
            <GitCompare className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Side-by-Side Contract Comparison Engine</h1>
            <p className="text-xs text-slate-400">
              Select two contract versions to evaluate added, removed, or modified terms, practical implications, and key exit questions.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
            <label className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
              Document Version A (Base Contract)
            </label>
            <select
              value={docAId}
              onChange={e => setDocAId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg p-2.5 focus:border-indigo-500 outline-none"
            >
              {documents.map(d => (
                <option key={d.doc_id} value={d.doc_id}>
                  {d.title} ({d.file_name})
                </option>
              ))}
            </select>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
            <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
              Document Version B (New / Revised Contract)
            </label>
            <select
              value={docBId}
              onChange={e => setDocBId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg p-2.5 focus:border-emerald-500 outline-none"
            >
              {documents.map(d => (
                <option key={d.doc_id} value={d.doc_id}>
                  {d.title} ({d.file_name})
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl text-xs text-rose-300 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={handleRunComparison}
          disabled={loading || !docAId || !docBId}
          className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Matching & Aligning Clauses...</span>
            </>
          ) : (
            <>
              <GitCompare className="w-4 h-4" />
              <span>Compare Agreements Now</span>
            </>
          )}
        </button>
      </div>

      {comparison && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-2">
              <div>
                <h2 className="text-lg font-bold text-white">Comparison Executive Summary</h2>
                <p className="text-xs text-slate-400">{comparison.summary_of_changes}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  +{comparison.added_count} Added
                </span>
                <span className="text-xs px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                  -{comparison.removed_count} Removed
                </span>
                <span className="text-xs px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                  ~{comparison.modified_count} Modified
                </span>
              </div>
            </div>

            <div className="space-y-6 pt-2">
              {comparison.diffs.map((diff, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-850 pb-3">
                    <div>
                      <span className="text-xs font-semibold text-indigo-400">{diff.category}</span>
                      <h3 className="text-base font-bold text-white mt-0.5">{diff.clause_title}</h3>
                    </div>
                    <div>{getBadge(diff.change_type)}</div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Doc A: {comparison.doc_a_title}
                      </span>
                      <p className="text-slate-300 font-mono italic leading-relaxed">
                        {diff.doc_a_text || '(Clause did not exist in Doc A)'}
                      </p>
                    </div>

                    <div className="bg-slate-900 border border-indigo-900/40 rounded-lg p-3 space-y-1">
                      <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider block">
                        Doc B: {comparison.doc_b_title}
                      </span>
                      <p className="text-slate-200 font-mono italic leading-relaxed">
                        {diff.doc_b_text || '(Clause removed in Doc B)'}
                      </p>
                    </div>
                  </div>

                  <div className="bg-indigo-950/20 border border-indigo-900/30 rounded-xl p-4 text-xs space-y-2">
                    <div>
                      <span className="font-bold text-indigo-300">Practical Meaning of Change: </span>
                      <span className="text-slate-200">{diff.practical_meaning}</span>
                    </div>
                    <div>
                      <span className="font-bold text-emerald-400">Potential Practical Implications: </span>
                      <span className="text-slate-300">{diff.potential_implications}</span>
                    </div>
                  </div>

                  {diff.questions_for_review.length > 0 && (
                    <div className="text-xs text-slate-300 flex items-start space-x-2 pt-1">
                      <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-amber-400">Questions for Professional Review: </span>
                        <span>{diff.questions_for_review.join(' • ')}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
