import React, { useState } from 'react';
import type { Clause, RiskLabel } from '../../types';
import { AlertTriangle, Info, HelpCircle, ShieldCheck, FileText } from 'lucide-react';

interface Props {
  clauses: Clause[];
  onSelectClause?: (clause: Clause) => void;
}

export const ClauseExplorer: React.FC<Props> = ({ clauses, onSelectClause }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', ...Array.from(new Set(clauses.map(c => c.category)))];

  const filtered = selectedCategory === 'ALL'
    ? clauses
    : clauses.filter(c => c.category === selectedCategory);

  const getRiskBadge = (label: RiskLabel) => {
    switch (label) {
      case 'Requires Professional Review':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Requires Review</span>
          </span>
        );
      case 'Potential Concern':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Potential Concern</span>
          </span>
        );
      case 'Important to Understand':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <Info className="w-3.5 h-3.5" />
            <span>Important to Understand</span>
          </span>
        );
      case 'Missing or Unclear Information':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Unclear Info</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Standard Clause</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map(clause => (
          <div
            key={clause.id}
            onClick={() => onSelectClause && onSelectClause(clause)}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 transition-all space-y-4 shadow-lg cursor-pointer group"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono text-indigo-400 font-bold">
                    {clause.section_number || `Page ${clause.page_number}`}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-xs text-slate-400 font-medium">{clause.category}</span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors mt-0.5">
                  {clause.title}
                </h3>
              </div>
              <div>{getRiskBadge(clause.risk_label)}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950/80 border border-slate-850 rounded-lg p-3 space-y-1">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>Original Clause Text (Page {clause.page_number})</span>
                </div>
                <p className="text-slate-300 font-mono italic leading-relaxed">
                  "{clause.original_text}"
                </p>
              </div>

              <div className="bg-indigo-950/20 border border-indigo-900/40 rounded-lg p-3 space-y-2">
                <div className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider">
                  Plain-English Translation
                </div>
                <p className="text-slate-200 leading-relaxed font-medium">
                  {clause.plain_summary}
                </p>
                <div className="pt-1 border-t border-indigo-900/30">
                  <span className="font-semibold text-indigo-300">Why it matters: </span>
                  <span className="text-slate-300">{clause.why_it_matters}</span>
                </div>
              </div>
            </div>

            {clause.suggested_questions.length > 0 && (
              <div className="bg-slate-950/50 rounded-lg p-3 space-y-1 text-xs">
                <div className="font-semibold text-amber-400 flex items-center space-x-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Questions to Ask Before Signing</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
                  {clause.suggested_questions.map((q, idx) => (
                    <li key={idx}>{q}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
