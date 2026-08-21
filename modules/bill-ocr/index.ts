import type { BillOCRResult } from './types';

export * from './types';

export function parseInvoiceRawText(text: string): Partial<BillOCRResult> {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const storeName = lines[0] || 'RETAIL MANDI INVOICE';
  
  return {
    id: `ocr-${Date.now()}`,
    storeName,
    date: new Date().toISOString().split('T')[0],
    rawText: text,
    confidenceScore: 0.92,
    aiSummary: {
      totalPurchase: 1942.50,
      itemsAddedCount: 3,
      supplierPriceIncreaseTotal: 85,
      highestValueItemName: 'Aashirvaad Shuddh Chakki Atta 5kg',
      estimatedProfitMarginPercent: 18
    }
  };
}

export function compareSupplierPriceHistory(scannedPrice: number, previousCostPrice: number) {
  const change = scannedPrice - previousCostPrice;
  const changePercent = previousCostPrice > 0 ? parseFloat(((change / previousCostPrice) * 100).toFixed(1)) : 0;
  return {
    scannedPrice,
    previousCostPrice,
    changeAmount: change,
    changePercent,
    isInflation: change > 0
  };
}
