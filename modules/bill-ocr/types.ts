export interface ParsedOCRLineItem {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  confidence: number;
}

export interface BillOCRResult {
  id: string;
  storeName: string;
  date: string;
  billNumber: string;
  lineItems: ParsedOCRLineItem[];
  calculatedSubtotal: number;
  tax: number;
  grandTotal: number;
  rawText: string;
  confidenceScore: number;
}
