export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  barcode: string;
  costPrice: number;
  sellingPrice: number;
  stockQty: number;
  minReorderQty: number;
  unit: string;
  lastUpdated: string;
}

export interface SmartRestockOption {
  supplierId: string;
  supplierName: string;
  deliveryTime: string;
  unitPrice: number;
  minimumOrderQty: number;
  rating: number;
  badge?: string;
}

export interface SmartPromotionOffer {
  id: string;
  productId: string;
  productName: string;
  reason: 'Slow-Moving' | 'Overstocked' | 'Seasonal' | 'Expiring Soon';
  title: string;
  description: string;
  discountBadge: string;
  suggestedDiscount: number;
}
