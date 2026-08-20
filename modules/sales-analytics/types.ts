export interface SalesPricePrediction {
  productId: string;
  productName: string;
  currentPrice: number;
  costPrice: number;
  recommendedPrice: number;
  projectedProfitIncrease: number;
  elasticityScore: number;
  reasoning: string;
}

export interface SalesMetrics {
  totalRevenue: number;
  totalBills: number;
  averageOrderValue: number;
  topSellingCategory: string;
}
