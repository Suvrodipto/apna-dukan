export type UserRole = 'owner' | 'cashier' | 'supplier';

export interface Product {
  id: string;
  name: string;
  category: string;
  barcode: string;
  costPrice: number;
  sellingPrice: number;
  stockQty: number;
  minReorderQty: number;
  unit: string;
  image?: string;
  lastUpdated: string;
  recommendedPrice?: number;
  projectedProfitMargin?: number;
  salesVelocity?: number; // Sales per week
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address?: string;
  currentBalance: number; // Positive = customer owes shop (Udhaar), Negative = shop owes customer (Jama)
  creditLimit: number;
  riskScore: 'Low' | 'Medium' | 'High';
  lastTransactionDate: string;
  isVIP?: boolean;
  totalPurchases?: number;
  loyaltyTier?: 'Standard' | 'VIP Gold' | 'Platinum';
}

export interface LedgerEntry {
  id: string;
  customerId: string;
  customerName: string;
  date: string;
  type: 'udhaar' | 'jama'; // udhaar = credit given, jama = payment received
  amount: number;
  note: string;
  billId?: string;
  paymentMode?: 'Cash' | 'UPI' | 'Bank Transfer' | 'Other';
  syncStatus: 'synced' | 'pending' | 'conflict';
}

export interface CartItem {
  product: Product;
  quantity: number;
  discountPct: number;
}

export interface Bill {
  id: string;
  billNumber: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMode: 'Cash' | 'UPI' | 'Khata' | 'Card';
  customerId?: string;
  customerName?: string;
  cashierName: string;
  syncStatus: 'synced' | 'pending';
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  category: string;
  address: string;
  rating: number;
  reliabilityScore?: number;
  deliveryTimeDays?: number;
  priceCompetitiveness?: 'Best' | 'Good' | 'Average';
  fulfillmentRatePercent?: number;
  isAIRecommended?: boolean;
}

export interface PurchaseOrderItem {
  productId: string;
  productName: string;
  orderQty: number;
  unitPrice: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  dateCreated: string;
  expectedDelivery: string;
  items: PurchaseOrderItem[];
  totalAmount: number;
  status: 'Draft' | 'Sent' | 'In-Transit' | 'Fulfilled' | 'Cancelled';
  notes?: string;
  syncStatus: 'synced' | 'pending';
}

export interface OCRLineItem {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  confidence: number;
}

export interface OCRResult {
  id: string;
  storeName: string;
  date: string;
  billNumber: string;
  lineItems: OCRLineItem[];
  calculatedSubtotal: number;
  tax: number;
  grandTotal: number;
  rawText: string;
  confidenceScore: number;
  imageUrl?: string;
}

export interface SyncMutation {
  id: string;
  entityType: 'ledger' | 'inventory' | 'bill' | 'po';
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  payload: any;
  timestamp: string;
  status: 'queued' | 'syncing' | 'synced' | 'conflict';
  conflictDetails?: {
    localVersion: any;
    remoteVersion: any;
  };
}

export interface TradableAsset {
  id: string;
  name: string;
  tagline: string;
  category: 'Sync' | 'OCR' | 'Ledger' | 'Analytics' | 'Workflow' | 'AI';
  targetDomains: string[];
  description: string;
  demoVideoDuration: string;
  features: string[];
  integrationCodeSnippet: string;
  isLocked: boolean;
  githubModuleUrl?: string;
}

export interface SmartOffer {
  id: string;
  productId: string;
  productName: string;
  reason: 'Slow-Moving' | 'Overstocked' | 'Seasonal' | 'Expiring Soon';
  title: string;
  description: string;
  discountBadge: string;
  bundleProductIds?: string[];
  bundleNames?: string[];
  suggestedDiscount: number;
}

export interface RestockOption {
  supplierId: string;
  supplierName: string;
  deliveryTime: string;
  unitPrice: number;
  minimumOrderQty: number;
  rating: number;
  badge?: string;
}

export interface PitchStep {
  stepIndex: number;
  title: string;
  description: string;
  iconName: string;
  highlightMetric?: string;
  actionText?: string;
}

export interface PricePrediction {
  productId: string;
  productName: string;
  currentPrice: number;
  costPrice: number;
  recommendedPrice: number;
  projectedProfitIncrease: number;
  elasticityScore: number; // 0-1
  reasoning: string;
}

export interface WorkerProfile {
  id: string;
  workerId: string; // e.g. EMP-101
  name: string;
  phone: string;
  address: string;
  designation: 'Cashier' | 'Store Helper' | 'Store Manager' | 'Delivery Executive' | 'Accountant';
  joiningDate: string;
  monthlySalary: number;
  status: 'Active' | 'Inactive';
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalaryRecord {
  id: string;
  workerId: string;
  workerName: string;
  month: string; // e.g. "August"
  year: number; // e.g. 2026
  baseSalary: number;
  festivalBonus: number;
  otherBonus: number;
  deductions: number;
  totalPayable: number;
  paymentStatus: 'Paid' | 'Pending';
  paymentDate?: string;
  paymentMode?: 'Cash' | 'UPI' | 'Bank Transfer';
}

export interface FestivalItem {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  month: number; // 1-12
  day: number;
  year: number;
  description: string;
  isActive: boolean;
  bonusEnabled: boolean;
  bonusType: 'Fixed' | 'Percentage';
  bonusValue: number; // e.g. 10 (%) or 2000 (Fixed ₹)
  eligibilityType: 'All' | 'Selected';
  eligibleWorkerIds?: string[];
  emoji?: string;
}

export interface WorkerBonusRecord {
  id: string;
  workerId: string;
  workerName: string;
  festivalId: string;
  festivalName: string;
  bonusAmount: number;
  year: number;
  paymentStatus: 'Pending' | 'Paid';
  createdAt: string;
}

export interface WorkerNotification {
  id: string;
  title: string;
  message: string;
  notificationType: 'Normal' | 'Warning' | 'Urgent' | 'Today';
  relatedFestivalId?: string;
  scheduledDate: string;
  daysRemaining: number;
  estimatedBonusPayout: number;
  isRead: boolean;
}
