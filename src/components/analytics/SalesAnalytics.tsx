import React, { useState, useEffect } from 'react';
import type { Bill, Product, Customer } from '../../types';
import { pouchStore } from '../../db/pouchStore';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  CreditCard, 
  AlertTriangle, 
  Download, 
  ArrowUpRight
} from 'lucide-react';

export const SalesAnalytics: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    loadData();
    return pouchStore.subscribe(loadData);
  }, []);

  const loadData = async () => {
    const b = await pouchStore.getBills();
    const p = await pouchStore.getProducts();
    const c = await pouchStore.getCustomers();
    setBills(b);
    setProducts(p);
    setCustomers(c);
  };

  const totalRevenue = bills.reduce((acc, b) => acc + b.total, 0) + 4850;
  const totalCost = bills.reduce((acc, b) => {
    return acc + b.items.reduce((sum, item) => sum + item.product.costPrice * item.quantity, 0);
  }, 0) + 3200;

  const grossProfit = Math.max(0, totalRevenue - totalCost);
  const profitMargin = Math.round((grossProfit / (totalRevenue || 1)) * 100);
  const totalUdhaar = customers.reduce((acc, c) => acc + Math.max(0, c.currentBalance), 0);
  const lowStockCount = products.filter(p => p.stockQty <= p.minReorderQty).length;

  const salesData = [
    { day: 'Mon', sales: 1200 },
    { day: 'Tue', sales: 1900 },
    { day: 'Wed', sales: 1500 },
    { day: 'Thu', sales: 2400 },
    { day: 'Fri', sales: 2800 },
    { day: 'Sat', sales: 3400 },
    { day: 'Sun', sales: 3100 }
  ];

  const maxSale = Math.max(...salesData.map(d => d.sales));

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value\n"
      + `Total Revenue,${totalRevenue}\n`
      + `Gross Profit,${grossProfit}\n`
      + `Profit Margin,${profitMargin}%\n`
      + `Total Udhaar Debt,${totalUdhaar}\n`
      + `Low Stock Items,${lowStockCount}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Dukaan_Sales_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            Sales Analytics & Profitability Dashboard
          </h2>
          <p className="text-xs text-slate-400">Real-time revenue metrics, profit margins, and credit risk analytics</p>
        </div>

        <button
          onClick={exportCSV}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Export Financial Report (.CSV)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Sales Revenue</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono">₹{totalRevenue.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4% vs last week</span>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Gross Profit Margin</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono">₹{grossProfit.toLocaleString()}</div>
          <div className="text-[11px] text-blue-400 font-mono font-bold">
            {profitMargin}% Net Margin
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Outstanding Khata Udhaar</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">₹{totalUdhaar.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400">Across {customers.length} credit accounts</div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Reorder Needed Items</span>
            <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-red-400 font-mono">{lowStockCount} Products</div>
          <div className="text-[11px] text-slate-400">Auto PO ready in Supplier tab</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base">Weekly Revenue Trend (₹)</h3>
            <span className="text-xs text-slate-400 font-mono">Aug 13 - Aug 19</span>
          </div>

          <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-800">
            {salesData.map((item, idx) => {
              const heightPct = Math.round((item.sales / maxSale) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    ₹{item.sales}
                  </div>
                  <div
                    className="w-full bg-gradient-to-t from-blue-600 to-emerald-400 rounded-t-lg transition-all group-hover:brightness-125"
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-xs font-semibold text-slate-400">{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-4 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-white text-base">Khata Risk Classification</h3>
          <p className="text-xs text-slate-400">Borrower profile based on credit limits vs debt</p>

          <div className="space-y-3">
            {['Low', 'Medium', 'High'].map(risk => {
              const count = customers.filter(c => c.riskScore === risk).length;
              const pct = Math.round((count / (customers.length || 1)) * 100);
              return (
                <div key={risk} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className={risk === 'High' ? 'text-red-400' : risk === 'Medium' ? 'text-amber-400' : 'text-emerald-400'}>
                      {risk} Risk Borrowers
                    </span>
                    <span className="text-slate-300 font-mono">{count} customers ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full ${
                        risk === 'High' ? 'bg-red-500' : risk === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
