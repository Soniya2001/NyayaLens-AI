import React from 'react';
import { ShieldCheck, Scale, Info } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center space-x-2 text-slate-200 font-bold text-sm mb-2">
              <Scale className="w-4 h-4 text-indigo-400" />
              <span>NyayaLens AI</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Evidence-First Legal Intelligence. Empowering citizens, renters, employees, and freelancers to understand legal agreements before signing.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 mb-2 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Privacy & Data Guarantee</span>
            </h4>
            <ul className="space-y-1 text-slate-400">
              <li>• Document processing is isolated per session.</li>
              <li>• Documents are never used to train global AI models.</li>
              <li>• User-controlled transient deletion policies.</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 mb-2 flex items-center space-x-1.5">
              <Info className="w-4 h-4 text-amber-400" />
              <span>Important Legal Notice</span>
            </h4>
            <p className="text-slate-400 leading-relaxed">
              NyayaLens AI provides general legal information and document assistance. It does not provide legal advice or create an attorney-client relationship. For binding determinations, consult a qualified lawyer.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-4 flex flex-col sm:flex-row justify-between items-center text-slate-500">
          <p>© {new Date().getFullYear()} NyayaLens AI — Built with Google Cloud & Gemini 2.5</p>
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <span>Jurisdiction Engine: Indian Law Ready</span>
            <span>•</span>
            <span>Multilingual Roadmap: English, Tamil, Hindi</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
