import React, { useState, useEffect } from 'react';
import { fetchDocuments, uploadDocument } from '../services/api';
import type { DocumentSummary } from '../types';
import { FileText, Calendar, ArrowRight, Plus, Loader2 } from 'lucide-react';

interface DashboardProps {
  onSelectDoc: (docId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectDoc }) => {
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = async () => {
    try {
      const data = await fetchDocuments();
      setDocuments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const newDoc = await uploadDocument(file);
      await loadDocs();
      onSelectDoc(newDoc.doc_id);
    } catch (err) {
      alert('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-white">Document Dashboard</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {documents.length} Active Files
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Manage, analyze, and query your uploaded contracts and lease agreements.</p>
        </div>

        <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center space-x-2">
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing Document...</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Upload New Document</span>
            </>
          )}
          <input type="file" accept=".pdf,.docx,.txt" onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <FileText className="w-5 h-5 text-indigo-400" />
          <span>Ingested Documents & Synthetic Samples</span>
        </h2>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm flex items-center justify-center space-x-2">
            <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
            <span>Loading document library...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map(doc => (
              <div
                key={doc.doc_id}
                onClick={() => onSelectDoc(doc.doc_id)}
                className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 space-y-4 transition-all hover:scale-[1.01] cursor-pointer shadow-lg flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-850">
                      {doc.file_type.toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                      {doc.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {doc.executive_summary}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-850 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{doc.page_count} Pages</span>
                  </span>

                  <span className="text-indigo-400 font-semibold flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                    <span>Open Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
