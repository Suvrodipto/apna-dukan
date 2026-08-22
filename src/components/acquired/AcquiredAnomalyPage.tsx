import React, { useState } from 'react';
import { AnomalyDetector } from '../../acquired_modules/anomaly-detection-engine';
import type { AnomalyResult } from '../../acquired_modules/anomaly-detection-engine/types';
import { 
  ShieldAlert, 
  Zap, 
  Activity, 
  Bot
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AcquiredAnomalyPage: React.FC = () => {
  const [testValue, setTestValue] = useState<number>(5850);
  const [sensitivity, setSensitivity] = useState<number>(2.0);
  const [customItemName, setCustomItemName] = useState<string>('Kashmiri Saffron + Ghee Combo');

  const [history, setHistory] = useState<number[]>([
    1200, 1450, 1300, 1850, 1600, 1750, 1900, 1800, 1650, 1700
  ]);

  const [auditLog, setAuditLog] = useState<Array<AnomalyResult & { itemName: string }>>([
    {
      isAnomaly: true,
      currentValue: 5850,
      mean: 1615,
      stdDev: 245,
      zScore: 17.28,
      deviationPercent: 262,
      severity: 'CRITICAL',
      recommendation: 'CRITICAL SPIKE DETECTED (+262% vs baseline). Triggered VIP Gold loyalty & ₹5,000+ Festive Gift Hamper.',
      timestamp: '15:42:10',
      itemName: 'Kashmiri Saffron + Ghee Combo'
    },
    {
      isAnomaly: false,
      currentValue: 1750,
      mean: 1615,
      stdDev: 245,
      zScore: 0.55,
      deviationPercent: 8,
      severity: 'LOW',
      recommendation: 'Normal operations within baseline distribution bounds.',
      timestamp: '15:30:05',
      itemName: 'Aashirvaad Atta 5kg x 5'
    }
  ]);

  const detector = new AnomalyDetector(sensitivity);
  const currentResult = detector.evaluate(testValue, history);

  const handleEvaluateCurrent = () => {
    const res = detector.evaluate(testValue, history);
    setAuditLog(prev => [
      { ...res, itemName: customItemName || 'Custom Stream Item' },
      ...prev
    ]);

    if (res.isAnomaly) {
      confetti({ particleCount: 75, spread: 90, origin: { y: 0.6 } });
    }
  };

  const handleAddValueToHistory = (val: number, name: string) => {
    setTestValue(val);
    setCustomItemName(name);
    setHistory(prev => [...prev.slice(1), val]);
    const res = detector.evaluate(val, history);
    setAuditLog(prev => [
      { ...res, itemName: name },
      ...prev
    ]);

    if (res.isAnomaly) {
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-rose-400" />
            Real-Time Anomaly Detection Engine
          </h2>
          <p className="text-xs text-slate-400">
            Statistical Z-Score dispersion model evaluating real-time POS streaming telemetry against historical baselines
          </p>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Controls */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-5 rounded-3xl border border-rose-500/40 bg-[#14141c] space-y-4 shadow-xl">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Activity className="w-4 h-4 text-rose-400" />
              Stream Simulator & Controls
            </h3>

            <div>
              <label className="block text-slate-300 text-xs font-mono mb-1">Stream Item Description</label>
              <input
                type="text"
                value={customItemName}
                onChange={e => setCustomItemName(e.target.value)}
                className="w-full bg-[#0d0d12] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                placeholder="e.g. Kashmiri Saffron + Ghee"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-xs font-mono mb-1 flex justify-between">
                <span>Transaction Stream Value:</span>
                <strong className="text-amber-400 font-bold text-sm">₹{testValue.toLocaleString()}</strong>
              </label>
              <input
                type="range"
                min="500"
                max="10000"
                step="100"
                value={testValue}
                onChange={e => setTestValue(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-xs font-mono mb-1 flex justify-between">
                <span>Z-Score Sensitivity Threshold:</span>
                <strong className="text-rose-400 font-bold text-sm">{sensitivity.toFixed(1)}σ</strong>
              </label>
              <input
                type="range"
                min="1.0"
                max="3.5"
                step="0.1"
                value={sensitivity}
                onChange={e => setSensitivity(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div className="space-y-2 pt-1">
              <div className="text-[10px] text-slate-400 font-mono uppercase font-bold">Quick Presets & Preserved Actions</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleAddValueToHistory(1700, 'Normal POS Sale (Atta & Milk)')}
                  className="px-3 py-2 bg-[#0d0d12] hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  🟢 Normal ₹1,700
                </button>
                <button
                  onClick={() => handleAddValueToHistory(5850, 'Festive Hamper (Saffron + Ghee)')}
                  className="px-3 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-bold cursor-pointer"
                >
                  🔴 Surge ₹5,850
                </button>
              </div>
            </div>

            <button
              onClick={handleEvaluateCurrent}
              className="w-full py-3 bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600 text-white font-black text-xs rounded-xl shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Evaluate Current Stream Value</span>
            </button>
          </div>
        </div>

        {/* Right Column: Analytics & Graph */}
        <div className="lg:col-span-7 space-y-4">
          {/* Diagnostic Result Card */}
          <div className="p-5 bg-[#14141c] rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`px-3.5 py-1 text-xs font-black rounded-full font-mono uppercase ${
                  currentResult.isAnomaly
                    ? 'bg-rose-500 text-slate-950 shadow-lg shadow-rose-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {currentResult.isAnomaly ? `🚨 ANOMALY DETECTED (${currentResult.severity})` : '🟢 NORMAL WITHIN BASELINE'}
                </span>
              </div>
              <span className="font-mono text-slate-400 text-xs">Evaluated Live</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 bg-[#0d0d12] rounded-2xl border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Baseline Mean (μ)</span>
                <strong className="text-white text-base font-black">₹{currentResult.mean}</strong>
              </div>

              <div className="p-3 bg-[#0d0d12] rounded-2xl border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Std Dev (σ)</span>
                <strong className="text-blue-400 text-base font-black">₹{currentResult.stdDev}</strong>
              </div>

              <div className="p-3 bg-[#0d0d12] rounded-2xl border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Z-Score</span>
                <strong className={`text-base font-black ${currentResult.zScore >= 2.0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  +{currentResult.zScore.toFixed(2)}σ
                </strong>
              </div>

              <div className="p-3 bg-[#0d0d12] rounded-2xl border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Deviation</span>
                <strong className="text-amber-400 text-base font-black">
                  +{currentResult.deviationPercent}%
                </strong>
              </div>
            </div>

            <p className="text-xs text-slate-300 font-medium leading-relaxed bg-[#0d0d12] p-3 rounded-2xl border border-slate-800 flex items-center gap-2">
              <Bot className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{currentResult.recommendation}</span>
            </p>
          </div>

          {/* SVG Baseline Visual Graph */}
          <div className="p-5 bg-[#14141c] rounded-3xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Statistical Z-Score Dispersion Graph (μ ± {sensitivity.toFixed(1)}σ Bounds)
            </h3>

            <div className="relative pt-2">
              <svg className="w-full h-40 overflow-visible" viewBox="0 0 500 150">
                {/* Upper Baseline Limit Line */}
                <line x1="0" y1="40" x2="500" y2="40" stroke="#f43f5e" strokeDasharray="4 4" strokeWidth="1.5" />
                <text x="5" y="32" fill="#f43f5e" fontSize="10" fontFamily="monospace">Upper Limit (μ + 2σ)</text>

                {/* Mean Line */}
                <line x1="0" y1="100" x2="500" y2="100" stroke="#10b981" strokeDasharray="3 3" strokeWidth="1" />
                <text x="5" y="94" fill="#10b981" fontSize="10" fontFamily="monospace">Mean Baseline (μ = ₹{currentResult.mean})</text>

                {/* Points */}
                <polyline
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  points="0,110 50,105 100,112 150,95 200,102 250,98 300,94 350,96 400,98 450,20"
                />

                <circle cx="450" cy="20" r="6" fill="#f43f5e" className="animate-ping" />
                <circle cx="450" cy="20" r="6" fill="#f43f5e" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Log History Table */}
      <div className="p-5 bg-[#14141c] rounded-3xl border border-slate-800 space-y-4">
        <h3 className="font-extrabold text-white text-base flex items-center gap-2">
          📋 Real-Time Telemetry Audit Log
        </h3>

        <div className="overflow-x-auto bg-[#0d0d12] rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#181824] text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="p-3.5">Time</th>
                <th className="p-3.5">Item Description</th>
                <th className="p-3.5">Stream Value</th>
                <th className="p-3.5">Z-Score</th>
                <th className="p-3.5">Severity</th>
                <th className="p-3.5">Diagnostic Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              {auditLog.map((log, idx) => (
                <tr key={idx} className="hover:bg-[#181824] transition-colors">
                  <td className="p-3.5 text-slate-400">{log.timestamp}</td>
                  <td className="p-3.5 font-bold text-white">{log.itemName}</td>
                  <td className="p-3.5 text-amber-400 font-bold">₹{log.currentValue.toLocaleString()}</td>
                  <td className="p-3.5 text-rose-400 font-bold">+{log.zScore.toFixed(2)}σ</td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      log.severity === 'CRITICAL' || log.severity === 'HIGH'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {log.severity}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-300 text-[11px] font-sans">{log.recommendation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
