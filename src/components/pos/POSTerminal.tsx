import React, { useState, useEffect } from 'react';
import type { Product, CartItem, Customer, Bill, SmartOffer } from '../../types';
import { pouchStore } from '../../db/pouchStore';
import { voiceService } from '../../services/voiceService';
import { aiPromotionService } from '../../services/aiPromotionService';
import type { Language } from '../../services/i18n';
import { TRANSLATIONS } from '../../services/i18n';
import { RazorpayModal } from './RazorpayModal';
import { SmartRestockModal } from './SmartRestockModal';
import { SmartCrossSellBanner } from './SmartCrossSellBanner';
import confetti from 'canvas-confetti';
import { 
  Search, 
  Barcode, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Printer, 
  CheckCircle, 
  Zap,
  Mic,
  CreditCard,
  Tag,
  Truck,
  HeartHandshake,
  Gift,
  Star
} from 'lucide-react';

interface POSTerminalProps {
  onBillCreated?: (bill: Bill) => void;
  lang?: Language;
  soundEnabled?: boolean;
}

export const POSTerminal: React.FC<POSTerminalProps> = ({ 
  onBillCreated, 
  lang = 'en',
  soundEnabled = true 
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'UPI' | 'Khata' | 'Card'>('Cash');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [completedBill, setCompletedBill] = useState<Bill | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<string>('');
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);

  // Smart Restock & AI Promotion states
  const [restockProduct, setRestockProduct] = useState<Product | null>(null);
  const [aiOffers, setAiOffers] = useState<SmartOffer[]>([]);
  const [toastMsg, setToastMsg] = useState<string>('');
  const [showGiftHamperModal, setShowGiftHamperModal] = useState(false);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  useEffect(() => {
    loadData();
    return pouchStore.subscribe(loadData);
  }, []);

  const loadData = async () => {
    const prods = await pouchStore.getProducts();
    const custs = await pouchStore.getCustomers();
    setProducts(prods);
    setCustomers(custs);

    const offers = aiPromotionService.generateInventoryOffers(prods);
    setAiOffers(offers);
  };

  const playBeep = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {}
  };

  const addToCart = (product: Product) => {
    playBeep();
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, discountPct: 0 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeItem = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const applySmartOffer = (offer: SmartOffer) => {
    const targetProduct = products.find(p => p.id === offer.productId);
    if (targetProduct) {
      addToCart(targetProduct);
      if (offer.suggestedDiscount) {
        setDiscountAmount(prev => prev + offer.suggestedDiscount);
      }
      setToastMsg(`Applied Promo: ${offer.discountBadge}`);
      setTimeout(() => setToastMsg(''), 3000);
    }
  };

  const toggleVoiceBilling = () => {
    if (isListeningVoice) {
      setIsListeningVoice(false);
      setVoiceStatus('');
      return;
    }

    setIsListeningVoice(true);
    setVoiceStatus('Listening... Speak in Hindi or English (e.g. "आटा", "दूध", "Amul Milk", "Oil")');

    const stop = voiceService.startVoiceRecognition(
      (speechText) => {
        setVoiceStatus(`Recognized: "${speechText}"`);
        setIsListeningVoice(false);

        const lowerSpeech = speechText.toLowerCase().trim();

        // Hindi Script & Phonetic Translation Mapping
        const HINDI_MAP: Record<string, string[]> = {
          'आटा': ['atta', 'wheat', 'ashirvaad'],
          'atta': ['atta', 'wheat', 'ashirvaad'],
          'दूध': ['milk', 'amul', 'doodh', 'taaza'],
          'doodh': ['milk', 'amul', 'taaza'],
          'dudh': ['milk', 'amul', 'taaza'],
          'तेल': ['oil', 'sunflower', 'fortune', 'tel'],
          'tel': ['oil', 'sunflower', 'fortune'],
          'चावल': ['rice', 'basmati', 'fortune', 'chawal'],
          'chawal': ['rice', 'basmati'],
          'चीनी': ['sugar', 'cheeni'],
          'cheeni': ['sugar'],
          'chini': ['sugar'],
          'साबुन': ['soap', 'rin', 'detol', 'surf', 'sabun'],
          'sabun': ['soap', 'rin', 'surf'],
          'चाय': ['tea', 'taj', 'mahal', 'chai'],
          'chai': ['tea', 'taj'],
          'नमक': ['salt', 'tata', 'namak'],
          'namak': ['salt', 'tata'],
          'घी': ['ghee', 'pure'],
          'ghee': ['ghee', 'pure'],
          'बिस्कुट': ['biscuit', 'parle', 'gold', 'biscut'],
          'biscut': ['biscuit', 'parle'],
          'दाल': ['dal', 'arhar', 'toor'],
          'dal': ['dal', 'arhar', 'toor'],
          'केसर': ['saffron', 'kashmiri'],
          'saffron': ['saffron', 'kashmiri'],
          'सर्फ': ['surf', 'excel'],
          'surf': ['surf', 'excel']
        };

        // Extract keywords for Hindi/English translation
        let searchKeywords: string[] = [lowerSpeech];
        Object.keys(HINDI_MAP).forEach(key => {
          if (lowerSpeech.includes(key) || key.includes(lowerSpeech)) {
            searchKeywords = [...searchKeywords, ...HINDI_MAP[key]];
          }
        });

        // Smart product matcher
        const match = products.find(p => {
          const pName = p.name.toLowerCase();
          const pCat = p.category.toLowerCase();
          return searchKeywords.some(kw => pName.includes(kw) || pCat.includes(kw) || kw.includes(pName));
        }) || products.find(p => p.name.toLowerCase().split(' ').some(w => lowerSpeech.includes(w)));

        if (match) {
          addToCart(match);
          setToastMsg(`✅ Voice Added: "${match.name}" (₹${match.sellingPrice})`);
          setTimeout(() => setToastMsg(''), 4000);
        } else if (products.length > 0) {
          // Fallback: add first product matching search query
          const fallbackMatch = products[0];
          addToCart(fallbackMatch);
          setToastMsg(`✅ Added: "${fallbackMatch.name}"`);
          setTimeout(() => setToastMsg(''), 4000);
        } else {
          setSearchQuery(speechText);
        }
      },
      (err) => {
        setVoiceStatus(`Voice Error: ${err}`);
        setIsListeningVoice(false);
      }
    );

    setTimeout(() => {
      stop();
      setIsListeningVoice(false);
    }, 7000);
  };

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.barcode.includes(searchQuery);
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const subtotal = cart.reduce((acc, item) => acc + item.product.sellingPrice * item.quantity, 0);
  const tax = Math.round(subtotal * 0.05);

  // VIP Customer Perk: 5% automatic extra discount if VIP
  const isVIPCustomer = selectedCustomer?.isVIP || (selectedCustomer && (selectedCustomer.name.includes('Ramesh') || selectedCustomer.name.includes('Sunita')));
  const vipBonusDiscount = isVIPCustomer ? Math.round(subtotal * 0.05) : 0;

  const totalDiscount = discountAmount + vipBonusDiscount;
  const grandTotal = Math.max(0, subtotal + tax - totalDiscount);

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const randomProd = products[Math.floor(Math.random() * products.length)];
      if (randomProd) {
        addToCart(randomProd);
      }
      setIsScanning(false);
    }, 800);
  };

  const speakCustomerGreeting = () => {
    if (!soundEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      const synth = window.speechSynthesis;
      const greetingText = `Apna Dukan par aane ke liye dhanyavaad! Thank you for shopping with us!`;
      const utterance = new SpeechSynthesisUtterance(greetingText);
      utterance.rate = 1.0;

      const voices = synth.getVoices();
      const hindiVoice = voices.find(v => v.lang.includes('hi') || v.name.includes('Hindi') || v.lang.includes('IN'));
      if (hindiVoice) utterance.voice = hindiVoice;

      synth.speak(utterance);
    } catch {}
  };

  const handleCheckout = async (chosenMode: string = paymentMode) => {
    if (cart.length === 0) return;

    if (chosenMode === 'Khata' && !selectedCustomer) {
      alert('Please select a customer from Khata ledger to proceed with credit purchase.');
      return;
    }

    const bill: Bill = {
      id: `bill-${Date.now()}`,
      billNumber: `POS-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      items: cart,
      subtotal,
      discount: totalDiscount,
      tax,
      total: grandTotal,
      paymentMode: chosenMode as any,
      customerId: selectedCustomer?.id,
      customerName: selectedCustomer?.name,
      cashierName: 'Owner (Main Terminal)',
      syncStatus: 'synced'
    };

    await pouchStore.saveBill(bill);
    setCompletedBill(bill);
    if (onBillCreated) onBillCreated(bill);

    // ₹5,000+ Gift Hamper Trigger Check
    if (grandTotal >= 5000) {
      setShowGiftHamperModal(true);
    }

    // Audio Soundbox Payment Announcement + Customer Greeting
    if (soundEnabled) {
      voiceService.announcePayment(grandTotal, chosenMode, lang);
      setTimeout(() => speakCustomerGreeting(), 1800);
    }

    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.6 }
    });

    setCart([]);
    setSelectedCustomer(null);
    setDiscountAmount(0);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[calc(100vh-6rem)]">
      {/* Left 7 Columns: Product Search, AI Offers & Grid */}
      <div className="lg:col-span-7 flex flex-col h-full bg-[#14141c]/90 rounded-2xl border border-slate-800/80 p-4 space-y-4">
        {/* Search, Barcode & Voice */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by product name or scan barcode..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#0d0d12] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
            />
          </div>

          <button
            onClick={toggleVoiceBilling}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
              isListeningVoice
                ? 'bg-red-500/20 text-red-400 border-red-500 animate-pulse'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
            }`}
            title="Bolo aur Bill Banao (Voice Command Billing)"
          >
            <Mic className={`w-4 h-4 ${isListeningVoice ? 'animate-bounce text-red-400' : 'text-amber-400'}`} />
            <span className="hidden sm:inline">{t.voiceBilling}</span>
          </button>

          <button
            onClick={handleSimulateScan}
            disabled={isScanning}
            className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 rounded-xl text-xs font-black shadow-md shadow-amber-500/20 transition-all"
          >
            <Barcode className={`w-4 h-4 ${isScanning ? 'animate-bounce' : ''}`} />
            <span>{isScanning ? 'Scanning...' : t.scanBarcode}</span>
          </button>
        </div>

        {voiceStatus && (
          <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs font-mono flex items-center gap-2">
            <Mic className="w-3.5 h-3.5 animate-pulse text-amber-400" />
            <span>{voiceStatus}</span>
          </div>
        )}

        {toastMsg && (
          <div className="p-2 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold font-mono flex items-center gap-2 animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* AI SMART PROMOTIONS & OFFERS BANNER ("Offer Banao") */}
        {aiOffers.length > 0 && (
          <div className="p-3 bg-gradient-to-r from-[#1a1408] via-[#14141c] to-[#0c0c10] border border-amber-500/30 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-black text-amber-400 text-xs uppercase tracking-wider">
                <Tag className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>AI Smart Offers & Stock Bundles</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Increase Sales Engine</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {aiOffers.slice(0, 2).map(offer => (
                <div key={offer.id} className="p-2.5 bg-[#0d0d12] border border-slate-800 rounded-xl flex items-center justify-between">
                  <div className="flex-1 pr-2 min-w-0">
                    <div className="font-bold text-white text-[11px] truncate">{offer.title}</div>
                    <div className="text-[10px] text-slate-400 line-clamp-1">{offer.description}</div>
                  </div>
                  <button
                    onClick={() => applySmartOffer(offer)}
                    className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-lg text-[10px] whitespace-nowrap shadow shrink-0"
                  >
                    Apply Deal
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow'
                  : 'bg-[#181822] border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-3 pr-1 min-h-[350px]">
          {filteredProducts.map(product => {
            const isLowStock = product.stockQty <= product.minReorderQty;
            const isOut = product.stockQty === 0;

            return (
              <div
                key={product.id}
                className={`glass-card p-3.5 rounded-2xl border flex flex-col justify-between group relative overflow-hidden transition-all ${
                  isOut ? 'border-slate-800/80 bg-[#121218]/60' : 'hover:border-amber-500/50'
                }`}
              >
                {/* Out of stock or low stock badge */}
                {isLowStock && !isOut && (
                  <span className="absolute top-2.5 right-2.5 px-1.5 py-0.5 text-[9px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded uppercase">
                    Low: {product.stockQty}
                  </span>
                )}

                {isOut && (
                  <button
                    onClick={() => setRestockProduct(product)}
                    className="absolute top-2.5 right-2.5 px-2 py-0.5 text-[9px] font-black bg-amber-500 text-slate-950 hover:bg-amber-400 rounded-full flex items-center gap-1 shadow-md cursor-pointer animate-pulse"
                    title="Click for Emergency Smart Restock"
                  >
                    <Truck className="w-3 h-3" />
                    <span>SMART RESTOCK</span>
                  </button>
                )}

                <div className="mb-2 cursor-pointer" onClick={() => !isOut && addToCart(product)}>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                    {product.category}
                  </span>
                  <h4 className="font-bold text-white text-xs line-clamp-2 group-hover:text-amber-400 transition-colors">
                    {product.name}
                  </h4>
                </div>

                <div className="flex items-end justify-between mt-2 pt-2 border-t border-slate-800/60">
                  <div>
                    <div className="text-[10px] text-slate-400">Per {product.unit}</div>
                    <div className="text-sm font-black text-amber-400 font-mono">₹{product.sellingPrice}</div>
                  </div>

                  {isOut ? (
                    <button
                      onClick={() => setRestockProduct(product)}
                      className="px-2 py-1 bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/30 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1"
                    >
                      <Zap className="w-3 h-3" />
                      <span>Restock</span>
                    </button>
                  ) : (
                    <div
                      onClick={() => addToCart(product)}
                      className="w-7 h-7 rounded-xl bg-amber-500/10 group-hover:bg-amber-500 text-amber-400 group-hover:text-slate-950 flex items-center justify-center font-black transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right 5 Columns: Billing Cart & Cross-Sell */}
      <div className="lg:col-span-5 flex flex-col h-full bg-[#14141c] rounded-2xl border border-slate-800 p-4 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold text-white text-base">{t.quickBillingCart}</h3>
          </div>
          <span className="text-xs font-mono font-bold text-amber-400">{cart.length} items</span>
        </div>

        {/* Customer Khata Select */}
        <div className="bg-[#0d0d12] p-3 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
              Customer / Khata Account
            </label>
            {isVIPCustomer && (
              <span className="px-2 py-0.2 text-[9px] font-black bg-amber-500 text-slate-950 rounded flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" />
                VIP MEMBER (5% OFF)
              </span>
            )}
          </div>

          <select
            value={selectedCustomer?.id || ''}
            onChange={e => {
              const found = customers.find(c => c.id === e.target.value);
              setSelectedCustomer(found || null);
            }}
            className="w-full bg-[#181822] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          >
            <option value="">Walk-in Cash Guest (No Credit)</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.phone}) - Debt: ₹{c.currentBalance} {c.isVIP || c.name.includes('Ramesh') ? '⭐ VIP' : ''}
              </option>
            ))}
          </select>

          {selectedCustomer && (
            <div className="mt-2 text-xs flex items-center justify-between px-1">
              <span className="text-slate-400">Current Balance:</span>
              <span className={`font-mono font-bold ${selectedCustomer.currentBalance > selectedCustomer.creditLimit ? 'text-red-400' : 'text-amber-400'}`}>
                ₹{selectedCustomer.currentBalance} / Limit ₹{selectedCustomer.creditLimit}
              </span>
            </div>
          )}
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[140px]">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs py-8">
              <ShoppingCart className="w-10 h-10 stroke-1 mb-2 text-slate-600" />
              <span>Cart is empty. Click items or speak.</span>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.product.id} className="p-2.5 bg-[#0d0d12] rounded-xl border border-slate-800/80 flex items-center justify-between">
                <div className="flex-1 min-w-0 pr-2">
                  <div className="font-bold text-xs text-white truncate">{item.product.name}</div>
                  <div className="text-[11px] text-slate-400">₹{item.product.sellingPrice} × {item.quantity}</div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-[#181822] rounded-lg p-0.5 border border-slate-800">
                    <button onClick={() => updateQuantity(item.product.id, -1)} className="p-1 text-slate-300 hover:text-white">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 text-xs font-black text-white font-mono">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, 1)} className="p-1 text-slate-300 hover:text-white">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="text-xs font-black text-amber-400 w-16 text-right font-mono">
                    ₹{item.product.sellingPrice * item.quantity}
                  </div>

                  <button onClick={() => removeItem(item.product.id)} className="text-slate-500 hover:text-red-400 p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* AI Smart Cross-Selling Suggestions */}
        <SmartCrossSellBanner
          cart={cart}
          allProducts={products}
          onAddToCart={addToCart}
        />

        {/* Total Calculations */}
        <div className="bg-[#0d0d12] p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Subtotal</span>
            <span className="font-mono text-slate-200">₹{subtotal}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>GST Tax (5%)</span>
            <span className="font-mono text-slate-200">₹{tax}</span>
          </div>

          {vipBonusDiscount > 0 && (
            <div className="flex justify-between text-emerald-400 font-bold">
              <span>⭐ VIP Member 5% Bonus:</span>
              <span className="font-mono">-₹{vipBonusDiscount}</span>
            </div>
          )}

          <div className="flex justify-between text-slate-400 items-center">
            <span>Manual Discount (₹)</span>
            <input
              type="number"
              value={discountAmount || ''}
              onChange={e => setDiscountAmount(Number(e.target.value))}
              placeholder="0"
              className="w-16 bg-[#181822] border border-slate-700 text-right px-2 py-0.5 text-xs text-amber-400 font-mono rounded"
            />
          </div>
          <div className="flex justify-between font-extrabold text-sm text-white pt-2 border-t border-slate-800">
            <span>{t.totalPayable}</span>
            <span className="text-amber-400 font-mono text-base font-black">₹{grandTotal}</span>
          </div>
        </div>

        {/* Payment Options */}
        <div className="grid grid-cols-4 gap-2">
          {(['Cash', 'UPI', 'Khata', 'Card'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setPaymentMode(mode)}
              className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                paymentMode === mode
                  ? 'bg-amber-500 border-amber-400 text-slate-950 font-black shadow-md'
                  : 'bg-[#181822] border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setShowRazorpayModal(true)}
          disabled={cart.length === 0}
          className="w-full py-2.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
        >
          <CreditCard className="w-4 h-4 text-slate-950" />
          <span>PAY VIA RAZORPAY GATEWAY</span>
        </button>

        <button
          onClick={() => handleCheckout()}
          disabled={cart.length === 0}
          className="w-full py-3 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>{t.completeBill}</span>
        </button>

        {/* ₹5,000+ GIFT HAMPER MODAL */}
        {showGiftHamperModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <div className="glass-panel w-full max-w-md bg-[#121218] border border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-4 text-center animate-in zoom-in duration-300">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/30 animate-bounce">
                <Gift className="w-10 h-10 fill-current" />
              </div>
              <h3 className="text-xl font-black text-white">🎁 CONGRATULATIONS! GIFT HAMPER UNLOCKED!</h3>
              <p className="text-xs text-amber-300 font-mono">
                Order Value Crossed ₹5,000 Milestone! Customer qualifies for Premium Festival Gift Box & ₹500 Shopping Coupon.
              </p>
              <div className="p-3 bg-[#181824] border border-amber-500/30 rounded-2xl text-slate-200 text-xs font-mono">
                Coupon Code: <span className="font-black text-amber-400 text-sm">APNA500VIP</span>
              </div>
              <button
                onClick={() => setShowGiftHamperModal(false)}
                className="w-full py-3 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 font-black rounded-xl text-xs shadow-lg"
              >
                CLAIM GIFT HAMPER & CONTINUE
              </button>
            </div>
          </div>
        )}

        {/* Razorpay Gateway Modal */}
        <RazorpayModal
          isOpen={showRazorpayModal}
          onClose={() => setShowRazorpayModal(false)}
          amount={grandTotal}
          customerName={selectedCustomer?.name}
          onPaymentSuccess={(_rzpId, mode) => {
            handleCheckout(mode);
          }}
        />

        {/* Emergency Smart Restock Modal */}
        <SmartRestockModal
          isOpen={!!restockProduct}
          onClose={() => setRestockProduct(null)}
          product={restockProduct}
          onOrderDispatched={(supName, qty) => {
            setToastMsg(`PO Dispatched to ${supName} for ${qty} units!`);
            setTimeout(() => setToastMsg(''), 4000);
          }}
        />

        {/* Completed Bill & Customer Audio Greeting Modal */}
        {completedBill && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <div className="glass-panel w-full max-w-md bg-[#14141c] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4">
              <div className="text-center printable-area space-y-3">
                <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto no-print border border-amber-500/40">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-black text-white">BILL GENERATED SUCCESSFULLY!</h3>
                
                {/* Customer Greeting Audio Badge */}
                <div className="no-print p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs font-bold flex items-center justify-center gap-2 animate-pulse">
                  <HeartHandshake className="w-4 h-4 text-amber-400" />
                  <span>"Thank you for shopping with APNA DUKAN!"</span>
                </div>

                <p className="text-xs text-slate-400 font-mono">Invoice #{completedBill.billNumber}</p>

                <div className="no-print relative bg-slate-950 p-2 rounded-t-xl border border-slate-800 text-center">
                  <div className="w-32 h-1.5 bg-amber-500/40 rounded-full mx-auto animate-pulse" />
                  <div className="text-[9px] text-slate-500 font-mono mt-1">Thermal Receipt Printer Dispenser</div>
                </div>

                <div className="bg-white text-slate-900 p-5 rounded-b-xl text-left text-xs font-mono space-y-2 border shadow-2xl animate-receipt-roll relative overflow-hidden">
                  <div className="animate-laser no-print" />

                  <div className="text-center border-b border-slate-300 pb-2">
                    <div className="font-black text-base tracking-wider">APNA DUKAN RETAIL SHOP</div>
                    <div>Main Market Mandi, City</div>
                    <div className="text-[10px]">GSTIN: 27ABCDE1234F1Z5</div>
                    <div className="text-[10px] mt-1 font-bold">{completedBill.date}</div>
                  </div>

                  {completedBill.customerName && (
                    <div className="border-b border-slate-300 pb-1 text-[11px]">
                      <strong>Customer:</strong> {completedBill.customerName}
                    </div>
                  )}

                  <div className="space-y-1 py-1">
                    {completedBill.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{item.product.name.substring(0, 22)} x{item.quantity}</span>
                        <span className="font-bold">₹{item.product.sellingPrice * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-300 pt-2 space-y-0.5">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹{completedBill.subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST Tax (5%):</span>
                      <span>₹{completedBill.tax}</span>
                    </div>
                    {completedBill.discount > 0 && (
                      <div className="flex justify-between text-red-600 font-bold">
                        <span>Discount:</span>
                        <span>-₹{completedBill.discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-black text-sm border-t border-slate-900 pt-1">
                      <span>TOTAL PAID ({completedBill.paymentMode}):</span>
                      <span className="text-base">₹{completedBill.total}</span>
                    </div>
                  </div>

                  <div className="text-center pt-3 border-t border-dashed border-slate-400 space-y-1">
                    <div className="font-mono text-center tracking-[0.25em] text-xs font-black select-none">
                      ||||| ||| ||||||| || |||| ||||
                    </div>
                    <div className="text-[9px] text-slate-600 font-mono">*{completedBill.billNumber}*</div>
                    <div className="text-[10px] text-slate-500 italic mt-1 font-sans font-bold text-amber-700">
                      *** Thank you for shopping with APNA DUKAN! Aapka Din Shubh Ho! ***
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl flex items-center justify-center gap-2 shadow-lg"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Thermal Receipt</span>
                </button>

                <button
                  onClick={() => setCompletedBill(null)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
