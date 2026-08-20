import React, { useState } from 'react';
import { TRADABLE_ASSETS } from '../../db/mockData';
import type { TradableAsset } from '../../types';
import { 
  Layers, 
  Play, 
  Copy, 
  Unlock, 
  CheckCircle2, 
  Database, 
  ScanLine, 
  BookOpen, 
  Code,
  Sparkles
} from 'lucide-react';

export const TradableAssetStudio: React.FC = () => {
  const [selectedAsset, setSelectedAsset] = useState<TradableAsset>(TRADABLE_ASSETS[0]);
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const [demoProgress, setDemoProgress] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);

  const startDemoVideo = (asset: TradableAsset) => {
    setSelectedAsset(asset);
    setIsPlayingDemo(true);
    setDemoProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      setDemoProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsPlayingDemo(false);
      }
    }, 350);
  };

  const copySnippet = () => {
    navigator.clipboard.writeText(selectedAsset.integrationCodeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-amber-400" />
            Tradable Asset Marketplace & Demo Studio
            <span className="px-2.5 py-0.5 text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full font-mono">
              Judges Dealmaking Studio (40% Weightage)
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Separable, cross-domain modular assets ready for 30–45s video demos and team-to-team trading transfer
          </p>
        </div>

        <div className="px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2">
          <Unlock className="w-4 h-4 text-emerald-400" />
          <span>3 Separable Assets Unlocked in Repository</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Available Tradable Assets</h3>

          {TRADABLE_ASSETS.map(asset => {
            const isSelected = selectedAsset.id === asset.id;
            return (
              <div
                key={asset.id}
                onClick={() => {
                  setSelectedAsset(asset);
                  setIsPlayingDemo(false);
                  setDemoProgress(0);
                }}
                className={`glass-card p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                  isSelected
                    ? 'bg-amber-950/20 border-amber-500/60 shadow-lg shadow-amber-950/40'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {asset.category === 'Sync' && <Database className="w-4 h-4 text-emerald-400" />}
                    {asset.category === 'OCR' && <ScanLine className="w-4 h-4 text-blue-400" />}
                    {asset.category === 'Ledger' && <BookOpen className="w-4 h-4 text-amber-400" />}
                    <span className="font-bold text-white text-xs">{asset.name}</span>
                  </div>
                  <span className="px-2 py-0.5 text-[9px] font-bold bg-slate-800 text-slate-300 rounded-full font-mono">
                    {asset.demoVideoDuration}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-2">{asset.tagline}</p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {asset.targetDomains.map((domain, i) => (
                    <span key={i} className="px-1.5 py-0.2 text-[9px] bg-slate-950 text-slate-400 rounded border border-slate-800">
                      {domain}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-8 flex flex-col bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-6">
          <div className="flex items-start justify-between pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">{selectedAsset.name}</h3>
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full">
                  {selectedAsset.category} Asset
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{selectedAsset.description}</p>
            </div>

            <button
              onClick={() => startDemoVideo(selectedAsset)}
              disabled={isPlayingDemo}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isPlayingDemo ? 'Playing 35s Demo...' : 'Play Interactive Video Demo'}</span>
            </button>
          </div>

          <div className="relative aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between p-6">
            <div className="flex items-center justify-between text-xs text-slate-400 z-10">
              <span className="flex items-center gap-2 font-mono text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                DEMO WALKTHROUGH SIMULATOR (30-45 SECONDS)
              </span>
              <span className="font-mono">{selectedAsset.demoVideoDuration}</span>
            </div>

            <div className="flex flex-col items-center justify-center space-y-3 py-6 z-10 text-center">
              {isPlayingDemo ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center animate-bounce border border-amber-500/40">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <div className="text-sm font-bold text-white">
                    Step {Math.min(4, Math.floor(demoProgress / 25) + 1)}/4: {selectedAsset.features[Math.min(3, Math.floor(demoProgress / 25))]}
                  </div>
                  <p className="text-xs text-amber-300 font-mono">Executing isolated workflow demo for judges...</p>
                </>
              ) : (
                <>
                  <div
                    onClick={() => startDemoVideo(selectedAsset)}
                    className="w-16 h-16 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-xl shadow-amber-500/30"
                  >
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </div>
                  <div className="text-sm font-bold text-white">Click to Launch 30–45s Asset Demo Video</div>
                  <p className="text-xs text-slate-400 max-w-md">
                    Demonstrates standalone execution, data input/output cycle, and cross-domain plugin capability.
                  </p>
                </>
              )}
            </div>

            <div className="space-y-1 z-10">
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-400 h-full transition-all duration-300"
                  style={{ width: `${demoProgress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Asset Highlights & Standalone Capabilities</h4>
            <div className="grid grid-cols-2 gap-2">
              {selectedAsset.features.map((feat, idx) => (
                <div key={idx} className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Code className="w-4 h-4 text-blue-400" />
                Transferable SDK / Module Integration Code Snippet
              </span>
              <button
                onClick={copySnippet}
                className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-bold"
              >
                <Copy className="w-3.5 h-3.5" />
                {copiedCode ? 'Copied to Clipboard!' : 'Copy Code'}
              </button>
            </div>
            <pre className="font-mono text-[11px] text-slate-300 bg-slate-900 p-3 rounded-lg overflow-x-auto border border-slate-800">
              {selectedAsset.integrationCodeSnippet}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
