import React, { useState, useEffect } from 'react';
import { fetchDocuments, fetchPrepKit } from '../../services/api';
import type { DocumentSummary, PrepKit } from '../../types';
import { FileCheck2, Printer, Calendar, CheckSquare, HelpCircle, FileText, UserCheck } from 'lucide-react';

export const PrepKitView: React.FC<{ docId?: string }> = ({ docId: initialDocId }) => {
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string>(initialDocId || '');
  const [prepKit, setPrepKit] = useState<PrepKit | null>(null);

  useEffect(() => {
    loadDocs();
  }, []);

  useEffect(() => {
    if (selectedDocId) {
      loadKit(selectedDocId);
    }
  }, [selectedDocId]);

  const loadDocs = async () => {
    try {
      const list = await fetchDocuments();
      setDocuments(list);
      if (!selectedDocId && list.length > 0) {
        setSelectedDocId(list[0].doc_id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadKit = async (id: string) => {
    try {
      const kit = await fetchPrepKit(id);
      setPrepKit(kit);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
            <FileCheck2 className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Legal Professional Preparation Kit</h1>
            <p className="text-xs text-slate-400">
              Generate a structured, copyable or printable summary to make your consultation with a lawyer fast and cost-effective.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={selectedDocId}
            onChange={e => setSelectedDocId(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:border-indigo-500 outline-none"
          >
            {documents.map(d => (
              <option key={d.doc_id} value={d.doc_id}>
                {d.title}
              </option>
            ))}
          </select>

          <button
            onClick={handlePrint}
            disabled={!prepKit}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center space-x-2 shadow-lg shadow-indigo-600/20"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Export PDF</span>
          </button>
        </div>
      </div>

      {prepKit && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-8 shadow-2xl print:bg-white print:text-black print:p-0 print:border-none">
          <div className="border-b border-slate-800 pb-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 px-2.5 py-1 rounded bg-indigo-950/50 border border-indigo-800/40 print:text-black print:border-black">
                Legal Consultation Packet
              </span>
              <span className="text-xs text-slate-500">Date: {new Date().toLocaleDateString()}</span>
            </div>
            <h2 className="text-2xl font-bold text-white print:text-black">{prepKit.doc_title}</h2>
            <p className="text-xs text-slate-300 leading-relaxed print:text-gray-700">{prepKit.matter_summary}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3 print:bg-gray-50 print:border-gray-300">
              <div className="flex items-center space-x-2 text-indigo-400 font-bold text-sm print:text-black">
                <UserCheck className="w-4 h-4" />
                <span>Parties & Key Contacts Involved</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300 print:text-black">
                {prepKit.parties_involved.map((party, idx) => (
                  <li key={idx} className="flex items-center space-x-2">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>{party}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3 print:bg-gray-50 print:border-gray-300">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm print:text-black">
                <Calendar className="w-4 h-4" />
                <span>Timeline of Critical Dates & Events</span>
              </div>
              <div className="space-y-2 text-xs">
                {prepKit.timeline.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b border-slate-850 pb-1.5 print:border-gray-300">
                    <span className="font-mono text-emerald-400 font-medium print:text-black">{item.date}</span>
                    <span className="text-slate-300 print:text-black">{item.event}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2 print:text-black">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Key Clause Inventory & Particulars</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {prepKit.key_clauses_inventory.map((item, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-850 rounded-xl p-4 text-xs space-y-1 print:bg-gray-50">
                  <span className="font-bold text-indigo-300 block print:text-black">{item.clause}</span>
                  <span className="text-slate-400 leading-relaxed block print:text-gray-700">{item.detail}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3 print:bg-gray-50">
              <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm print:text-black">
                <CheckSquare className="w-4 h-4" />
                <span>Evidence & Documents Checklist</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300 print:text-black">
                {prepKit.evidence_checklist.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <input type="checkbox" className="mt-0.5 rounded border-slate-700 bg-slate-900" defaultChecked />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-purple-950/20 border border-purple-900/40 rounded-xl p-5 space-y-3 print:bg-purple-50">
              <div className="flex items-center space-x-2 text-purple-300 font-bold text-sm print:text-black">
                <HelpCircle className="w-4 h-4" />
                <span>Prepared Questions for Your Attorney</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-200 print:text-black">
                {prepKit.questions_to_ask_lawyer.map((q, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-purple-400 font-bold">•</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
