import React, { useState } from 'react';
import { Store, Lock, User, ShieldCheck, KeyRound, ArrowRight } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (userRole: 'owner' | 'cashier' | 'supplier') => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('admin@apnadukan.com');
  const [password, setPassword] = useState('ApnaDukan@123');
  const [role, setRole] = useState<'owner' | 'cashier' | 'supplier'>('owner');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Permanent Hardcoded Credentials
  const PERMANENT_CREDENTIALS = [
    { user: 'admin@apnadukan.com', pass: 'ApnaDukan@123', role: 'owner' },
    { user: 'admin', pass: 'admin', role: 'owner' },
    { user: 'cashier@apnadukan.com', pass: 'cashier123', role: 'cashier' },
    { user: 'supplier@apnadukan.com', pass: 'supplier123', role: 'supplier' }
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const match = PERMANENT_CREDENTIALS.find(
        c => (c.user.toLowerCase() === username.trim().toLowerCase()) && c.pass === password
      );

      if (match) {
        setIsLoading(false);
        onLoginSuccess(role);
      } else {
        setIsLoading(false);
        setErrorMsg('Invalid Credentials! Please use: admin@apnadukan.com / ApnaDukan@123');
      }
    }, 600);
  };

  const handleQuickFill = (demoUser: string, demoPass: string, demoRole: 'owner' | 'cashier' | 'supplier') => {
    setUsername(demoUser);
    setPassword(demoPass);
    setRole(demoRole);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0e] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden selection:bg-amber-500 selection:text-slate-950">
      {/* Ambient Radial Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-amber-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md glass-panel bg-[#121218]/90 border border-amber-500/30 rounded-3xl p-8 shadow-2xl space-y-6 relative z-10 animate-in fade-in zoom-in duration-300">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-500 to-amber-600 text-slate-950 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/20 animate-glow">
            <Store className="w-8 h-8 font-black" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight pt-2">
            APNA<span className="text-amber-400"> DUKAN</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium">Smart Retail POS & Khata Operating System</p>
        </div>

        {/* Permanent Credential Notice Box */}
        <div className="p-3.5 bg-[#181824] border border-amber-500/30 rounded-2xl space-y-1 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-amber-400 uppercase tracking-wider text-[10px]">
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span>Permanent System Credentials</span>
          </div>
          <div className="font-mono text-[11px] text-slate-300 pt-1 space-y-0.5">
            <div>Username: <span className="text-white font-bold">admin@apnadukan.com</span> (or <span className="text-white font-bold">admin</span>)</div>
            <div>Password: <span className="text-amber-400 font-bold">ApnaDukan@123</span> (or <span className="text-amber-400 font-bold">admin</span>)</div>
          </div>
        </div>

        {/* Quick Autofill Buttons for Testing */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            ⚡ Quick Demo Autofill
          </label>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickFill('admin@apnadukan.com', 'ApnaDukan@123', 'owner')}
              className="py-2 px-2 bg-[#181824] hover:bg-[#202030] border border-slate-700 text-amber-300 font-bold rounded-xl text-[11px] transition-all"
            >
              Shop Owner
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('cashier@apnadukan.com', 'cashier123', 'cashier')}
              className="py-2 px-2 bg-[#181824] hover:bg-[#202030] border border-slate-700 text-amber-300 font-bold rounded-xl text-[11px] transition-all"
            >
              POS Cashier
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('supplier@apnadukan.com', 'supplier123', 'supplier')}
              className="py-2 px-2 bg-[#181824] hover:bg-[#202030] border border-slate-700 text-amber-300 font-bold rounded-xl text-[11px] transition-all"
            >
              Supplier
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-semibold text-[11px]">User ID / Email</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter user id or email..."
                className="w-full bg-[#0d0d12] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold text-[11px]">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full bg-[#0d0d12] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold text-[11px]">Select Role Context</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value as any)}
              className="w-full bg-[#0d0d12] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-semibold"
            >
              <option value="owner">Shop Owner (Admin Access)</option>
              <option value="cashier">POS Cashier (Billing Access)</option>
              <option value="supplier">Supplier / Wholesale Vendor</option>
            </select>
          </div>

          {errorMsg && (
            <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 font-medium text-[11px]">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>LOG IN TO APNA DUKAN</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </>
            )}
          </button>
        </form>

        {/* Security Footer */}
        <div className="pt-2 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>256-bit Offline-First PouchDB Encrypted Session</span>
        </div>
      </div>
    </div>
  );
};
