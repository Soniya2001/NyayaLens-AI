import React from 'react';
import { Scale, ShieldAlert, FileText, GitCompare, FileCheck2, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  activeDocId: string | null;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, activeDocId }) => {
  return (
    <header role="banner" className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div 
            role="button"
            tabIndex={0}
            aria-label="NyayaLens AI Home Page"
            className="flex items-center space-x-3 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-1"
            onClick={() => setCurrentTab('landing')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setCurrentTab('landing'); }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Scale className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xl tracking-tight text-white">NyayaLens</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">AI</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Understand fine print. Navigate next steps.</p>
            </div>
          </div>

          <nav role="navigation" aria-label="Main Navigation Menu" className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setCurrentTab('dashboard')}
              aria-label="View Documents List"
              aria-current={currentTab === 'dashboard' ? 'page' : undefined}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                currentTab === 'dashboard' 
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" aria-hidden="true" />
              <span>Documents</span>
            </button>

            <button
              onClick={() => setCurrentTab('workspace')}
              aria-label="Open Document Workspace"
              aria-current={currentTab === 'workspace' ? 'page' : undefined}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                currentTab === 'workspace' 
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-indigo-400" aria-hidden="true" />
              <span>Document Workspace</span>
              {activeDocId && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true"></span>
              )}
            </button>

            <button
              onClick={() => setCurrentTab('compare')}
              aria-label="Open Contract Comparison Engine"
              aria-current={currentTab === 'compare' ? 'page' : undefined}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                currentTab === 'compare' 
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <GitCompare className="w-4 h-4" aria-hidden="true" />
              <span>Compare Contracts</span>
            </button>

            <button
              onClick={() => setCurrentTab('prep')}
              aria-label="Open Legal Consultation Prep Kit"
              aria-current={currentTab === 'prep' ? 'page' : undefined}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                currentTab === 'prep' 
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <FileCheck2 className="w-4 h-4" aria-hidden="true" />
              <span>Prep Kit</span>
            </button>
          </nav>

          <div 
            role="status"
            aria-live="polite"
            className="hidden lg:flex items-center space-x-2 bg-slate-800/80 border border-slate-700/60 px-3 py-1.5 rounded-full text-xs text-slate-300"
          >
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
            <span className="truncate max-w-[260px]">Legal Information Assistant — Not Legal Advice</span>
          </div>
        </div>
      </div>
    </header>
  );
};

