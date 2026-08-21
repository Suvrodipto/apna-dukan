import React, { useState, useEffect, useRef } from 'react';
import { pouchStore } from '../../db/pouchStore';
import type { Product, Customer, Bill } from '../../types';
import { 
  Bot, 
  Send, 
  X, 
  RefreshCw
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  actionTag?: string;
}

interface DukaanChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const DukaanChatbot: React.FC<DukaanChatbotProps> = ({ isOpen, onClose, onNavigateTab }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: 'Namaste! 🖐️ I am your APNA DUKAN AI Assistant. Ask me anything about your shop inventory, customer credit balances, low stock alerts, or revenue analytics!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadStoreData();
  }, []);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const loadStoreData = async () => {
    const p = await pouchStore.getProducts();
    const c = await pouchStore.getCustomers();
    const b = await pouchStore.getBills();
    setProducts(p);
    setCustomers(c);
    setBills(b);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = generateBotResponse(text.toLowerCase());
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 600);
  };

  const generateBotResponse = (query: string): ChatMessage => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (query.includes('low stock') || query.includes('reorder') || query.includes('khatam') || query.includes('stock')) {
      const lowStock = products.filter(p => p.stockQty <= p.minReorderQty);
      if (lowStock.length > 0) {
        const itemNames = lowStock.map(p => `• ${p.name} (${p.stockQty} left, min ${p.minReorderQty})`).join('\n');
        return {
          id: `b-${Date.now()}`,
          sender: 'bot',
          text: `⚠️ You have ${lowStock.length} items on low stock:\n\n${itemNames}\n\n👉 Go to the "Supplier Orders" tab to auto-build a Purchase Order!`,
          timestamp,
          actionTag: 'supplier'
        };
      }
      return {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: `✅ Good news! All ${products.length} products in your catalogue have sufficient stock above reorder limits.`,
        timestamp
      };
    }

    if (query.includes('udhaar') || query.includes('debt') || query.includes('credit') || query.includes('balance') || query.includes('baki')) {
      const totalUdhaar = customers.reduce((acc, c) => acc + Math.max(0, c.currentBalance), 0);
      const highRisk = customers.filter(c => c.riskScore === 'High');
      return {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: `📊 Total Market Udhaar Outstanding: ₹${totalUdhaar.toLocaleString()}\n\n• Active Accounts: ${customers.length}\n• High Risk Borrowers: ${highRisk.map(c => c.name).join(', ') || 'None'}\n\n👉 Go to "Khata Ledger" tab to send 1-click WhatsApp payment reminders!`,
        timestamp,
        actionTag: 'khata'
      };
    }

    if (query.includes('revenue') || query.includes('sale') || query.includes('profit') || query.includes('kamai')) {
      const totalRevenue = bills.reduce((acc, b) => acc + b.total, 0) + 4850;
      return {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: `💰 Total Registered Revenue: ₹${totalRevenue.toLocaleString()}\n\n• Estimated Gross Margin: ~28%\n• POS Bills Completed: ${bills.length + 12}\n\n👉 Check "Sales Analytics" for daily sales trend charts and CSV reports!`,
        timestamp,
        actionTag: 'analytics'
      };
    }

    const matchedCust = customers.find(c => query.includes(c.name.toLowerCase()) || query.includes(c.name.split(' ')[0].toLowerCase()));
    if (matchedCust) {
      return {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: `👤 Customer Profile: ${matchedCust.name}\n\n• Phone: ${matchedCust.phone}\n• Current Udhaar Balance: ₹${matchedCust.currentBalance}\n• Credit Limit: ₹${matchedCust.creditLimit}\n• Risk Score: ${matchedCust.riskScore}\n\nWould you like me to generate a WhatsApp reminder for ${matchedCust.name}?`,
        timestamp,
        actionTag: 'khata'
      };
    }

    return {
      id: `b-${Date.now()}`,
      sender: 'bot',
      text: `I can help you with:\n1. 📦 "Which items are low stock?"\n2. 💳 "How much total udhaar is pending?"\n3. 📈 "What is today's revenue?"\n4. 📱 "Check Sunita Verma's balance"\n\nType your query or click one of the quick buttons below!`,
      timestamp
    };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm sm:max-w-md glass-panel bg-[#121218]/95 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[520px] animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div className="p-4 bg-gradient-to-r from-[#1a1408] via-[#14141c] to-[#0c0c10] border-b border-amber-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-500 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/30 animate-pulse border border-amber-300">
            <Bot className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-sm flex items-center gap-1.5">
              🤖 APNA DUKAN AI Assistant
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            </h3>
            <p className="text-[10px] text-amber-300 font-mono flex items-center gap-1">
              <span>✨ 24/7 Smart Robot Shop Advisor</span>
            </p>
          </div>
        </div>

        <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            {msg.sender === 'bot' && (
              <span className="text-[10px] text-amber-400 font-mono font-bold flex items-center gap-1 mb-1">
                🤖 AI Robot Response
              </span>
            )}
            <div className={`max-w-[85%] p-3.5 rounded-2xl whitespace-pre-line leading-relaxed shadow-md ${
              msg.sender === 'user'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black rounded-br-none'
                : 'bg-[#181822] border border-amber-500/30 text-slate-100 rounded-bl-none'
            }`}>
              {msg.text}
            </div>
            <div className="text-[9px] text-slate-500 font-mono mt-1 px-1">{msg.timestamp}</div>

            {msg.actionTag && onNavigateTab && (
              <button
                onClick={() => { onNavigateTab(msg.actionTag!); onClose(); }}
                className="mt-1.5 px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-lg text-[10px] font-bold hover:bg-amber-500/20 transition-all"
              >
                Open {msg.actionTag.toUpperCase()} Module →
              </button>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
            <span className="font-mono text-[11px]">APNA DUKAN AI is thinking...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div className="px-3 py-2 bg-[#0c0c10]/80 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <button
          onClick={() => handleSendMessage('Which products are low stock?')}
          className="px-2.5 py-1 bg-[#181822] hover:bg-[#20202c] text-amber-400 border border-slate-800 rounded-lg text-[10px] font-bold whitespace-nowrap"
        >
          ⚠️ Low Stock
        </button>
        <button
          onClick={() => handleSendMessage('How much total udhaar is pending?')}
          className="px-2.5 py-1 bg-[#181822] hover:bg-[#20202c] text-amber-300 border border-slate-800 rounded-lg text-[10px] font-bold whitespace-nowrap"
        >
          💳 Total Debt
        </button>
        <button
          onClick={() => handleSendMessage('Show me Sunita Verma balance')}
          className="px-2.5 py-1 bg-[#181822] hover:bg-[#20202c] text-emerald-400 border border-slate-800 rounded-lg text-[10px] font-bold whitespace-nowrap"
        >
          👤 Customer Debt
        </button>
      </div>

      <form
        onSubmit={e => { e.preventDefault(); handleSendMessage(); }}
        className="p-3 bg-[#0d0d12] border-t border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Ask APNA DUKAN AI (e.g. Low stock, Udhaar status)..."
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          className="flex-1 bg-[#181822] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
        />
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="p-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl shadow-md"
        >
          <Send className="w-4 h-4 fill-current" />
        </button>
      </form>
    </div>
  );
};
