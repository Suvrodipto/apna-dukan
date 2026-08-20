import React, { useState, useRef, useEffect } from 'react';
import { Send, X, RefreshCw, Truck } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'supplier_ai';
  text: string;
  timestamp: string;
  suggestedDiscountPct?: number;
}

interface SupplierAIChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupplierAIChatbot: React.FC<SupplierAIChatbotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'sm-1',
      sender: 'supplier_ai',
      text: 'Namaste Wholesale Vendor! 🚚 I am your Supplier AI Margin & Clearance Advisor. Ask me how to clear unsold inventory, calculate optimal bulk discounts, or optimize B2B wholesale pricing!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = (customText?: string) => {
    const text = customText || inputValue;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateSupplierResponse(text.toLowerCase());
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 700);
  };

  const generateSupplierResponse = (query: string): ChatMessage => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (query.includes('unsold') || query.includes('discount') || query.includes('stock clearance') || query.includes('slow')) {
      return {
        id: `sa-${Date.now()}`,
        sender: 'supplier_ai',
        text: `📦 Slow-Moving Stock Clearance Strategy:\n\n• Target Item: Aashirvaad Atta & Surf Excel (Unsold > 30 Days)\n• Recommended Clearance Discount: 15% OFF Wholesale Rate\n• Impact: Clears 85 units in 5 days while locking in a 14.2% Gross Profit Margin.\n\n👉 Recommendation: Apply a "Buy 5 Get 1 Free" bundle for retail Kiranas!`,
        timestamp,
        suggestedDiscountPct: 15
      };
    }

    if (query.includes('bulk') || query.includes('price') || query.includes('margin') || query.includes('profit')) {
      return {
        id: `sa-${Date.now()}`,
        sender: 'supplier_ai',
        text: `💰 Wholesale Bulk Margin Optimization:\n\n• Minimum Order Quantity (MOQ): 50 Units\n• Tier 1 Rate (10-49 units): ₹210 / unit (16% Margin)\n• Tier 2 Bulk Rate (50+ units): ₹195 / unit (11% Margin + 3x Volume Surge)\n\n👉 Volume boost generates +₹14,500 net profit per delivery batch!`,
        timestamp
      };
    }

    return {
      id: `sa-${Date.now()}`,
      sender: 'supplier_ai',
      text: `Supplier AI Advisor is ready! You can ask:\n1. 📉 "How much discount should I give to clear unsold stock?"\n2. 🚚 "What is the optimal MOQ for Kirana stores?"\n3. 💰 "Calculate wholesale profit margin on Dairy Milk"`,
      timestamp
    };
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 w-full max-w-sm sm:max-w-md glass-panel bg-[#121218]/95 border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[520px] animate-in fade-in slide-in-from-bottom-5 duration-200">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-[#1f1a10] via-[#14141c] to-[#0c0c10] border-b border-amber-500/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20">
            <Truck className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-sm flex items-center gap-1.5">
              SUPPLIER VENDOR AI ADVISOR
              <span className="px-2 py-0.2 text-[8px] font-black bg-amber-500 text-slate-950 rounded uppercase">Vendor Private</span>
            </h3>
            <p className="text-[10px] text-amber-300 font-mono">Wholesale Clearance & Margin Advisor</p>
          </div>
        </div>

        <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages View */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className={`max-w-[85%] p-3 rounded-2xl whitespace-pre-line leading-relaxed shadow-sm ${
              msg.sender === 'user'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black rounded-br-none'
                : 'bg-[#181822] border border-slate-800 text-slate-200 rounded-bl-none'
            }`}>
              {msg.text}
            </div>
            <div className="text-[9px] text-slate-500 font-mono mt-1 px-1">{msg.timestamp}</div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
            <span className="font-mono text-[11px]">Supplier AI is calculating clearance margins...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="px-3 py-2 bg-[#0c0c10]/80 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <button
          onClick={() => handleSendMessage('How much discount to clear unsold stock?')}
          className="px-2.5 py-1 bg-[#181822] hover:bg-[#20202c] text-amber-400 border border-slate-800 rounded-lg text-[10px] font-bold whitespace-nowrap"
        >
          📉 Clearance Discount
        </button>
        <button
          onClick={() => handleSendMessage('Calculate wholesale profit margin')}
          className="px-2.5 py-1 bg-[#181822] hover:bg-[#20202c] text-emerald-400 border border-slate-800 rounded-lg text-[10px] font-bold whitespace-nowrap"
        >
          💰 Bulk Margin Strategy
        </button>
      </div>

      {/* Input Form */}
      <form
        onSubmit={e => { e.preventDefault(); handleSendMessage(); }}
        className="p-3 bg-[#0d0d12] border-t border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Ask Supplier AI (Unsold stock, B2B wholesale rates)..."
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          className="flex-1 bg-[#181822] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
        />
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="p-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold rounded-xl shadow-md disabled:opacity-50"
        >
          <Send className="w-4 h-4 fill-current" />
        </button>
      </form>
    </div>
  );
};
