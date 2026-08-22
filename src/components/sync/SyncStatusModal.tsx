import React, { useState } from 'react';
import { pouchStore } from '../../db/pouchStore';
import { Wifi, WifiOff, RefreshCw, Database, CheckCircle2, X } from 'lucide-react';

interface SyncStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  networkStatus: {
    isOnline: boolean;
    networkMode: 'Online' | 'Low-Bandwidth (2G)' | 'Offline';
    pendingCount: number;
    mutations: any[];
  };
}

export const SyncStatusModal: React.FC<SyncStatusModalProps> = ({
  isOpen,
  onClose,
  networkStatus
}) => {
  const [isSyncing, setIsSyncing] = useState(false);

  if (!isOpen) return null;

  const handleModeChange = (mode: 'Online' | 'Low-Bandwidth (2G)' | 'Offline') => {
    pouchStore.setNetworkMode(mode);
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    await pouchStore.syncPendingMutations();
    setTimeout(() => setIsSyncing(false), 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                PouchDB Offline-Sync Engine
                <span className="px-2 py-0.5 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full font-mono">Tradable Asset #1</span>
              </h3>
              <p className="text-xs text-slate-400">Local-first IndexedDB storage & network connection emulator</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
              Simulate Connectivity Environment
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleModeChange('Online')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  networkStatus.networkMode === 'Online'
                    ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Wifi className="w-4 h-4 text-emerald-400" />
                  {networkStatus.networkMode === 'Online' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
                <div className="font-bold text-sm">Online (High-Speed)</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Instant PouchDB sync</div>
              </button>

              <button
                onClick={() => handleModeChange('Low-Bandwidth (2G)')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  networkStatus.networkMode === 'Low-Bandwidth (2G)'
                    ? 'bg-amber-500/20 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Wifi className="w-4 h-4 text-amber-400" />
                  {networkStatus.networkMode === 'Low-Bandwidth (2G)' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                </div>
                <div className="font-bold text-sm">2G / Poor Signal</div>
                <div className="text-[11px] text-slate-400 mt-0.5">2000ms latency queue</div>
              </button>

              <button
                onClick={() => handleModeChange('Offline')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  networkStatus.networkMode === 'Offline'
                    ? 'bg-red-500/20 border-red-500 text-white shadow-lg shadow-red-500/10'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <WifiOff className="w-4 h-4 text-red-400" />
                  {networkStatus.networkMode === 'Offline' && <CheckCircle2 className="w-4 h-4 text-red-400" />}
                </div>
                <div className="font-bold text-sm">Offline Mode</div>
                <div className="text-[11px] text-slate-400 mt-0.5">100% Local IndexedDB</div>
              </button>
            </div>
          </div>

          <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/60">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
                  Mutation Sync Queue
                  <span className="px-2 py-0.5 text-xs bg-blue-500/20 text-blue-400 rounded-full font-mono">
                    {networkStatus.mutations.length} total
                  </span>
                </h4>
                <p className="text-xs text-slate-400">Local edits saved while offline or pending server sync</p>
              </div>

              <button
                onClick={handleManualSync}
                disabled={!networkStatus.isOnline || isSyncing}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/20"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Syncing...' : 'Sync Now'}
              </button>
            </div>

            {networkStatus.mutations.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs border border-dashed border-slate-700 rounded-lg">
                No pending mutations. All data in sync with local IndexedDB & PouchDB master.
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {networkStatus.mutations.map(m => (
                  <div key={m.id} className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded uppercase ${
                        m.action === 'CREATE' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {m.action}
                      </span>
                      <span className="font-mono text-slate-300 capitalize">{m.entityType}</span>
                      <span className="text-slate-500 text-[10px]">{new Date(m.timestamp).toLocaleTimeString()}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-[10px] rounded-full font-semibold ${
                        m.status === 'synced'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-amber-500/10 text-amber-400 animate-pulse'
                      }`}>
                        {m.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
