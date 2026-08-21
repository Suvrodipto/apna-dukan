import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Package, 
  Bot, 
  AlertTriangle, 
  Lightbulb, 
  Truck, 
  CheckCircle2, 
  Play, 
  RotateCcw, 
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AIPitchSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIPitchSimulationModal: React.FC<AIPitchSimulationModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'briefing' | 'simulation'>('briefing');
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const simulationSteps = [
    {
      stepIndex: 1,
      title: '📈 Real-time POS Sales Data Ingestion',
      description: 'Customer transactions are streaming in via POS Billing & Voice Commands.',
      icon: TrendingUp,
      badge: 'Live Data Stream',
      metric: 'Sales Stream: 14 Bills/Min'
    },
    {
      stepIndex: 2,
      title: '📦 Dynamic Inventory Decrement',
      description: 'Stock levels of Amul Butter & Parle-G decrease automatically in Dexie IndexedDB.',
      icon: Package,
      badge: 'Local-First DB',
      metric: 'Amul Milk Stock: 8 Units Left'
    },
    {
      stepIndex: 3,
      title: '🤖 AI Pattern Recognition Triggered',
      description: 'Dukaan AI analyzes velocity curve and detects high consumption rate during evening hours.',
      icon: Bot,
      badge: 'Predictive ML Model',
      metric: 'Demand Surge Detected (+240%)'
    },
    {
      stepIndex: 4,
      title: '🔴 Critical Stock-out Predicted',
      description: 'AI predicts total stock-out in <45 minutes unless Emergency Restock is executed.',
      icon: AlertTriangle,
      badge: 'Stock Out Warning',
      metric: 'Est. Stock Out: 45 Mins'
    },
    {
      stepIndex: 5,
      title: '💡 AI Smart Offer & Promotion Suggested',
      description: 'AI creates "🥛 Amul Milk + Fresh Bread Combo" to boost basket size by 18%.',
      icon: Lightbulb,
      badge: 'AI Smart Bundle',
      metric: 'Offer: Buy 2 Get ₹10 Off'
    },
    {
      stepIndex: 6,
      title: '🛒 1-Click Autonomous Restock Order Sent',
      description: 'Emergency Restock dispatched to Supplier A (2-Hour Fast Delivery @ ₹24/unit).',
      icon: Truck,
      badge: 'Automated PO Dispatched',
      metric: 'PO #PO-982410 Dispatched!'
    }
  ];

  useEffect(() => {
    let timer: any;
    if (isOpen && isPlaying && activeTab === 'simulation') {
      timer = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < simulationSteps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            confetti({ particleCount: 90, spread: 100, origin: { y: 0.6 } });
            return prev;
          }
        });
      }, 2500);
    }
    return () => clearInterval(timer);
  }, [isOpen, isPlaying, activeTab, simulationSteps.length]);

  if (!isOpen) return null;

  const activeStepObj = simulationSteps[currentStep];
  const StepIcon = activeStepObj.icon;

  const handleRestart = () => {
    setCurrentStep(0);
    setIsPlaying(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="glass-panel w-full max-w-2xl bg-[#121218] border border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-5 text-xs animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-500 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20 animate-glow">
              <Bot className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                🤖 APNA DUKAN AI Assistant
                <span className="px-2 py-0.5 text-[9px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full font-mono">
                  Executive AI Briefing
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">Autonomous Shop Diagnostics & Predictive Decision Intelligence</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 bg-[#0d0d12] p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('briefing')}
            className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all border ${
              activeTab === 'briefing'
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow'
                : 'bg-transparent text-slate-400 border-transparent hover:text-white'
            }`}
          >
            🤖 AI Executive Briefing
          </button>
          <button
            onClick={() => setActiveTab('simulation')}
            className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all border ${
              activeTab === 'simulation'
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow'
                : 'bg-transparent text-slate-400 border-transparent hover:text-white'
            }`}
          >
            🚀 Interactive Pitch Simulation
          </button>
        </div>

        {/* TAB 1: EXECUTIVE AI BRIEFING */}
        {activeTab === 'briefing' && (
          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {/* 🔴 Important Alert */}
            <div className="p-4 bg-[#1c1014] border border-rose-500/50 rounded-2xl space-y-1.5 shadow-lg">
              <div className="flex items-center justify-between text-xs font-black text-rose-400">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  🔴 Important Alert
                </span>
                <span className="font-mono text-[10px] bg-rose-500/20 px-2.5 py-0.5 rounded-full text-rose-300 border border-rose-500/30">
                  OVERDUE UDHAAR
                </span>
              </div>
              <p className="text-sm font-extrabold text-white">Ramesh has ₹2,000 outstanding for 28 days.</p>
              <p className="text-xs text-slate-300 leading-relaxed">
                Credit period threshold reached (28 days). Suggested Action: Click below to dispatch 1-click WhatsApp payment reminder deep-link directly to Ramesh's phone.
              </p>
            </div>

            {/* 🟡 Opportunity */}
            <div className="p-4 bg-[#1c170d] border border-yellow-500/50 rounded-2xl space-y-1.5 shadow-lg">
              <div className="flex items-center justify-between text-xs font-black text-yellow-400">
                <span className="flex items-center gap-2">
                  <span>🟡</span> Opportunity Identified
                </span>
                <span className="font-mono text-[10px] bg-yellow-500/20 px-2.5 py-0.5 rounded-full text-yellow-300 border border-yellow-500/30">
                  +34% DEMAND SURGE
                </span>
              </div>
              <p className="text-sm font-extrabold text-white">Milk sales increased by 34% this week. Consider ordering 20 extra units.</p>
              <p className="text-xs text-slate-300 leading-relaxed">
                High evening tea rush velocity detected. Autonomous restock recommendation: Restock Amul Milk 500ml before 5:00 PM to prevent stock-out.
              </p>
            </div>

            {/* 🟢 Good News */}
            <div className="p-4 bg-[#0e1d15] border border-emerald-500/50 rounded-2xl space-y-1.5 shadow-lg">
              <div className="flex items-center justify-between text-xs font-black text-emerald-400">
                <span className="flex items-center gap-2">
                  <span>🟢</span> Good News
                </span>
                <span className="font-mono text-[10px] bg-emerald-500/20 px-2.5 py-0.5 rounded-full text-emerald-300 border border-emerald-500/30">
                  REVENUE BOOST
                </span>
              </div>
              <p className="text-sm font-extrabold text-white">Your revenue is 18.4% higher than last week.</p>
              <p className="text-xs text-slate-300 leading-relaxed">
                Driven by high-value dry fruit hampers (₹2,250), Desi Ghee (₹3,850), and VIP Gold repeat customer purchases.
              </p>
            </div>

            {/* 💡 Recommendation */}
            <div className="p-4 bg-[#0e1624] border border-blue-500/50 rounded-2xl space-y-1.5 shadow-lg">
              <div className="flex items-center justify-between text-xs font-black text-blue-400">
                <span className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-blue-400" />
                  💡 Capital Optimization Recommendation
                </span>
                <span className="font-mono text-[10px] bg-blue-500/20 px-2.5 py-0.5 rounded-full text-blue-300 border border-blue-500/30">
                  FREE UP ₹3,200 CAPITAL
                </span>
              </div>
              <p className="text-sm font-extrabold text-white">Reduce stock of slow-moving products to free up ₹3,200 in capital.</p>
              <p className="text-xs text-slate-300 leading-relaxed">
                AI recommends creating a 15% discount bundle offer on slow-moving inventory items to accelerate cash flow recovery.
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: INTERACTIVE PITCH SIMULATION */}
        {activeTab === 'simulation' && (
          <div className="space-y-4">
            {/* Timeline Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>Simulation Step {currentStep + 1} of {simulationSteps.length}</span>
                <span className="text-amber-400 font-bold">{Math.round(((currentStep + 1) / simulationSteps.length) * 100)}% Completed</span>
              </div>

              <div className="grid grid-cols-6 gap-1.5 py-1">
                {simulationSteps.map((s, idx) => (
                  <div
                    key={s.stepIndex}
                    onClick={() => { setCurrentStep(idx); setIsPlaying(false); }}
                    className={`h-2 rounded-full cursor-pointer transition-all ${
                      idx === currentStep
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-400 shadow-md scale-105'
                        : idx < currentStep
                        ? 'bg-amber-500/60'
                        : 'bg-slate-800'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Active Stage Card */}
            <div className="p-5 bg-[#181824] border border-amber-500/30 rounded-3xl space-y-4 shadow-inner relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-black">
                    <StepIcon className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <span className="px-2 py-0.5 text-[9px] font-black bg-amber-500 text-slate-950 rounded uppercase font-mono">
                      {activeStepObj.badge}
                    </span>
                    <h4 className="font-extrabold text-white text-base mt-1">{activeStepObj.title}</h4>
                  </div>
                </div>

                <div className="px-3 py-1.5 bg-[#121218] border border-slate-700 rounded-xl text-amber-400 font-mono text-xs font-bold shadow">
                  {activeStepObj.metric}
                </div>
              </div>

              <p className="text-slate-300 text-xs leading-relaxed font-medium">
                {activeStepObj.description}
              </p>

              {/* Interactive Visual Graphic per step */}
              <div className="p-3 bg-[#0d0d12] rounded-2xl border border-slate-800 space-y-2 font-mono text-[11px]">
                {currentStep === 0 && (
                  <div className="flex items-center justify-between text-emerald-400">
                    <span>[Incoming Stream] Bill #POS-892109 Total: ₹5,850 (Kesar + Ghee)</span>
                    <span className="animate-pulse">● Ingesting POS Data</span>
                  </div>
                )}
                {currentStep === 1 && (
                  <div className="flex items-center justify-between text-amber-400">
                    <span>[IndexedDB Decrement] Amul Milk Stock: 48 ➔ 8 Units</span>
                    <span>Dexie Synced</span>
                  </div>
                )}
                {currentStep === 2 && (
                  <div className="flex items-center justify-between text-purple-400">
                    <span>[AI ML Engine] Consumption Velocity = 3.2 Units/Min</span>
                    <span>Surge Alert</span>
                  </div>
                )}
                {currentStep === 3 && (
                  <div className="flex items-center justify-between text-rose-400">
                    <span>[Predictive Alert] 🔴 Amul Milk Stock Out in 42 Mins!</span>
                    <span className="animate-bounce font-bold">Action Needed</span>
                  </div>
                )}
                {currentStep === 4 && (
                  <div className="flex items-center justify-between text-amber-300">
                    <span>[Smart Offer] 🔥 "Buy 2 Get ₹10 Off" Auto-Created</span>
                    <span>Conversion +18%</span>
                  </div>
                )}
                {currentStep === 5 && (
                  <div className="flex items-center justify-between text-emerald-400 font-bold">
                    <span>[Supplier Dispatch] 🚚 PO Dispatched to Supplier A (2h Delivery @ ₹24)</span>
                    <span><CheckCircle2 className="w-3.5 h-3.5 inline text-emerald-400" /> Fulfilled</span>
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-3.5 py-2 bg-[#181824] hover:bg-[#20202c] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-700"
                >
                  <Play className={`w-3.5 h-3.5 text-amber-400 ${isPlaying ? 'animate-pulse' : ''}`} />
                  <span>{isPlaying ? 'Pause Auto-Play' : 'Resume Play'}</span>
                </button>

                <button
                  onClick={handleRestart}
                  className="px-3 py-2 bg-[#181824] hover:bg-[#20202c] text-slate-400 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1 border border-slate-700"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restart</span>
                </button>
              </div>

              <button
                onClick={onClose}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 font-black rounded-xl text-xs shadow-lg"
              >
                Close Assistant
              </button>
            </div>
          </div>
        )}

        {activeTab === 'briefing' && (
          <div className="flex justify-end border-t border-slate-800 pt-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 font-black rounded-xl text-xs shadow-lg"
            >
              Close Assistant
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
