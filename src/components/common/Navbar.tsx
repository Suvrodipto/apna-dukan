import React, { useState } from 'react';
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
  LogOut,
  PlayCircle,
  TrendingUp,
  Users,
  Wifi,
  WifiOff,
  ShieldAlert,
  Navigation,
  Menu,
  X
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
  onOpenPitchModal,
  onLogout
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const t = TRANSLATIONS[lang];

  const navItems = [
    { id: 'pos', label: t.posBilling, icon: Receipt, roles: ['owner', 'cashier'], badge: 'POS' },
    { id: 'khata', label: t.khataLedger, icon: BookOpen, roles: ['owner', 'cashier'], badge: 'Udhaar' },
    { id: 'inventory', label: t.catalogueStock, icon: Package, roles: ['owner', 'cashier'] },
    { id: 'workers', label: 'Worker Management 👷', icon: Users, roles: ['owner'], badge: 'Festival HR' },
    { id: 'price-predictor', label: 'Price & Margin Predictor', icon: TrendingUp, roles: ['owner', 'supplier'], badge: 'AI ML' },
    { id: 'ocr', label: t.billOCR, icon: ScanLine, roles: ['owner', 'cashier'], badge: 'OCR' },
    { id: 'supplier', label: t.supplierOrders, icon: Truck, roles: ['owner', 'supplier'] },
    { id: 'acquired-anomaly', label: 'Anomaly Engine 🚨', icon: ShieldAlert, roles: ['owner', 'cashier', 'supplier'] },
    { id: 'acquired-route', label: 'AccessRoute 🗺️', icon: Navigation, roles: ['owner', 'cashier', 'supplier'] },
    { id: 'analytics', label: t.salesAnalytics, icon: BarChart3, roles: ['owner'] },
    { id: 'marketplace', label: t.assetMarketplace, icon: Layers, roles: ['owner', 'cashier', 'supplier'], badge: '11 Assets' }
  ];

  const visibleNavItems = navItems.filter(item => item.roles.includes(role));

  const roleLabels: Record<UserRole, { title: string; color: string }> = {
    owner: { title: 'Dukan Owner', color: 'from-amber-500 to-yellow-500 text-slate-950' },
    cashier: { title: 'Billing Cashier', color: 'from-blue-500 to-indigo-500 text-white' },
    supplier: { title: 'Vendor / Supplier', color: 'from-purple-500 to-emerald-500 text-white' }
  };

  return (
    <>
      {/* 📱 MOBILE TOP HEADER BAR (Mobile Only) */}
      <div className="lg:hidden sticky top-0 z-50 bg-[#0d0d14]/95 border-b border-amber-500/20 backdrop-blur-xl px-4 py-3 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 bg-slate-800 text-amber-400 rounded-xl border border-slate-700 active:scale-95"
            aria-label="Toggle Navigation Drawer"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Store className="w-5 h-5 text-slate-950" />
            </div>
            <span className="font-black text-white text-base tracking-tight">APNA DUKAN</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenPitchModal && (
            <button
              onClick={onOpenPitchModal}
              className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 rounded-lg font-black text-[10px] shadow"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>AI</span>
            </button>
          )}
        </div>
      </div>

      {/* 📱 MOBILE DRAWER BACKDROP */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* 💻 LEFT SLIDING SIDEBAR NAVIGATION BAR */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen bg-[#0d0d14]/95 border-r border-amber-500/20 backdrop-blur-2xl flex flex-col justify-between transition-all duration-300 ease-in-out shadow-2xl ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Top Section: Brand & Sidebar Collapse Toggle */}
        <div className="p-4 border-b border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 shrink-0 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30 border border-amber-300/40">
                <Store className="w-6 h-6 text-slate-950" />
              </div>

              {!isCollapsed && (
                <div className="min-w-0">
                  <h1 className="font-black text-white text-base tracking-tight leading-none flex items-center gap-1.5 truncate">
                    APNA DUKAN
                  </h1>
                  <span className="text-[10px] text-amber-400 font-mono font-bold tracking-wider uppercase">v5.0 Enterprise</span>
                </div>
              )}
            </div>

            {/* Sidebar Collapse Toggle Button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-1.5 bg-[#181824] hover:bg-slate-800 text-slate-400 hover:text-amber-400 border border-slate-800 rounded-xl transition-all shadow cursor-pointer"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Network Status Badge */}
          <button
            onClick={onOpenSyncModal}
            className={`w-full p-2 rounded-xl border flex items-center gap-2 text-xs font-mono transition-all ${
              networkStatus.networkMode === 'Online'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                : networkStatus.networkMode === 'Low-Bandwidth (2G)'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
            }`}
          >
            {networkStatus.isOnline ? <Wifi className="w-4 h-4 shrink-0" /> : <WifiOff className="w-4 h-4 shrink-0" />}
            {!isCollapsed && (
              <div className="flex-1 flex items-center justify-between overflow-hidden text-[11px]">
                <span className="font-bold truncate">{networkStatus.networkMode}</span>
                {networkStatus.pendingCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-amber-500/30 text-amber-300 rounded font-black text-[9px]">
                    {networkStatus.pendingCount}
                  </span>
                )}
              </div>
            )}
          </button>
        </div>

        {/* Middle Navigation Links */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
          {visibleNavItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileOpen(false);
                }}
                className={`w-full group relative flex items-center gap-3 px-3 py-2.5 rounded-2xl font-medium text-xs transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/5 text-amber-300 font-extrabold border border-amber-500/40 shadow-lg shadow-amber-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <div className={`p-1.5 rounded-xl shrink-0 transition-colors ${
                  isActive ? 'bg-amber-500/20 text-amber-400' : 'group-hover:text-amber-400'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>

                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between overflow-hidden">
                    <span className="truncate text-xs tracking-wide">{item.label}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[9px] font-black bg-slate-800 text-slate-300 rounded-md border border-slate-700 uppercase shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Panel: AI Pitch, Role, Language, Logout */}
        <div className="p-3 border-t border-slate-800/80 space-y-3 bg-[#0a0a0f]">
          {/* SHOW AI IN ACTION Pitch Simulation Button */}
          {onOpenPitchModal && (
            <button
              onClick={onOpenPitchModal}
              className="w-full py-2 px-3 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 border border-amber-300 animate-pulse cursor-pointer"
            >
              <PlayCircle className="w-4 h-4 fill-current shrink-0" />
              {!isCollapsed && <span>SHOW AI IN ACTION</span>}
            </button>
          )}

          {/* Role Switcher */}
          {!isCollapsed ? (
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="w-full p-2 bg-[#14141e] border border-slate-800 hover:border-slate-700 rounded-xl flex items-center justify-between text-xs text-slate-300 transition-all"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase ${roleLabels[role].color}`}>
                    {role}
                  </div>
                  <span className="truncate font-bold text-slate-200 text-xs">{roleLabels[role].title}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute bottom-full mb-2 left-0 right-0 bg-[#181824] border border-slate-700 rounded-xl shadow-2xl p-1 z-50 space-y-1">
                  {(['owner', 'cashier', 'supplier'] as UserRole[]).map(r => (
                    <button
                      key={r}
                      onClick={() => {
                        setRole(r);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between ${
                        role === r ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="capitalize font-mono">{r} Mode</span>
                      {role === r && <Sparkles className="w-3 h-3 text-amber-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                onClick={() => setRole(role === 'owner' ? 'cashier' : role === 'cashier' ? 'supplier' : 'owner')}
                className="p-2 bg-slate-800 text-amber-400 rounded-xl border border-slate-700"
                title={`Role: ${role}`}
              >
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Controls Bar: Sound, Language, Logout */}
          <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-800/60">
            {/* Sound FX Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-amber-400 rounded-xl border border-slate-800 text-xs transition-colors"
              title={soundEnabled ? "Sound On" : "Mute Sound"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="p-2 bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-amber-400 rounded-xl border border-slate-800 text-xs font-mono flex items-center gap-1"
                title="Change Language"
              >
                <Globe className="w-4 h-4 text-amber-400" />
                {!isCollapsed && <span className="uppercase text-[10px] font-bold">{lang}</span>}
              </button>

              {langDropdownOpen && (
                <div className="absolute bottom-full mb-2 right-0 w-32 bg-[#181824] border border-slate-700 rounded-xl shadow-2xl p-1 z-50 space-y-1">
                  {[
                    { code: 'en', name: 'English' },
                    { code: 'hi', name: 'हिंदी' },
                    { code: 'od', name: 'ଓଡ଼ିଆ' }
                  ].map(l => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLang(l.code as Language);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg ${
                        lang === l.code ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {l.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Logout Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30 text-xs transition-colors"
                title="Logout Session"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
