import type { Product, SmartOffer } from '../types';

export class AIPromotionService {
  private static instance: AIPromotionService;

  private constructor() {}

  public static getInstance(): AIPromotionService {
    if (!AIPromotionService.instance) {
      AIPromotionService.instance = new AIPromotionService();
    }
    return AIPromotionService.instance;
  }

  // Analyzes shop inventory to find slow-moving / overstocked items and generates promotional offers
  public generateInventoryOffers(products: Product[]): SmartOffer[] {
    const offers: SmartOffer[] = [];

    // 1. Slow-moving items (stockQty > minReorderQty * 3)
    const overstocked = products.filter(p => p.stockQty >= p.minReorderQty * 2.5);

    overstocked.forEach(item => {
      if (item.category === 'Bakery' || item.name.toLowerCase().includes('biscuits') || item.name.toLowerCase().includes('bread')) {
        offers.push({
          id: `offer-${item.id}-1`,
          productId: item.id,
          productName: item.name,
          reason: 'Slow-Moving',
          title: `🔥 Slow-moving stock detected: ${item.name}`,
          description: `You have ${item.stockQty} ${item.unit} in stock. AI recommends: Buy 2 Get ₹10 Off!`,
          discountBadge: 'Buy 2 Get ₹10 Off',
          suggestedDiscount: 10
        });
      } else if (item.category === 'Dairy' || item.name.toLowerCase().includes('milk')) {
        offers.push({
          id: `offer-${item.id}-2`,
          productId: item.id,
          productName: item.name,
          reason: 'Expiring Soon',
          title: `🥛 Smart Combo: ${item.name} + Bread Bundle`,
          description: `Combine ${item.name} with Fresh Bread for 15% higher basket conversion rate.`,
          discountBadge: '15% Combo Discount',
          bundleProductIds: [item.id, 'prod-3'],
          bundleNames: [item.name, 'Atta Whole Wheat / Bread'],
          suggestedDiscount: 15
        });
      } else {
        offers.push({
          id: `offer-${item.id}-3`,
          productId: item.id,
          productName: item.name,
          reason: 'Overstocked',
          title: `⚡ High Inventory Alert: ${item.name}`,
          description: `${item.stockQty} units available. Run instant weekend sale to unlock ₹${Math.round(item.stockQty * item.sellingPrice * 0.8)} cash flow.`,
          discountBadge: '10% Cash Flow Discount',
          suggestedDiscount: 10
        });
      }
    });

    // Fallback default offers if inventory is balanced
    if (offers.length === 0 && products.length > 0) {
      const first = products[0];
      offers.push({
        id: `offer-fallback-1`,
        productId: first.id,
        productName: first.name,
        reason: 'Slow-Moving',
        title: `🔥 Recommended Offer: ${first.name}`,
        description: `Boost sales with a Buy 2 Get ₹10 Off instant promo.`,
        discountBadge: 'Buy 2 Get ₹10 Off',
        suggestedDiscount: 10
      });
    }

    return offers;
  }
}

export const aiPromotionService = AIPromotionService.getInstance();
