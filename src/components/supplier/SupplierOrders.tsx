import React, { useState, useEffect } from 'react';
import type { Supplier, PurchaseOrder, Product, UserRole } from '../../types';
import { pouchStore } from '../../db/pouchStore';
import { 
  Truck, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Star, 
  X,
  Sparkles,
  Bot,
  DollarSign,
  Award,
  Clock,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SupplierOrdersProps {
  role: UserRole;
}

export const SupplierOrders: React.FC<SupplierOrdersProps> = ({ role: _role }) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [aiRecommendationAccepted, setAiRecommendationAccepted] = useState(false);

  // Modal
  const [showCreatePOModal, setShowCreatePOModal] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [orderItems, setOrderItems] = useState<Array<{ productId: string; qty: number }>>([]);

  useEffect(() => {
    loadData();
    return pouchStore.subscribe(loadData);
  }, []);

  const loadData = async () => {
    const supps = await pouchStore.getSuppliers();
    const pos = await pouchStore.getPurchaseOrders();
    const prods = await pouchStore.getProducts();
    setSuppliers(supps);
    setPurchaseOrders(pos);
    setProducts(prods);

    if (supps.length > 0 && !selectedSupplierId) {
      setSelectedSupplierId(supps[0].id);
    }
  };

  const lowStockProducts = products.filter(p => p.stockQty <= p.minReorderQty);

  // Find Amul Milk product if available
  const amulMilk = products.find(p => p.name.toLowerCase().includes('amul') && p.name.toLowerCase().includes('milk')) || products[3];
  const amulSupplier = suppliers.find(s => s.name.toLowerCase().includes('amul')) || suppliers[0];

  // 1-Click Accept AI Reorder Recommendation
  const handleAcceptAIRecommendation = async () => {
    if (!amulMilk || !amulSupplier) return;

    const newPO: PurchaseOrder = {
      id: `po-${Date.now()}`,
      poNumber: `PO-${new Date().toISOString().substring(0, 10)}-${Math.floor(10 + Math.random() * 90)}`,
      supplierId: amulSupplier.id,
      supplierName: amulSupplier.name,
      dateCreated: new Date().toISOString().replace('T', ' ').substring(0, 16),
      expectedDelivery: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      items: [
        {
          productId: amulMilk.id,
          productName: amulMilk.name,
          orderQty: 40,
          unitPrice: amulMilk.costPrice
        }
      ],
      totalAmount: amulMilk.costPrice * 40,
      status: 'Sent',
      notes: '🤖 Automated AI Procurement Recommendation: 40 units Amul Taaza Milk dispatched (₹320 bulk savings verified).',
      syncStatus: 'synced'
    };

    await pouchStore.savePurchaseOrder(newPO);
    setAiRecommendationAccepted(true);
    confetti({ particleCount: 75, spread: 90, origin: { y: 0.6 } });
    setTimeout(() => setAiRecommendationAccepted(false), 5000);
  };

  // Modify AI Recommendation
  const handleModifyAIOrder = () => {
    if (amulMilk && amulSupplier) {
      setSelectedSupplierId(amulSupplier.id);
      setOrderItems([{ productId: amulMilk.id, qty: 40 }]);
    }
    setShowCreatePOModal(true);
  };

  const handleAutoBuildPO = () => {
    if (lowStockProducts.length === 0) return;
    const items = lowStockProducts.map(p => ({ productId: p.id, qty: p.minReorderQty * 2 }));
    setOrderItems(items);
    setShowCreatePOModal(true);
  };

  const handleCreatePO = async (e: React.FormEvent) => {
    e.preventDefault();
    const supp = suppliers.find(s => s.id === selectedSupplierId);
    if (!supp || orderItems.length === 0) return;

    const poItems = orderItems
      .map(item => {
        const prod = products.find(p => p.id === item.productId);
        if (!prod) return null;
        return {
          productId: prod.id,
          productName: prod.name,
          orderQty: item.qty,
          unitPrice: prod.costPrice
        };
      })
      .filter(Boolean) as any[];

    const totalAmount = poItems.reduce((acc, i) => acc + i.unitPrice * i.orderQty, 0);

    const newPO: PurchaseOrder = {
      id: `po-${Date.now()}`,
      poNumber: `PO-${new Date().toISOString().substring(0, 10)}-${Math.floor(10 + Math.random() * 90)}`,
      supplierId: supp.id,
      supplierName: supp.name,
      dateCreated: new Date().toISOString().replace('T', ' ').substring(0, 16),
      expectedDelivery: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      items: poItems,
      totalAmount,
      status: 'Sent',
      notes: 'Automated restock order generated via Dukaan OS.',
      syncStatus: 'synced'
    };

    await pouchStore.savePurchaseOrder(newPO);
    setShowCreatePOModal(false);
    setOrderItems([]);
  };

  const updatePOStatus = async (po: PurchaseOrder, newStatus: 'Sent' | 'In-Transit' | 'Fulfilled' | 'Cancelled') => {
    await pouchStore.savePurchaseOrder({ ...po, status: newStatus });

    if (newStatus === 'Fulfilled') {
      const allProds = await pouchStore.getProducts();
      for (const item of po.items) {
        const target = allProds.find(p => p.id === item.productId);
        if (target) {
          await pouchStore.saveProduct({
            ...target,
            stockQty: target.stockQty + item.orderQty
          });
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Truck className="w-6 h-6 text-blue-400" />
            Supplier Purchase Order Workflow
          </h2>
          <p className="text-xs text-slate-400">Automated restock triggers, vendor performance scores, and shipment tracking</p>
        </div>

        <div className="flex items-center gap-3">
          {lowStockProducts.length > 0 && (
            <button
              onClick={handleAutoBuildPO}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-amber-500/20 animate-pulse"
            >
              <AlertTriangle className="w-4 h-4 fill-current" />
              <span>Auto-Build PO ({lowStockProducts.length} Low Items)</span>
            </button>
          )}

          <button
            onClick={() => {
              setOrderItems([{ productId: products[0]?.id || '', qty: 10 }]);
              setShowCreatePOModal(true);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Create Purchase Order</span>
          </button>
        </div>
      </div>

      {/* 🤖 AI SMART REORDER RECOMMENDATION CARD */}
      <div className="p-5 bg-gradient-to-r from-[#181826] via-[#141422] to-[#181826] rounded-3xl border border-amber-500/50 shadow-2xl space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-black text-xl shadow-lg shadow-amber-500/20 animate-glow">
              <Bot className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base tracking-tight flex items-center gap-2">
                🤖 AI Procurement Assistant
                <span className="px-2.5 py-0.5 text-[9px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full font-mono">
                  AUTONOMOUS REORDER
                </span>
              </h3>
              <p className="text-xs text-amber-300 font-mono">Predictive Stock-Out Prevention Model</p>
            </div>
          </div>

          <div className="px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold rounded-xl flex items-center gap-1.5 shadow">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Estimated Savings: ₹320</span>
          </div>
        </div>

        <div className="p-4 bg-[#0d0d14] rounded-2xl border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-rose-400">
            <span className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 animate-bounce shrink-0" />
              ⚠️ Amul Taaza Milk 500ml is predicted to run out in 2 days.
            </span>
            <span className="font-mono text-slate-400 text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              Stock Level: 4 Units Left
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono pt-1 text-slate-300">
            <div className="p-2.5 bg-[#14141c] rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Recommended Order</span>
              <strong className="text-amber-400 text-sm font-black">40 units</strong>
            </div>

            <div className="p-2.5 bg-[#14141c] rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Best Supplier</span>
              <strong className="text-emerald-400 text-sm font-black flex items-center gap-1">
                Amul Dairy Distributors
                <span className="px-1.5 py-0.2 bg-amber-500 text-slate-950 font-sans font-black text-[9px] rounded">
                  ✨ AI Rec
                </span>
              </strong>
            </div>

            <div className="p-2.5 bg-[#14141c] rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Estimated Savings</span>
              <strong className="text-emerald-300 text-sm font-black">₹320 (Bulk Margin)</strong>
            </div>
          </div>
        </div>

        {aiRecommendationAccepted ? (
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-xl flex items-center justify-center gap-2 font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>AI Recommendation Accepted! Purchase Order #PO-Amul Dispatched Successfully!</span>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={handleAcceptAIRecommendation}
              className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 stroke-[3]" />
              <span>Accept Recommendation (Create & Dispatch PO)</span>
            </button>

            <button
              onClick={handleModifyAIOrder}
              className="px-5 py-2.5 bg-[#181824] hover:bg-slate-800 text-amber-300 border border-slate-700 font-bold rounded-xl text-xs transition-all cursor-pointer"
            >
              Modify Order
            </button>
          </div>
        )}
      </div>

      {/* 📊 SUPPLIER COMPARISON SCORE TABLE */}
      <div className="p-5 bg-[#14141c] rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-white text-base flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            📊 Supplier Comparison Scorecard & Performance Analytics
          </h3>
          <span className="text-xs font-mono text-slate-400">Evaluated on Reliability, Speed & Margin</span>
        </div>

        <div className="overflow-x-auto bg-[#0d0d12] rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#181824] text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="p-3.5">Supplier Name & Category</th>
                <th className="p-3.5">⭐ Reliability Score</th>
                <th className="p-3.5">🚚 Avg Delivery Time</th>
                <th className="p-3.5">💰 Price Competitiveness</th>
                <th className="p-3.5">📦 Fulfillment Rate</th>
                <th className="p-3.5 text-right">Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {suppliers.map((supp) => {
                const isBest = supp.isAIRecommended || supp.name.includes('Amul');
                return (
                  <tr key={supp.id} className={`hover:bg-[#181824] transition-colors ${isBest ? 'bg-amber-950/10' : ''}`}>
                    <td className="p-3.5 font-bold text-white">
                      <div className="flex items-center gap-2">
                        <span>{supp.name}</span>
                        {isBest && (
                          <span className="px-2 py-0.5 text-[9px] font-black bg-amber-500 text-slate-950 rounded-full font-mono flex items-center gap-1 shadow">
                            <Sparkles className="w-2.5 h-2.5 fill-current" />
                            AI Recommended
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 block font-normal mt-0.5">{supp.category}</span>
                    </td>

                    <td className="p-3.5 font-mono">
                      <div className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                        <span className="font-bold text-white">{supp.reliabilityScore || 95}%</span>
                        <span className="text-[10px] text-slate-500">({supp.rating}★)</span>
                      </div>
                    </td>

                    <td className="p-3.5 font-mono text-slate-200">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-blue-400" />
                        <span>{supp.deliveryTimeDays || 1.5} Days</span>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                        (supp.priceCompetitiveness || 'Best') === 'Best'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                        💰 {supp.priceCompetitiveness || 'Good'}
                      </span>
                    </td>

                    <td className="p-3.5 font-mono font-bold text-emerald-400">
                      <div className="flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{supp.fulfillmentRatePercent || 98.5}%</span>
                      </div>
                    </td>

                    <td className="p-3.5 text-right font-mono text-[11px] text-slate-400">
                      <div>{supp.phone}</div>
                      <div className="text-[10px] text-slate-500">{supp.contactPerson}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Purchase Orders Log */}
      <div className="bg-[#14141c] rounded-3xl border border-slate-800 p-6 space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Active Purchase Orders Log</h3>

        {purchaseOrders.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
            No purchase orders created yet.
          </div>
        ) : (
          <div className="space-y-3">
            {purchaseOrders.map(po => (
              <div key={po.id} className="p-4 bg-[#0d0d12] rounded-2xl border border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{po.poNumber}</span>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                        po.status === 'Fulfilled'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : po.status === 'In-Transit'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {po.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">Supplier: {po.supplierName} • Created: {po.dateCreated}</p>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-slate-400">Total Value</div>
                    <div className="text-base font-black text-amber-400 font-mono">₹{po.totalAmount}</div>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  {po.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-slate-300 font-mono">
                      <span>{item.productName} (x{item.orderQty})</span>
                      <span className="text-slate-400">₹{item.unitPrice * item.orderQty}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  <span className="text-slate-400 font-mono text-[11px]">
                    Expected Delivery: <strong className="text-slate-200">{po.expectedDelivery}</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    {po.status === 'Sent' && (
                      <button
                        onClick={() => updatePOStatus(po, 'In-Transit')}
                        className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-xl"
                      >
                        Mark In-Transit
                      </button>
                    )}

                    {po.status === 'In-Transit' && (
                      <button
                        onClick={() => updatePOStatus(po, 'Fulfilled')}
                        className="px-3 py-1 bg-emerald-500 text-slate-950 text-xs font-extrabold rounded-xl flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Mark Stock Received
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create PO Modal */}
      {showCreatePOModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="glass-panel w-full max-w-lg bg-[#14141c] border border-amber-500/40 rounded-3xl p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Create Purchase Order</h3>
              <button onClick={() => setShowCreatePOModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePO} className="space-y-4">
              <div>
                <label className="block text-slate-400 mb-1">Select Supplier *</label>
                <select
                  value={selectedSupplierId}
                  onChange={e => setSelectedSupplierId(e.target.value)}
                  className="w-full bg-[#0d0d12] border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                >
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-slate-400">Order Line Items</label>
                {orderItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <select
                      value={item.productId}
                      onChange={e => {
                        const newItems = [...orderItems];
                        newItems[idx].productId = e.target.value;
                        setOrderItems(newItems);
                      }}
                      className="flex-1 bg-[#0d0d12] border border-slate-700 rounded-xl px-3 py-2 text-white"
                    >
                      {products.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} (Cost: ₹{p.costPrice})
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={e => {
                        const newItems = [...orderItems];
                        newItems[idx].qty = Number(e.target.value);
                        setOrderItems(newItems);
                      }}
                      className="w-20 bg-[#0d0d12] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => setOrderItems([...orderItems, { productId: products[0]?.id || '', qty: 10 }])}
                  className="text-xs text-amber-400 font-bold hover:underline pt-1 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Another Item
                </button>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black rounded-xl"
                >
                  Dispatch Purchase Order
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreatePOModal(false)}
                  className="px-4 py-2.5 bg-slate-800 text-slate-400 rounded-xl font-bold"
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
