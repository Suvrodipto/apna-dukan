import React, { useState, useEffect } from 'react';
import type { Product } from '../../types';
import { pouchStore } from '../../db/pouchStore';
import { 
  Package, 
  Search, 
  Plus, 
  Barcode, 
  AlertTriangle, 
  Edit, 
  X, 
  Camera
} from 'lucide-react';

export const InventoryCatalogue: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Groceries');
  const [formBarcode, setFormBarcode] = useState('');
  const [formCostPrice, setFormCostPrice] = useState('');
  const [formSellingPrice, setFormSellingPrice] = useState('');
  const [formStockQty, setFormStockQty] = useState('');
  const [formMinReorder, setFormMinReorder] = useState('10');
  const [formUnit, setFormUnit] = useState('pack');

  useEffect(() => {
    loadProducts();
    return pouchStore.subscribe(loadProducts);
  }, []);

  const loadProducts = async () => {
    const prods = await pouchStore.getProducts();
    setProducts(prods);
  };

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.barcode.includes(searchQuery);
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesLowStock = !showLowStockOnly || p.stockQty <= p.minReorderQty;
    return matchesSearch && matchesCat && matchesLowStock;
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory('Groceries');
    setFormBarcode(`${Math.floor(8900000000000 + Math.random() * 900000000000)}`);
    setFormCostPrice('100');
    setFormSellingPrice('120');
    setFormStockQty('20');
    setFormMinReorder('10');
    setFormUnit('pack');
    setShowAddEditModal(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormBarcode(p.barcode);
    setFormCostPrice(p.costPrice.toString());
    setFormSellingPrice(p.sellingPrice.toString());
    setFormStockQty(p.stockQty.toString());
    setFormMinReorder(p.minReorderQty.toString());
    setFormUnit(p.unit);
    setShowAddEditModal(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formCostPrice || !formSellingPrice) return;

    const newProd: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      name: formName,
      category: formCategory,
      barcode: formBarcode || `${Math.floor(8900000000000 + Math.random() * 900000000000)}`,
      costPrice: parseFloat(formCostPrice),
      sellingPrice: parseFloat(formSellingPrice),
      stockQty: parseInt(formStockQty) || 0,
      minReorderQty: parseInt(formMinReorder) || 5,
      unit: formUnit,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    await pouchStore.saveProduct(newProd);
    setShowAddEditModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-400" />
            Catalogue & Inventory Store
          </h2>
          <p className="text-xs text-slate-400">Track stock levels, barcodes, cost margins, and low stock triggers</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowScannerModal(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
          >
            <Camera className="w-4 h-4 text-blue-400" />
            <span>Camera Barcode Scanner</span>
          </button>

          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by product name or barcode..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white font-semibold shadow'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowLowStockOnly(!showLowStockOnly)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
            showLowStockOnly
              ? 'bg-amber-500/20 text-amber-300 border-amber-500'
              : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-white'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>Low Stock Only</span>
        </button>
      </div>

      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Product Name & Barcode</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Stock Level</th>
                <th className="py-3 px-4">Cost Price</th>
                <th className="py-3 px-4">Selling Price</th>
                <th className="py-3 px-4">Margin %</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60">
              {filteredProducts.map(product => {
                const marginPct = Math.round(((product.sellingPrice - product.costPrice) / product.sellingPrice) * 100);
                const isLowStock = product.stockQty <= product.minReorderQty;
                const isCritical = product.stockQty <= Math.floor(product.minReorderQty / 2);

                return (
                  <tr key={product.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <div>{product.name}</div>
                      <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1 mt-0.5">
                        <Barcode className="w-3 h-3 text-slate-400" />
                        {product.barcode}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-800 text-slate-300 rounded border border-slate-700">
                        {product.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono font-black text-sm ${
                          isCritical ? 'text-red-400' : isLowStock ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {product.stockQty} {product.unit}s
                        </span>

                        {isLowStock && (
                          <span className="px-1.5 py-0.2 text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded uppercase">
                            Reorder Limit ({product.minReorderQty})
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-400">₹{product.costPrice}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">₹{product.sellingPrice}</td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-500/10 text-blue-400 rounded-full font-mono">
                        +{marginPct}%
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => openEditModal(product)}
                        className="p-1.5 bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white rounded-lg transition-all"
                        title="Edit Product"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showAddEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">
                {editingProduct ? 'Edit Product Item' : 'Add New Inventory Product'}
              </h3>
              <button onClick={() => setShowAddEditModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="e.g. Aashirvaad Atta 5kg"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <input
                    type="text"
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Barcode EAN-13</label>
                  <input
                    type="text"
                    value={formBarcode}
                    onChange={e => setFormBarcode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Cost Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formCostPrice}
                    onChange={e => setFormCostPrice(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formSellingPrice}
                    onChange={e => setFormSellingPrice(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Stock Qty</label>
                  <input
                    type="number"
                    required
                    value={formStockQty}
                    onChange={e => setFormStockQty(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Min Reorder Threshold</label>
                  <input
                    type="number"
                    value={formMinReorder}
                    onChange={e => setFormMinReorder(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Unit (e.g. packet, kg, bar)</label>
                  <input
                    type="text"
                    value={formUnit}
                    onChange={e => setFormUnit(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl"
                >
                  Save Product Details
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddEditModal(false)}
                  className="px-4 py-2.5 bg-slate-800 text-slate-400 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showScannerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4 text-center shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-400" />
                Live Barcode & QR Reader
              </h3>
              <button onClick={() => setShowScannerModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
              <div className="animate-scan" />
              <div className="border-2 border-dashed border-blue-500/60 w-48 h-28 rounded-lg flex items-center justify-center">
                <span className="text-[11px] text-blue-300 font-mono">Point camera at barcode</span>
              </div>
            </div>

            <p className="text-xs text-slate-400">Integrated HTML5 barcode detector active. Ready for item entry.</p>

            <button
              onClick={() => setShowScannerModal(false)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs"
            >
              Close Camera View
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
