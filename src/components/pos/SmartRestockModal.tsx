import React, { useState } from 'react';
import type { Product, RestockOption } from '../../types';
import { pouchStore } from '../../db/pouchStore';
import { 
  Zap, 
  Truck, 
  Clock, 
  CheckCircle2, 
  X, 
  ShieldCheck,
  Star
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SmartRestockModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onOrderDispatched?: (supplierName: string, qty: number) => void;
}

export const SmartRestockModal: React.FC<SmartRestockModalProps> = ({
  isOpen,
  onClose,
  product,
  onOrderDispatched
}) => {
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('sup-a');
  const [orderQty, setOrderQty] = useState<number>(50);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [poNumber, setPoNumber] = useState('');

  if (!isOpen || !product) return null;

  // Mock Supplier Restock Options
  const restockOptions: RestockOption[] = [
    {
      supplierId: 'sup-a',
      supplierName: 'Supplier A — City Express Mandi',
      deliveryTime: 'Delivery in 2 hours',
      unitPrice: Math.round(product.costPrice * 0.95),
      minimumOrderQty: 20,
      rating: 4.9,
      badge: '⚡ FASTEST DELIVERY'
    },
    {
      supplierId: 'sup-b',
      supplierName: 'Supplier B — Metro Wholesale Hub',
      deliveryTime: 'Delivery tomorrow (9 AM)',
      unitPrice: Math.round(product.costPrice * 0.88),
      minimumOrderQty: 50,
      rating: 4.7,
      badge: '💰 LOWEST PRICE'
    }
  ];

  const selectedSupplier = restockOptions.find(s => s.supplierId === selectedSupplierId) || restockOptions[0];
  const totalCost = selectedSupplier.unitPrice * orderQty;

  const handleDispatchOrder = async () => {
    setIsSubmitting(true);

    const generatedPo = `PO-${Math.floor(100000 + Math.random() * 900000)}`;
    setPoNumber(generatedPo);

    // Save PO to database
    await pouchStore.savePurchaseOrder({
      id: `po-${Date.now()}`,
      poNumber: generatedPo,
      supplierId: selectedSupplier.supplierId,
      supplierName: selectedSupplier.supplierName,
      dateCreated: new Date().toISOString().split('T')[0],
      expectedDelivery: selectedSupplier.deliveryTime.includes('2 hours') ? 'Today' : 'Tomorrow',
      items: [
        {
          productId: product.id,
          productName: product.name,
          orderQty,
          unitPrice: selectedSupplier.unitPrice
        }
      ],
      totalAmount: totalCost,
      status: 'Sent',
      syncStatus: 'synced'
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setOrderSuccess(true);

      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 }
      });

      if (onOrderDispatched) {
        onOrderDispatched(selectedSupplier.supplierName, orderQty);
      }

      setTimeout(() => {
        setOrderSuccess(false);
        onClose();
      }, 2000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="glass-panel w-full max-w-lg bg-[#121218] border border-amber-500/30 rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200 text-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-500 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                EMERGENCY SMART RESTOCK
                <span className="px-2 py-0.5 text-[9px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">AI Live</span>
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">Instant Supplier Comparison & Restock Dispatch</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {orderSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-black text-white">RESTOCK PURCHASE ORDER SENT!</h3>
            <p className="text-xs text-slate-300 font-mono">PO #{poNumber} • {selectedSupplier.supplierName}</p>
            <div className="text-[11px] text-amber-400 font-semibold">
              Dispatched {orderQty} {product.unit} of {product.name} (Est. {selectedSupplier.deliveryTime})
            </div>
          </div>
        ) : (
          <>
            {/* Out of Stock Warning Banner */}
            <div className="p-3 bg-[#181824] border border-amber-500/30 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Target Product</span>
                <span className="font-bold text-white text-sm">{product.name}</span>
                <span className="text-slate-400 text-[11px] block">Current Stock: <strong className="text-rose-400">{product.stockQty} {product.unit}</strong> (Min Reorder: {product.minReorderQty})</span>
              </div>
              <div className="px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl font-mono text-xs font-bold">
                Low / Stock Out
              </div>
            </div>

            {/* Supplier Comparison Cards */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Select Nearby Supplier (AI Real-time Rate Comparison)
              </label>

              <div className="space-y-2">
                {restockOptions.map(opt => {
                  const isSelected = selectedSupplierId === opt.supplierId;

                  return (
                    <div
                      key={opt.supplierId}
                      onClick={() => setSelectedSupplierId(opt.supplierId)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500/80 shadow-lg shadow-amber-500/10 scale-[1.01]'
                          : 'bg-[#181824] border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-white text-xs">{opt.supplierName}</span>
                          {opt.badge && (
                            <span className={`px-2 py-0.2 text-[9px] font-black rounded ${
                              opt.badge.includes('FASTEST')
                                ? 'bg-amber-500 text-slate-950'
                                : 'bg-emerald-500 text-slate-950'
                            }`}>
                              {opt.badge}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1 font-semibold text-emerald-400">
                            <Clock className="w-3.5 h-3.5" />
                            {opt.deliveryTime}
                          </span>
                          <span className="flex items-center gap-0.5">
                            <Star className="w-3 h-3 text-amber-400 fill-current" />
                            {opt.rating}
                          </span>
                        </div>
                      </div>

                      <div className="text-right font-mono">
                        <div className="text-sm font-black text-amber-400">₹{opt.unitPrice} <span className="text-[10px] text-slate-400 font-sans">/ unit</span></div>
                        <div className="text-[10px] text-slate-500">Min Qty: {opt.minimumOrderQty}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="p-3 bg-[#181824] rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Order Quantity</label>
                <div className="flex items-center gap-2 mt-1">
                  {[20, 50, 100, 200].map(qty => (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => setOrderQty(qty)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                        orderQty === qty
                          ? 'bg-amber-500 text-slate-950 border-amber-400'
                          : 'bg-[#121218] border-slate-700 text-slate-300'
                      }`}
                    >
                      {qty}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-right font-mono">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total PO Cost</span>
                <span className="text-base font-black text-emerald-400">₹{totalCost.toLocaleString()}</span>
              </div>
            </div>

            {/* Restock Dispatch Button */}
            <button
              onClick={handleDispatchOrder}
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Truck className="w-4 h-4 fill-current" />
              <span>{isSubmitting ? 'Dispatching Purchase Order...' : `DISPATCH RESTOCK ORDER (₹${totalCost.toLocaleString()})`}</span>
            </button>

            <div className="text-center text-[10px] text-slate-500 flex items-center justify-center gap-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Direct API Supplier Dispatch • Instant PO Generation
            </div>
          </>
        )}
      </div>
    </div>
  );
};
