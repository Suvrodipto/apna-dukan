import React, { useState, useRef } from 'react';
import type { UserRole } from '../../types';
import type { Language } from '../../services/i18n';
import { TRANSLATIONS } from '../../services/i18n';
import { 
  Store, 
  Receipt, 
  BookOpen, 
  Package, 
  ScanLine, 
  Truck, 
  BarChart3, 
  Layers, 
  ChevronDown,
  Globe,
  Volume2,
  VolumeX,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Bot,
  LogOut,
  PlayCircle,
  TrendingUp,
  Users,
  Wifi,
  WifiOff
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  networkStatus: {
    isOnline: boolean;
    networkMode: 'Online' | 'Low-Bandwidth (2G)' | 'Offline';
    pendingCount: number;
  };
  onOpenSyncModal: () => void;
  onOpenChatbot?: () => void;
  onOpenSupplierChatbot?: () => void;
  onOpenPitchModal?: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  role,
  setRole,
  lang,
  setLang,
  soundEnabled,
  setSoundEnabled,
  networkStatus,
  onOpenSyncModal,
  onOpenChatbot,
  onOpenSupplierChatbot,
  onOpenPitchModal,
  onLogout
}) => {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const navContainerRef = useRef<HTMLDivElement>(null);

  const t = TRANSLATIONS[lang];

  const navItems = [
    { id: 'pos', label: t.posBilling, icon: Receipt, roles: ['owner', 'cashier'], badge: 'POS' },
    { id: 'khata', label: t.khataLedger, icon: BookOpen, roles: ['owner', 'cashier'], badge: 'Udhaar' },
    { id: 'inventory', label: t.catalogueStock, icon: Package, roles: ['owner', 'cashier'] },
    { id: 'workers', label: 'Worker Management 👷', icon: Users, roles: ['owner'], badge: 'Festival HR' },
    { id: 'price-predictor', label: 'Price & Margin Predictor', icon: TrendingUp, roles: ['owner', 'supplier'], badge: 'AI ML' },
    { id: 'ocr', label: t.billOCR, icon: ScanLine, roles: ['owner', 'cashier'], badge: 'OCR' },
    { id: 'supplier', label: t.supplierOrders, icon: Truck, roles: ['owner', 'supplier'] },
    { id: 'analytics', label: t.salesAnalytics, icon: BarChart3, roles: ['owner'] },
    { id: 'marketplace', label: t.assetMarketplace, icon: Layers, roles: ['owner', 'cashier', 'supplier'], badge: '10 Assets' }
  ];

  const scrollNav = (direction: 'left' | 'right') => {
    if (navContainerRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      navContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <header className="glass-panel sticky top-0 z-40 border-b border-amber-500/20 bg-[#121218]/95 backdrop-blur-xl shadow-2xl">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#181822] via-[#14141c] to-[#0c0c10] px-4 py-1 border-b border-amber-500/20 text-[11px] text-amber-200 flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
          <span className="font-extrabold text-white tracking-wide uppercase text-[10px]">APNA DUKAN ULTRA PRO:</span>
          <span className="hidden sm:inline">Worker HR & Festival Payroll • Price Predictor • Supplier AI • VIP Club</span>
          
          <div className="ml-auto flex items-center gap-2">
            {/* Show AI in Action Pitch Button */}
            {onOpenPitchModal && (
              <button
                onClick={onOpenPitchModal}
                className="flex items-center gap-1.5 px-3 py-0.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 rounded-full font-black text-[10px] shadow-lg shadow-amber-500/20 hover:scale-105 transition-transform cursor-pointer border border-amber-300 animate-pulse"
                title="Launch Judge Presentation AI Storytelling Simulation"
              >
                <PlayCircle className="w-3.5 h-3.5 fill-current" />
                <span>✨ SHOW AI IN ACTION</span>
              </button>
            )}

            {/* Vendor-Only Supplier AI Assistant Trigger */}
            {role === 'supplier' && onOpenSupplierChatbot && (
              <button
                onClick={onOpenSupplierChatbot}
                className="flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-500 text-slate-950 border border-amber-300 rounded-full font-black text-[10px] shadow cursor-pointer animate-pulse"
              >
                <Truck className="w-3 h-3 fill-current" />
                <span>SUPPLIER AI ADVISOR</span>
              </button>
            )}

            <button
              onClick={onOpenChatbot}
              className="flex items-center gap-1.5 px-2.5 py-0.5 bg-[#181824] hover:bg-[#20202c] border border-amber-500/30 text-amber-300 rounded-full font-bold text-[10px] shadow-sm cursor-pointer"
            >
              <Bot className="w-3 h-3 text-amber-400" />
              <span>ASK AI</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => setActiveTab('pos')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-yellow-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 animate-glow">
              <Store className="w-6 h-6 text-slate-950 font-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white tracking-tight">APNA<span className="text-amber-400"> DUKAN</span></span>
                <span className="px-2 py-0.5 text-[10px] font-black bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full">v5.0 HR Enterprise</span>
              </div>
              <p className="text-[11px] text-slate-400">{t.subtitle}</p>
            </div>
          </div>

          {/* SLIDING NAVIGATION BAR */}
          <div className="relative flex-1 max-w-3xl overflow-hidden hidden md:flex items-center">
            <button
              onClick={() => scrollNav('left')}
              className="p-1 rounded-lg bg-[#181822] text-slate-400 hover:text-white border border-slate-800 z-10 mr-1 shadow"
              title="Scroll Left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div
              ref={navContainerRef}
              className="flex items-center space-x-1.5 overflow-x-auto sliding-nav-container py-1 scroll-smooth no-scrollbar"
            >
              {navItems
                .filter(item => item.roles.includes(role))
                .map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 border ${
                        isActive
                          ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 border-amber-300 font-extrabold shadow-lg shadow-amber-500/25 scale-105'
                          : 'bg-[#181822] border-slate-800 text-slate-300 hover:bg-[#20202c] hover:text-white hover:border-slate-700'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className={`px-1.5 py-0.2 text-[8px] font-black rounded uppercase ${
                          isActive
                            ? 'bg-slate-950 text-amber-300'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
            </div>

            <button
              onClick={() => scrollNav('right')}
              className="p-1 rounded-lg bg-[#181822] text-slate-400 hover:text-white border border-slate-800 z-10 ml-1 shadow"
              title="Scroll Right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Audio Soundbox Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                soundEnabled
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-inner'
                  : 'bg-[#181822] text-slate-500 border-slate-800'
              }`}
              title="Toggle Audio Soundbox Alerts"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Offline Sync Status Badge */}
            <button
              onClick={onOpenSyncModal}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                !networkStatus.isOnline
                  ? 'bg-red-500/10 text-red-400 border-red-500/30 animate-pulse'
                  : networkStatus.networkMode === 'Low-Bandwidth (2G)'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              }`}
              title="Manage Offline Sync"
            >
              {!networkStatus.isOnline ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-red-400" />
                  <span className="hidden sm:inline">Offline</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">{networkStatus.networkMode}</span>
                </>
              )}

              {networkStatus.pendingCount > 0 && (
                <span className="px-1.5 py-0.5 text-[9px] font-black bg-amber-400 text-slate-950 rounded-full">
                  {networkStatus.pendingCount}
                </span>
              )}
            </button>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#181822] hover:bg-[#20202c] text-slate-200 border border-slate-800 rounded-xl text-xs font-bold transition-all"
              >
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span className="uppercase">{lang}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-[#161620] border border-slate-800 rounded-xl shadow-2xl py-1.5 z-50 text-xs">
                  <button
                    onClick={() => { setLang('en'); setLangDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-[#20202c] ${lang === 'en' ? 'text-amber-400 font-bold' : 'text-slate-300'}`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => { setLang('hi'); setLangDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-[#20202c] ${lang === 'hi' ? 'text-amber-400 font-bold' : 'text-slate-300'}`}
                  >
                    हिन्दी 🇮🇳 (Hindi)
                  </button>
                  <button
                    onClick={() => { setLang('hinglish'); setLangDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-[#20202c] ${lang === 'hinglish' ? 'text-amber-400 font-bold' : 'text-slate-300'}`}
                  >
                    Hinglish
                  </button>
                </div>
              )}
            </div>

            {/* Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#181822] hover:bg-[#20202c] text-slate-200 border border-slate-800 rounded-xl text-xs font-semibold transition-all"
              >
                <Store className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-white capitalize text-[11px] hidden sm:inline">{role}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#161620] border border-slate-800 rounded-xl shadow-2xl py-2 z-50">
                  <div className="px-3 py-1.5 border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Select User Role
                  </div>
                  <button
                    onClick={() => { setRole('owner'); setRoleDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#20202c] ${role === 'owner' ? 'text-amber-400 font-semibold bg-[#20202c]' : 'text-slate-300'}`}
                  >
                    <span>Shop Owner (Admin)</span>
                    {role === 'owner' && <span className="w-2 h-2 rounded-full bg-amber-500" />}
                  </button>
                  <button
                    onClick={() => { setRole('cashier'); setRoleDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#20202c] ${role === 'cashier' ? 'text-amber-400 font-semibold bg-[#20202c]' : 'text-slate-300'}`}
                  >
                    <span>Cashier / POS Staff</span>
                    {role === 'cashier' && <span className="w-2 h-2 rounded-full bg-amber-500" />}
                  </button>
                  <button
                    onClick={() => { setRole('supplier'); setRoleDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#20202c] ${role === 'supplier' ? 'text-amber-400 font-semibold bg-[#20202c]' : 'text-slate-300'}`}
                  >
                    <span>Supplier / Wholesale Vendor</span>
                    {role === 'supplier' && <span className="w-2 h-2 rounded-full bg-amber-500" />}
                  </button>
                </div>
              )}
            </div>

            {/* Logout Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="p-2 rounded-xl bg-[#181822] hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-500/30 text-xs font-bold transition-all"
                title="Logout of APNA DUKAN"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden items-center py-2 border-t border-slate-800/80 overflow-x-auto gap-1.5 no-scrollbar">
          {navItems
            .filter(item => item.roles.includes(role))
            .map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 py-1.5 px-3 text-xs font-bold rounded-xl whitespace-nowrap transition-all border ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                      : 'bg-[#181822] border-slate-800 text-slate-300'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
        </div>
      </div>
    </header>
  );
};
