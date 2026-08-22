import React, { useState } from 'react';
import { AnomalyDetector } from '../../acquired_modules/anomaly-detection-engine';
import { Zap } from 'lucide-react';

export const AcquiredAnomalyDetectorCard: React.FC = () => {
  const [testValue, setTestValue] = useState<number>(5850);
  const [sensitivity, setSensitivity] = useState<number>(2.0);

  const history = [1200, 1450, 1300, 1850, 1600, 1750, 1900, 1800];

  const detector = new AnomalyDetector(sensitivity);
  const result = detector.evaluate(testValue, history);

  return (
    <div className="p-5 bg-gradient-to-r from-[#1c1014] via-[#16121a] to-[#14141c] rounded-3xl border border-rose-500/50 shadow-2xl space-y-4 relative overflow-hidden">
      {/* Acquired Header Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center font-black text-xl shadow-lg">
            🚨
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base tracking-tight flex items-center gap-2">
              Acquired Asset: Anomaly Detection Engine
              <span className="px-2.5 py-0.5 text-[9px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-full font-mono uppercase">
                M&A ACQUIRED FROM VOLTIQ
              </span>
            </h3>
            <p className="text-xs text-rose-300 font-mono">
              Statistical Z-Score Dispersion & Telemetry Surge Detector
            </p>
          </div>
        </div>

        <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold rounded-xl flex items-center gap-1.5 shadow">
          <span>Seller: Ashmit-Roy / Voltiq</span>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#0d0d12] p-4 rounded-2xl border border-slate-800">
        <div>
          <label className="block text-slate-400 text-xs mb-1 font-mono flex justify-between">
            <span>Incoming Transaction Stream Value:</span>
            <strong className="text-amber-400 font-bold">₹{testValue.toLocaleString()}</strong>
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
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
            <span>Normal: ₹1,200</span>
            <span>Surge: ₹5,850</span>
            <span>Critical: ₹10,000</span>
          </div>
        </div>

        <div>
          <label className="block text-slate-400 text-xs mb-1 font-mono flex justify-between">
            <span>Detector Sensitivity (Z-Score Threshold):</span>
            <strong className="text-rose-400 font-bold">{sensitivity.toFixed(1)}σ</strong>
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
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
            <span>Sensitive (1.0σ)</span>
            <span>Standard (2.0σ)</span>
            <span>Strict (3.5σ)</span>
          </div>
        </div>
      </div>

      {/* Output Results Matrix */}
      <div className="p-4 bg-[#0d0d12] rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 text-xs font-black rounded-full font-mono uppercase ${
              result.isAnomaly
                ? 'bg-rose-500 text-slate-950 shadow-lg shadow-rose-500/30'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}>
              {result.isAnomaly ? `🚨 ANOMALY DETECTED (${result.severity})` : '🟢 NORMAL STREAM'}
            </span>
          </div>
          <span className="font-mono text-slate-400 text-[10px]">Evaluation Time: {result.timestamp}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono text-slate-300">
          <div className="p-2.5 bg-[#14141c] rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Baseline Mean (μ)</span>
            <strong className="text-white text-sm font-black">₹{result.mean}</strong>
          </div>

          <div className="p-2.5 bg-[#14141c] rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Std Dev (σ)</span>
            <strong className="text-blue-400 text-sm font-black">₹{result.stdDev}</strong>
          </div>

          <div className="p-2.5 bg-[#14141c] rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Calculated Z-Score</span>
            <strong className={`text-sm font-black ${result.zScore >= 2.0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              +{result.zScore.toFixed(2)}σ
            </strong>
          </div>

          <div className="p-2.5 bg-[#14141c] rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Deviation %</span>
            <strong className={`text-sm font-black ${result.deviationPercent > 0 ? 'text-amber-400' : 'text-slate-200'}`}>
              {result.deviationPercent > 0 ? `+${result.deviationPercent}%` : `${result.deviationPercent}%`}
            </strong>
          </div>
        </div>

        <p className="text-xs text-slate-300 font-medium leading-relaxed bg-[#14141c] p-3 rounded-xl border border-slate-800 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{result.recommendation}</span>
        </p>
      </div>
    </div>
  );
};
