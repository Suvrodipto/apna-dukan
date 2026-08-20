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
    confidenceScore: 0.92
  };
}
