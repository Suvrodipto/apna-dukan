export interface ProductPriceItem {
  id: string;
  name: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  stockQty: number;
  minReorderQty: number;
}

export interface PricePredictionResult {
  productId: string;
  productName: string;
  currentPrice: number;
  costPrice: number;
  recommendedPrice: number;
  projectedProfitIncrease: number;
  elasticityScore: number;
  marginPercent: number;
  reasoning: string;
}

export interface ElasticityConfig {
  aggressivenessFactor?: number; // Default 1.2
  minGrossMarginPercent?: number; // Default 15%
}
