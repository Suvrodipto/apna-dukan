import type { InventoryItem, SmartPromotionOffer, SmartRestockOption } from './types';

export * from './types';

export function generateSmartOffers(products: InventoryItem[]): SmartPromotionOffer[] {
  const offers: SmartPromotionOffer[] = [];

  products.forEach(p => {
    if (p.stockQty > p.minReorderQty * 2) {
      offers.push({
        id: `off-${p.id}`,
        productId: p.id,
        productName: p.name,
        reason: 'Overstocked',
        title: `🔥 Slow-moving ${p.name} detected!`,
        description: `Buy 2 ${p.name} & Get ₹10 Off to boost stock turn rate`,
        discountBadge: 'BUY 2 GET ₹10 OFF',
        suggestedDiscount: 10
      });
    }
  });

  return offers;
}

export function compareSupplierRestockRates(productId: string): SmartRestockOption[] {
  return [
    {
      supplierId: 'supp-express',
      supplierName: 'Metro Express Wholesale',
      deliveryTime: '2 Hours (Express)',
      unitPrice: 24,
      minimumOrderQty: 20,
      rating: 4.9,
      badge: '⚡ FASTEST'
    },
    {
      supplierId: 'supp-mandi',
      supplierName: 'City Mandi Traders',
      deliveryTime: 'Tomorrow Morning',
      unitPrice: 22,
      minimumOrderQty: 50,
      rating: 4.7,
      badge: '💰 LOWEST COST'
    }
  ];
}
