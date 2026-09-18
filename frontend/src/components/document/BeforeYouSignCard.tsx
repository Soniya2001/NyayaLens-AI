import React from 'react';
import type { BeforeYouSignReport } from '../../types';
import { CheckCircle2, DollarSign, ShieldAlert, FileQuestion, HelpCircle, Calendar, ArrowRight } from 'lucide-react';

interface Props {
  report: BeforeYouSignReport;
  onAskQuestion?: (query: string) => void;
}

export const BeforeYouSignCard: React.FC<Props> = ({ report, onAskQuestion }) => {
  return (
    <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Before You Sign Report
            </span>
            {report.jurisdiction_noted && (
              <span className="text-xs text-slate-400 border border-slate-700 px-2 py-0.5 rounded-md">
                📍 {report.jurisdiction_noted}
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-white mt-1.5">{report.document_title}</h2>
          <p className="text-xs text-slate-400">Document Type: {report.document_type}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-sm">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>What Am I Agreeing To?</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {report.what_you_are_agreeing_to.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-indigo-400 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-sm">
            <DollarSign className="w-4 h-4 shrink-0" />
            <span>Financial & Payment Obligations</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {report.what_you_must_pay.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center space-x-2 text-blue-400 font-semibold text-sm">
            <Calendar className="w-4 h-4 shrink-0" />
            <span>Your Required Responsibilities</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {report.your_key_obligations.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-blue-400 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center space-x-2 text-amber-400 font-semibold text-sm">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Cancellation & Exit Terms</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {report.cancellation_and_exit_rules.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div className="bg-rose-950/20 border border-rose-900/40 rounded-xl p-4 space-y-2">
          <div className="flex items-center space-x-2 text-rose-400 font-semibold text-sm">
            <FileQuestion className="w-4 h-4 shrink-0" />
            <span>Missing or Ambiguous Terms</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {report.missing_or_ambiguous_information.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-purple-950/20 border border-purple-900/40 rounded-xl p-4 space-y-2">
          <div className="flex items-center space-x-2 text-purple-300 font-semibold text-sm">
            <HelpCircle className="w-4 h-4 shrink-0" />
            <span>Questions to Ask Before Signing</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {report.questions_for_lawyer_or_other_party.map((question, idx) => (
              <li key={idx} className="flex items-start justify-between group">
                <div className="flex items-start space-x-2 pr-2">
                  <span className="text-purple-400 font-bold">•</span>
                  <span>{question}</span>
                </div>
                {onAskQuestion && (
                  <button
                    onClick={() => onAskQuestion(question)}
                    className="text-[11px] text-purple-400 hover:text-purple-200 underline font-medium shrink-0 flex items-center space-x-1 opacity-90 group-hover:opacity-100"
                  >
                    <span>Ask AI</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
