import React, { useState, useEffect } from 'react';
import { fetchSamples, uploadDocument } from '../services/api';
import type { SampleDoc, DocumentSummary } from '../types';
import { Upload, Sparkles, ShieldCheck, GitCompare, FileText, ArrowRight, CheckCircle2, AlertCircle, Scale } from 'lucide-react';

interface LandingPageProps {
  onSelectDoc: (docId: string) => void;
  onNavigate: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectDoc, onNavigate }) => {
  const [samples, setSamples] = useState<SampleDoc[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSamples()
      .then(setSamples)
      .catch(err => console.error(err));
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const summary: DocumentSummary = await uploadDocument(file);
      onSelectDoc(summary.doc_id);
    } catch (err) {
      setError('Failed to process document. Please upload a valid PDF or DOCX file.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-16 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-6 pt-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
          <Sparkles className="w-4 h-4" />
          <span>Evidence-First Legal Intelligence Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Understand the fine print. <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-500 bg-clip-text text-transparent">
            Navigate your next step.
          </span>
        </h1>

        <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          NyayaLens AI transforms complex contracts, leases, and agreements into clear, structured explanations with page-cited evidence, non-deterministic risk labels, and actionable preparation kits.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <label className="w-full sm:w-auto cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-xl shadow-indigo-600/25 flex items-center justify-center space-x-2">
            <Upload className="w-5 h-5" />
            <span>{uploading ? 'Processing Contract...' : 'Analyze a Document'}</span>
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>

          <button
            onClick={() => onNavigate('compare')}
            className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-8 py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center justify-center space-x-2"
          >
            <GitCompare className="w-5 h-5 text-indigo-400" />
            <span>Compare Contracts</span>
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/50 border border-rose-800 rounded-xl text-xs text-rose-300 flex items-center justify-center space-x-2 max-w-md mx-auto">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Zero-Setup Instant Demo</span>
            <h2 className="text-2xl font-bold text-white mt-1">Explore Synthetic Legal Contracts</h2>
            <p className="text-xs text-slate-400">Select a pre-analyzed synthetic agreement to test Document Simplification, Grounded Q&A, and Clause Explorer instantly.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {samples.map(sample => (
            <div
              key={sample.doc_id}
              onClick={() => onSelectDoc(sample.doc_id)}
              className="bg-slate-950 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 transition-all hover:scale-[1.01] cursor-pointer space-y-4 group shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white group-hover:text-indigo-300 transition-colors">
                      {sample.title}
                    </h3>
                    <span className="text-xs text-slate-500 font-mono">{sample.file_name}</span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-indigo-400 transition-colors" />
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {sample.executive_summary}
              </p>

              <div className="pt-2 flex items-center justify-between text-xs text-indigo-400 font-semibold">
                <span>View "Before You Sign" Report & RAG Chat</span>
                <span className="group-hover:translate-x-1 transition-transform">Explore →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Before You Sign Report</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Get an instant overview of your financial obligations, required responsibilities, cancellation terms, and missing details before signing any agreement.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Evidence-Grounded RAG</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Ask natural language questions and receive answers supported strictly by exact page numbers, section headers, and verbatim quotes.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Scale className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Legal Consultation Prep Kit</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Generate printable matter packets containing timelines, evidence checklists, and targeted questions for your lawyer to maximize legal advice efficiency.
          </p>
        </div>
      </div>
    </div>
  );
};
