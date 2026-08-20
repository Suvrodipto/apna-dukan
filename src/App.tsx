import { useState, useEffect } from 'react';
import type { UserRole } from './types';
import type { Language } from './services/i18n';
import { pouchStore } from './db/pouchStore';
import { Navbar } from './components/common/Navbar';
import { POSTerminal } from './components/pos/POSTerminal';
import { KhataLedger } from './components/khata/KhataLedger';
import { InventoryCatalogue } from './components/inventory/InventoryCatalogue';
import { BillOCRScanner } from './components/ocr/BillOCRScanner';
import { SupplierOrders } from './components/supplier/SupplierOrders';
import { SalesAnalytics } from './components/analytics/SalesAnalytics';
import { TradableAssetStudio } from './components/marketplace/TradableAssetStudio';
import { SmartPricePredictor } from './components/analytics/SmartPricePredictor';
import { WorkerManagement } from './components/workers/WorkerManagement';
import { SyncStatusModal } from './components/sync/SyncStatusModal';
import { DukaanChatbot } from './components/chatbot/DukaanChatbot';
import { SupplierAIChatbot } from './components/supplier/SupplierAIChatbot';
import { LoginPage } from './components/auth/LoginPage';
import { AIPitchSimulationModal } from './components/pos/AIPitchSimulationModal';
import { Bot, PlayCircle, Truck } from 'lucide-react';

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('apna_dukan_session') === 'active';
  });

  const [activeTab, setActiveTab] = useState<string>('pos');
  const [role, setRole] = useState<UserRole>('owner');
  const [lang, setLang] = useState<Language>('en');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showSyncModal, setShowSyncModal] = useState<boolean>(false);
  const [showChatbot, setShowChatbot] = useState<boolean>(false);
  const [showSupplierChatbot, setShowSupplierChatbot] = useState<boolean>(false);
  const [showPitchModal, setShowPitchModal] = useState<boolean>(false);
  const [networkStatus, setNetworkStatus] = useState(pouchStore.getNetworkStatus());

  useEffect(() => {
    const unsubscribe = pouchStore.subscribe(() => {
      setNetworkStatus(pouchStore.getNetworkStatus());
    });
    return unsubscribe;
  }, []);

  // Keyboard Shortcuts Listener ([F2] POS, [F4] Khata, [F8] OCR)
  useEffect(() => {
    if (!isAuthenticated) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        setActiveTab('pos');
      } else if (e.key === 'F4') {
        e.preventDefault();
        setActiveTab('khata');
      } else if (e.key === 'F8') {
        e.preventDefault();
        setActiveTab('ocr');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthenticated]);

  useEffect(() => {
    if (role === 'cashier' && (activeTab === 'analytics' || activeTab === 'supplier' || activeTab === 'price-predictor' || activeTab === 'workers')) {
      setActiveTab('pos');
    } else if (role === 'supplier' && activeTab !== 'supplier' && activeTab !== 'marketplace' && activeTab !== 'price-predictor') {
      setActiveTab('supplier');
    }
  }, [role, activeTab]);

  const handleLoginSuccess = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setIsAuthenticated(true);
    localStorage.setItem('apna_dukan_session', 'active');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('apna_dukan_session');
  };

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0e] text-slate-100 flex flex-col font-sans relative selection:bg-amber-500 selection:text-slate-950">
      {/* Top Sliding Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        role={role}
        setRole={setRole}
        lang={lang}
        setLang={setLang}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        networkStatus={networkStatus}
        onOpenSyncModal={() => setShowSyncModal(true)}
        onOpenChatbot={() => setShowChatbot(true)}
        onOpenSupplierChatbot={() => setShowSupplierChatbot(true)}
        onOpenPitchModal={() => setShowPitchModal(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5">
        {activeTab === 'pos' && <POSTerminal lang={lang} soundEnabled={soundEnabled} />}
        {activeTab === 'khata' && <KhataLedger />}
        {activeTab === 'inventory' && <InventoryCatalogue />}
        {activeTab === 'workers' && <WorkerManagement />}
        {activeTab === 'price-predictor' && <SmartPricePredictor />}
        {activeTab === 'ocr' && <BillOCRScanner onLoadIntoPOS={() => setActiveTab('pos')} />}
        {activeTab === 'supplier' && <SupplierOrders role={role} />}
        {activeTab === 'analytics' && <SalesAnalytics />}
        {activeTab === 'marketplace' && <TradableAssetStudio />}
      </main>

      {/* FLOATING BUTTONS */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col sm:flex-row items-end sm:items-center gap-2">
        {/* Vendor Only Supplier Chatbot Trigger */}
        {role === 'supplier' && !showSupplierChatbot && (
          <button
            onClick={() => setShowSupplierChatbot(true)}
            className="p-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl shadow-2xl flex items-center gap-2 font-black text-xs transition-all transform hover:scale-105 active:scale-95 cursor-pointer border border-amber-300"
            title="Open Supplier AI Advisor"
          >
            <Truck className="w-4 h-4 fill-current" />
            <span className="tracking-wide uppercase font-extrabold">SUPPLIER AI</span>
          </button>
        )}

        <button
          onClick={() => setShowPitchModal(true)}
          className="p-3 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 rounded-2xl shadow-2xl flex items-center gap-2 font-black text-xs transition-all transform hover:scale-105 active:scale-95 cursor-pointer border border-amber-300 animate-pulse"
          title="Launch Judge Presentation AI Pitch Simulation"
        >
          <PlayCircle className="w-4 h-4 fill-current" />
          <span className="tracking-wide uppercase font-extrabold text-slate-950">SHOW AI IN ACTION</span>
        </button>

        {!showChatbot && (
          <button
            onClick={() => setShowChatbot(true)}
            className="p-3 bg-[#181824] hover:bg-[#20202c] border border-amber-500/30 text-amber-300 rounded-2xl shadow-2xl flex items-center gap-2 font-extrabold text-xs transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
            title="Open APNA DUKAN AI Assistant"
          >
            <div className="w-6 h-6 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
              <Bot className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="tracking-wide uppercase text-amber-300">APNA DUKAN AI</span>
          </button>
        )}
      </div>

      {/* AI CHATBOT WIDGET */}
      <DukaanChatbot
        isOpen={showChatbot}
        onClose={() => setShowChatbot(false)}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      {/* VENDOR-ONLY SUPPLIER AI CHATBOT */}
      <SupplierAIChatbot
        isOpen={showSupplierChatbot}
        onClose={() => setShowSupplierChatbot(false)}
      />

      {/* ✨ SHOW AI IN ACTION PITCH SIMULATION MODAL */}
      <AIPitchSimulationModal
        isOpen={showPitchModal}
        onClose={() => setShowPitchModal(false)}
      />

      {/* Low-Connectivity Sync Modal */}
      <SyncStatusModal
        isOpen={showSyncModal}
        onClose={() => setShowSyncModal(false)}
        networkStatus={networkStatus}
      />
    </div>
  );
}

export default App;
