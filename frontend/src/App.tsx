import { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { DocumentWorkspace } from './pages/DocumentWorkspace';
import { ContractComparer } from './components/compare/ContractComparer';
import { PrepKitView } from './components/prep/PrepKitView';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [activeDocId, setActiveDocId] = useState<string | null>('emp_001');

  const handleSelectDoc = (docId: string) => {
    setActiveDocId(docId);
    setCurrentTab('workspace');
  };

  const handleNavigateToPrep = (docId: string) => {
    setActiveDocId(docId);
    setCurrentTab('prep');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        activeDocId={activeDocId}
      />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'landing' && (
          <LandingPage
            onSelectDoc={handleSelectDoc}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === 'dashboard' && (
          <Dashboard
            onSelectDoc={handleSelectDoc}
          />
        )}

        {currentTab === 'workspace' && activeDocId && (
          <DocumentWorkspace
            docId={activeDocId}
            onNavigateToPrep={handleNavigateToPrep}
          />
        )}

        {currentTab === 'compare' && (
          <ContractComparer />
        )}

        {currentTab === 'prep' && (
          <PrepKitView docId={activeDocId || undefined} />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
