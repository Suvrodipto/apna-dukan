import React from 'react';
import type { CartItem, Product } from '../../types';
import { Plus, Lightbulb } from 'lucide-react';

interface SmartCrossSellBannerProps {
  cart: CartItem[];
  allProducts: Product[];
  onAddToCart: (product: Product) => void;
}

export const SmartCrossSellBanner: React.FC<SmartCrossSellBannerProps> = ({
  cart,
  allProducts,
  onAddToCart
}) => {
  if (cart.length === 0) return null;

  // Check cart contents to recommend complimentary items
  const cartProductNames = cart.map(item => item.product.name.toLowerCase());
  const cartProductIds = cart.map(item => item.product.id);

  // Find complementary items not yet in cart
  const suggestions: Product[] = [];

  if (cartProductNames.some(n => n.includes('milk') || n.includes('butter'))) {
    const bread = allProducts.find(p => !cartProductIds.includes(p.id) && (p.name.toLowerCase().includes('bread') || p.category === 'Bakery'));
    if (bread) suggestions.push(bread);
  }

  if (cartProductNames.some(n => n.includes('tea') || n.includes('chai'))) {
    const sugar = allProducts.find(p => !cartProductIds.includes(p.id) && (p.name.toLowerCase().includes('sugar') || p.name.toLowerCase().includes('biscuit')));
    if (sugar) suggestions.push(sugar);
  }

  if (cartProductNames.some(n => n.includes('atta') || n.includes('flour'))) {
    const oil = allProducts.find(p => !cartProductIds.includes(p.id) && (p.name.toLowerCase().includes('oil') || p.category === 'Staples'));
    if (oil) suggestions.push(oil);
  }

  // Fallback random item if no match
  if (suggestions.length === 0 && allProducts.length > 0) {
    const unadded = allProducts.find(p => !cartProductIds.includes(p.id));
    if (unadded) suggestions.push(unadded);
  }

  if (suggestions.length === 0) return null;

  return (
    <div className="p-3 bg-[#181824] border border-amber-500/30 rounded-2xl space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-bold text-amber-400 text-[11px]">
          <Lightbulb className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>AI Cross-Sell Recommendations</span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">+18% Basket Size</span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {suggestions.slice(0, 2).map(product => (
          <div
            key={product.id}
            onClick={() => onAddToCart(product)}
            className="flex-1 bg-[#121218] hover:bg-[#20202c] border border-slate-800 rounded-xl p-2 flex items-center justify-between cursor-pointer transition-all group"
          >
            <div>
              <div className="font-bold text-white text-[11px] truncate group-hover:text-amber-400">{product.name}</div>
              <div className="text-[10px] text-slate-400 font-mono">₹{product.sellingPrice}</div>
            </div>
            <div className="p-1 rounded-lg bg-amber-500 text-slate-950 font-bold group-hover:scale-110 transition-transform">
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
