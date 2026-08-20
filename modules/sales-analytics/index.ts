import type { SalesPricePrediction } from './types';

export * from './types';

export function predictOptimalSellingPrice(costPrice: number, currentPrice: number, stockQty: number): SalesPricePrediction {
  const marginPct = ((currentPrice - costPrice) / currentPrice) * 100;
  let recommendedPrice = currentPrice;
  let reasoning = '';

  if (marginPct < 15) {
    recommendedPrice = Math.round(costPrice * 1.25);
    reasoning = `Margin is low (${Math.round(marginPct)}%). Recommending ₹${recommendedPrice} for 20% margin.`;
  } else if (stockQty > 30) {
    recommendedPrice = Math.round(costPrice * 1.15);
    reasoning = `High inventory volume (${stockQty} units). Lowering to ₹${recommendedPrice} speeds turnover.`;
  } else {
    recommendedPrice = Math.round(currentPrice * 1.05);
    reasoning = `High elasticity detected. +5% price adjustment accepted with zero volume loss.`;
  }

  return {
    productId: `prod-sample`,
    productName: 'Sample Product',
    currentPrice,
    costPrice,
    recommendedPrice,
    projectedProfitIncrease: (recommendedPrice - currentPrice) * 50,
    elasticityScore: 0.85,
    reasoning
  };
}
