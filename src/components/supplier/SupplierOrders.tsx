import React, { useState, useEffect } from 'react';
import type { Supplier, PurchaseOrder, Product, UserRole } from '../../types';
import { pouchStore } from '../../db/pouchStore';
import { 
  Truck, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Star, 
  Phone, 
  Mail, 
  X
} from 'lucide-react';

interface SupplierOrdersProps {
  role: UserRole;
}

export const SupplierOrders: React.FC<SupplierOrdersProps> = ({ role: _role }) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Truck className="w-6 h-6 text-blue-400" />
            Supplier Purchase Order Workflow
          </h2>
          <p className="text-xs text-slate-400">Automated restock triggers, vendor directory, and shipment tracking</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 flex flex-col space-y-4">
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Wholesale Vendor Directory</h3>
            <div className="space-y-2">
              {suppliers.map(supp => (
                <div key={supp.id} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex items-start justify-between">
                    <h4 className="font-bold text-white text-xs">{supp.name}</h4>
                    <span className="flex items-center gap-0.5 text-amber-400 font-bold text-[10px]">
                      <Star className="w-3 h-3 fill-current" />
                      {supp.rating}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{supp.category}</p>
                  <div className="text-[10px] text-slate-500 space-y-0.5 pt-1 border-t border-slate-900">
                    <div className="flex items-center gap-1"><Phone className="w-3 h-3 text-blue-400" /> {supp.phone} ({supp.contactPerson})</div>
                    <div className="flex items-center gap-1"><Mail className="w-3 h-3 text-blue-400" /> {supp.email}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Active Purchase Orders Log</h3>

          {purchaseOrders.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
              No purchase orders created yet.
            </div>
          ) : (
            <div className="space-y-3">
              {purchaseOrders.map(po => (
                <div key={po.id} className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-3">
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
                      <div className="text-base font-black text-emerald-400 font-mono">₹{po.totalAmount}</div>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    {po.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-slate-300">
                        <span>{item.productName} (x{item.orderQty})</span>
                        <span className="font-mono text-slate-400">₹{item.unitPrice * item.orderQty}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <span className="text-[11px] text-slate-400">
                      Expected Delivery: <strong className="text-slate-200">{po.expectedDelivery}</strong>
                    </span>

                    <div className="flex items-center gap-2">
                      {po.status === 'Sent' && (
                        <button
                          onClick={() => updatePOStatus(po, 'In-Transit')}
                          className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg"
                        >
                          Mark In-Transit
                        </button>
                      )}

                      {po.status === 'In-Transit' && (
                        <button
                          onClick={() => updatePOStatus(po, 'Fulfilled')}
                          className="px-3 py-1 bg-emerald-600 text-slate-950 text-xs font-extrabold rounded-lg flex items-center gap-1"
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
      </div>

      {showCreatePOModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Generate New Purchase Order</h3>
              <button onClick={() => setShowCreatePOModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePO} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Select Supplier</label>
                <select
                  value={selectedSupplierId}
                  onChange={e => setSelectedSupplierId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Order Items & Restock Quantities</label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {orderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <select
                        value={item.productId}
                        onChange={e => {
                          const val = e.target.value;
                          setOrderItems(prev => prev.map((it, i) => i === idx ? { ...it, productId: val } : it));
                        }}
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white"
                      >
                        {products.map(p => (
                          <option key={p.id} value={p.id}>{p.name} (Stock: {p.stockQty})</option>
                        ))}
                      </select>

                      <input
                        type="number"
                        value={item.qty}
                        onChange={e => {
                          const qty = parseInt(e.target.value) || 1;
                          setOrderItems(prev => prev.map((it, i) => i === idx ? { ...it, qty } : it));
                        }}
                        className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white font-mono"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl"
                >
                  Dispatch Purchase Order
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreatePOModal(false)}
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
