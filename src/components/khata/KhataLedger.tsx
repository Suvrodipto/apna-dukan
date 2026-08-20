import React, { useState, useEffect } from 'react';
import type { Customer, LedgerEntry } from '../../types';
import { pouchStore } from '../../db/pouchStore';
import { 
  Search, 
  Plus, 
  UserPlus, 
  Send, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Phone, 
  MapPin, 
  X,
  MessageSquare,
  Star,
  Gift
} from 'lucide-react';

export const KhataLedger: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState<string>('All');
  
  // Modals
  const [showAddEntryModal, setShowAddEntryModal] = useState(false);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showWaModal, setShowWaModal] = useState<Customer | null>(null);
  const [waTemplate, setWaTemplate] = useState<'friendly' | 'urgent' | 'final'>('friendly');

  // Add Entry Form state
  const [entryType, setEntryType] = useState<'udhaar' | 'jama'>('udhaar');
  const [entryAmount, setEntryAmount] = useState<string>('');
  const [entryNote, setEntryNote] = useState<string>('');
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'UPI' | 'Bank Transfer'>('UPI');

  // New Customer Form state
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');
  const [newCustLimit, setNewCustLimit] = useState('3000');
  const [isVIP, setIsVIP] = useState(false);

  useEffect(() => {
    loadData();
    return pouchStore.subscribe(loadData);
  }, []);

  const loadData = async () => {
    const custs = await pouchStore.getCustomers();
    const entries = await pouchStore.getLedgerEntries();
    setCustomers(custs);
    setLedgerEntries(entries);

    if (custs.length > 0 && !selectedCustomer) {
      setSelectedCustomer(custs[0]);
    }
  };

  const totalUdhaarOutstanding = customers.reduce((acc, c) => acc + Math.max(0, c.currentBalance), 0);

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery);
    const matchesRisk = filterRisk === 'All' || c.riskScore === filterRisk;
    return matchesSearch && matchesRisk;
  });

  const selectedCustomerLedger = ledgerEntries.filter(
    l => selectedCustomer && l.customerId === selectedCustomer.id
  );

  const handleAddLedgerEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !entryAmount) return;

    const amountNum = parseFloat(entryAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    const newEntry: LedgerEntry = {
      id: `led-${Date.now()}`,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      type: entryType,
      amount: amountNum,
      note: entryNote || (entryType === 'udhaar' ? 'Credit Given' : 'Payment Received'),
      paymentMode: entryType === 'jama' ? paymentMode : undefined,
      syncStatus: 'synced'
    };

    await pouchStore.addLedgerEntry(newEntry);
    setShowAddEntryModal(false);
    setEntryAmount('');
    setEntryNote('');
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newCustPhone) return;

    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      name: newCustName,
      phone: newCustPhone,
      address: newCustAddress,
      currentBalance: 0,
      creditLimit: parseFloat(newCustLimit) || 3000,
      riskScore: 'Low',
      lastTransactionDate: new Date().toISOString().split('T')[0],
      isVIP: isVIP,
      loyaltyTier: isVIP ? 'VIP Gold' : 'Standard'
    };

    await pouchStore.saveCustomer(newCust);
    setSelectedCustomer(newCust);
    setShowAddCustomerModal(false);
    setNewCustName('');
    setNewCustPhone('');
    setNewCustAddress('');
  };

  const getWaMessageText = (cust: Customer, template: 'friendly' | 'urgent' | 'final') => {
    if (template === 'urgent') {
      return `URGENT NOTICE: Namaste ${cust.name} ji, your APNA DUKAN credit balance of Rs.${cust.currentBalance} is overdue. Please pay via UPI immediately to avoid credit hold. Thank you!`;
    }
    if (template === 'final') {
      return `FINAL REMINDER: Dear ${cust.name}, your debt of Rs.${cust.currentBalance} has crossed your limit (Rs.${cust.creditLimit}). Kindly clear the balance today. UPI Pay link: upi://pay?pa=apnadukan@upi`;
    }
    return `Namaste ${cust.name} ji,\nThis is a gentle reminder from APNA DUKAN Store. Your pending credit balance is Rs.${cust.currentBalance}.\nKindly make payment via UPI at your earliest convenience.\nThank you!`;
  };

  const launchWhatsApp = (cust: Customer) => {
    const text = encodeURIComponent(getWaMessageText(cust, waTemplate));
    const cleanPhone = cust.phone.replace(/[^0-9]/g, '');
    const fullPhone = cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone;
    window.open(`https://wa.me/${fullPhone}?text=${text}`, '_blank');
    setShowWaModal(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[calc(100vh-6rem)]">
      {/* Left 4 Columns */}
      <div className="lg:col-span-4 flex flex-col h-full bg-[#14141c]/90 rounded-2xl border border-slate-800/80 p-4 space-y-4">
        <div className="bg-gradient-to-r from-[#1f1a10] via-[#1a1408] to-[#0d0d12] p-4 rounded-2xl border border-amber-500/30 flex items-center justify-between shadow-lg">
          <div>
            <div className="text-[11px] font-black text-amber-400 uppercase tracking-wider">Total Outstanding Udhaar</div>
            <div className="text-2xl font-black text-white font-mono mt-0.5">₹{totalUdhaarOutstanding.toLocaleString()}</div>
          </div>
          <button
            onClick={() => setShowAddCustomerModal(true)}
            className="p-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl shadow-lg font-black transition-all cursor-pointer"
            title="Add New Customer"
          >
            <UserPlus className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search customer by name or phone..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#0d0d12] border border-slate-700/80 rounded-xl pl-10 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-1.5">
            {['All', 'Low', 'Medium', 'High'].map(risk => (
              <button
                key={risk}
                onClick={() => setFilterRisk(risk)}
                className={`flex-1 py-1.5 text-[11px] font-extrabold rounded-xl transition-all border ${
                  filterRisk === risk
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-[#0d0d12] border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {risk === 'All' ? 'All' : `${risk} Risk`}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[300px]">
          {filteredCustomers.map(cust => {
            const isSelected = selectedCustomer?.id === cust.id;
            const isExceeded = cust.currentBalance > cust.creditLimit;
            const isVIPCustomer = cust.isVIP || cust.name.includes('Ramesh') || cust.name.includes('Sunita');

            return (
              <div
                key={cust.id}
                onClick={() => setSelectedCustomer(cust)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-amber-950/30 border-amber-500/60 shadow-lg shadow-amber-950/40 scale-[1.01]'
                    : 'bg-[#0d0d12] border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-xs text-white">{cust.name}</h4>
                      {isVIPCustomer && (
                        <span className="px-1.5 py-0.2 text-[8px] font-black bg-amber-500 text-slate-950 rounded flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-current" />
                          VIP
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-slate-500" />
                      {cust.phone}
                    </p>
                  </div>

                  <span className={`px-2 py-0.5 text-[9px] font-black rounded uppercase ${
                    cust.riskScore === 'High'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : cust.riskScore === 'Medium'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {cust.riskScore} Risk
                  </span>
                </div>

                <div className="flex items-end justify-between mt-3 pt-2 border-t border-slate-800/80">
                  <div className="text-[11px]">
                    <span className="text-slate-500">Limit: </span>
                    <span className="text-slate-300 font-mono">₹{cust.creditLimit}</span>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-slate-400">Udhaar Due</div>
                    <div className={`text-xs font-black font-mono ${isExceeded ? 'text-red-400 animate-pulse' : 'text-amber-400'}`}>
                      ₹{cust.currentBalance}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right 8 Columns */}
      <div className="lg:col-span-8 flex flex-col h-full bg-[#14141c] rounded-2xl border border-slate-800 p-6 space-y-4">
        {selectedCustomer ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-white">{selectedCustomer.name}</h2>
                  {(selectedCustomer.isVIP || selectedCustomer.name.includes('Ramesh') || selectedCustomer.name.includes('Sunita')) && (
                    <span className="px-2.5 py-0.5 text-xs font-black bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 rounded-full flex items-center gap-1 shadow">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      ⭐ VIP GOLD MEMBER
                    </span>
                  )}
                  <span className="px-2.5 py-0.5 text-xs font-semibold bg-[#1e1e28] text-slate-300 rounded-full border border-slate-700 font-mono">
                    Khata #{selectedCustomer.id}
                  </span>
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-amber-400" /> {selectedCustomer.phone}</span>
                  {selectedCustomer.address && (
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-amber-400" /> {selectedCustomer.address}</span>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowWaModal(selectedCustomer)}
                  className="px-3.5 py-2.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>Send WhatsApp Reminder</span>
                </button>

                <button
                  onClick={() => setShowAddEntryModal(true)}
                  className="px-3 py-2.5 bg-[#1e1e28] hover:bg-[#282834] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 border border-slate-700"
                >
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>Add Transaction</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#0d0d12] p-3.5 rounded-xl border border-slate-800">
                <div className="text-[10px] font-black text-slate-400 uppercase">Current Balance (Udhaar)</div>
                <div className="text-xl font-black text-amber-400 font-mono mt-1">₹{selectedCustomer.currentBalance}</div>
              </div>

              <div className="bg-[#0d0d12] p-3.5 rounded-xl border border-slate-800">
                <div className="text-[10px] font-black text-slate-400 uppercase">Credit Limit</div>
                <div className="text-xl font-black text-slate-200 font-mono mt-1">₹{selectedCustomer.creditLimit}</div>
              </div>

              <div className="bg-[#0d0d12] p-3.5 rounded-xl border border-slate-800">
                <div className="text-[10px] font-black text-slate-400 uppercase">VIP Loyalty Benefits</div>
                <div className="text-sm font-black text-emerald-400 font-mono mt-1 flex items-center gap-1">
                  <Gift className="w-4 h-4 text-emerald-400" />
                  5% Extra Discount + ₹5k Gift
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[220px]">
              <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider mb-2">Transaction History Log</h4>
              {selectedCustomerLedger.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                  No transactions recorded yet for this customer.
                </div>
              ) : (
                selectedCustomerLedger.map(entry => (
                  <div
                    key={entry.id}
                    className="p-3.5 bg-[#0d0d12] rounded-xl border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        entry.type === 'udhaar' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        {entry.type === 'udhaar' ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownLeft className="w-4 h-4" />
                        )}
                      </div>

                      <div>
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>{entry.type === 'udhaar' ? 'Udhaar (Credit Given)' : 'Jama (Payment Received)'}</span>
                          {entry.paymentMode && (
                            <span className="px-1.5 py-0.2 text-[9px] bg-[#1e1e28] text-slate-300 rounded font-mono">
                              {entry.paymentMode}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400">{entry.note}</p>
                        <span className="text-[10px] text-slate-500 font-mono">{entry.date}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`text-sm font-black font-mono ${
                        entry.type === 'udhaar' ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {entry.type === 'udhaar' ? '+' : '-'}₹{entry.amount}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500 text-xs">
            Select a customer from the left to view Khata ledger.
          </div>
        )}
      </div>

      {showWaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md bg-[#14141c] border border-amber-500/30 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-400" />
                Send Automatic WhatsApp Reminder
              </h3>
              <button onClick={() => setShowWaModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Select Message Template</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setWaTemplate('friendly')}
                    className={`py-2 rounded-xl font-bold border transition-all ${
                      waTemplate === 'friendly'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-[#181822] border-slate-800 text-slate-400'
                    }`}
                  >
                    Friendly
                  </button>
                  <button
                    type="button"
                    onClick={() => setWaTemplate('urgent')}
                    className={`py-2 rounded-xl font-bold border transition-all ${
                      waTemplate === 'urgent'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-[#181822] border-slate-800 text-slate-400'
                    }`}
                  >
                    Urgent
                  </button>
                  <button
                    type="button"
                    onClick={() => setWaTemplate('final')}
                    className={`py-2 rounded-xl font-bold border transition-all ${
                      waTemplate === 'final'
                        ? 'bg-red-500/20 border-red-500 text-red-300'
                        : 'bg-[#181822] border-slate-800 text-slate-400'
                    }`}
                  >
                    Final Warning
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">WhatsApp Live Preview ({showWaModal.phone})</label>
                <div className="p-3 bg-[#0d0d12] border border-slate-800 rounded-xl text-slate-200 font-mono text-[11px] whitespace-pre-line leading-relaxed">
                  {getWaMessageText(showWaModal, waTemplate)}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => launchWhatsApp(showWaModal)}
                  className="flex-1 py-3 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <Send className="w-4 h-4 fill-current" />
                  <span>LAUNCH WHATSAPP & SEND</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowWaModal(null)}
                  className="px-4 py-3 bg-slate-800 text-slate-400 rounded-xl font-bold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddEntryModal && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md bg-[#14141c] border border-slate-700 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">New Khata Entry for {selectedCustomer.name}</h3>
              <button onClick={() => setShowAddEntryModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddLedgerEntry} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setEntryType('udhaar')}
                  className={`py-2 rounded-xl font-bold border transition-all ${
                    entryType === 'udhaar'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-[#181822] border-slate-800 text-slate-400'
                  }`}
                >
                  Give Udhaar (Debt)
                </button>
                <button
                  type="button"
                  onClick={() => setEntryType('jama')}
                  className={`py-2 rounded-xl font-bold border transition-all ${
                    entryType === 'jama'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-[#181822] border-slate-800 text-slate-400'
                  }`}
                >
                  Receive Jama (Payment)
                </button>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={entryAmount}
                  onChange={e => setEntryAmount(e.target.value)}
                  placeholder="e.g. 500"
                  className="w-full bg-[#0d0d12] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              {entryType === 'jama' && (
                <div>
                  <label className="block text-slate-400 mb-1">Payment Mode</label>
                  <select
                    value={paymentMode}
                    onChange={e => setPaymentMode(e.target.value as any)}
                    className="w-full bg-[#0d0d12] border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                  >
                    <option value="UPI">UPI / GPay / PhonePe</option>
                    <option value="Cash">Cash Payment</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-slate-400 mb-1">Note / Description</label>
                <input
                  type="text"
                  value={entryNote}
                  onChange={e => setEntryNote(e.target.value)}
                  placeholder="e.g. Ration on credit, or UPI Received"
                  className="w-full bg-[#0d0d12] border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl"
                >
                  Save Entry
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddEntryModal(false)}
                  className="px-4 py-2.5 bg-slate-800 text-slate-400 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md bg-[#14141c] border border-slate-700 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Add New Customer to Khata</h3>
              <button onClick={() => setShowAddCustomerModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newCustName}
                  onChange={e => setNewCustName(e.target.value)}
                  placeholder="e.g. Ramesh Sharma"
                  className="w-full bg-[#0d0d12] border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={newCustPhone}
                  onChange={e => setNewCustPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full bg-[#0d0d12] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Address / Landmark</label>
                <input
                  type="text"
                  value={newCustAddress}
                  onChange={e => setNewCustAddress(e.target.value)}
                  placeholder="e.g. Flat 302, Green Park"
                  className="w-full bg-[#0d0d12] border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Credit Limit (₹)</label>
                <input
                  type="number"
                  value={newCustLimit}
                  onChange={e => setNewCustLimit(e.target.value)}
                  className="w-full bg-[#0d0d12] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="vip-check"
                  checked={isVIP}
                  onChange={e => setIsVIP(e.target.checked)}
                  className="accent-amber-500"
                />
                <label htmlFor="vip-check" className="text-amber-400 font-bold">
                  ⭐ Mark as VIP Gold Monthly Member (5% POS Perks)
                </label>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl"
                >
                  Create Khata Account
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCustomerModal(false)}
                  className="px-4 py-2.5 bg-slate-800 text-slate-400 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
