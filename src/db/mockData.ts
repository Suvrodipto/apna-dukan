import type { Product, Customer, LedgerEntry, Supplier, PurchaseOrder, OCRResult, TradableAsset, WorkerProfile, SalaryRecord, FestivalItem, WorkerNotification } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Aashirvaad Shuddh Chakki Atta 5kg',
    category: 'Groceries',
    barcode: '8901058000101',
    costPrice: 210,
    sellingPrice: 245,
    stockQty: 18,
    minReorderQty: 10,
    unit: 'bag',
    lastUpdated: '2026-08-19'
  },
  {
    id: 'prod-2',
    name: 'Fortune Sunlite Sunflower Oil 1L',
    category: 'Groceries',
    barcode: '8906007280014',
    costPrice: 125,
    sellingPrice: 145,
    stockQty: 8,
    minReorderQty: 15,
    unit: 'pouch',
    lastUpdated: '2026-08-19'
  },
  {
    id: 'prod-3',
    name: 'Tata Salt Vacuum Evaporated 1kg',
    category: 'Groceries',
    barcode: '8901058852106',
    costPrice: 22,
    sellingPrice: 28,
    stockQty: 45,
    minReorderQty: 20,
    unit: 'packet',
    lastUpdated: '2026-08-18'
  },
  {
    id: 'prod-4',
    name: 'Amul Taaza Toned Milk 500ml',
    category: 'Dairy',
    barcode: '8901262010052',
    costPrice: 26,
    sellingPrice: 28,
    stockQty: 4, // LOW STOCK
    minReorderQty: 12,
    unit: 'pouch',
    lastUpdated: '2026-08-19'
  },
  {
    id: 'prod-5',
    name: 'Amul Butter Pasteurised 100g',
    category: 'Dairy',
    barcode: '8901262010100',
    costPrice: 50,
    sellingPrice: 58,
    stockQty: 14,
    minReorderQty: 10,
    unit: 'pack',
    lastUpdated: '2026-08-19'
  },
  {
    id: 'prod-6',
    name: 'Surf Excel Easy Wash Detergent Powder 1kg',
    category: 'Personal & Home',
    barcode: '8901030612345',
    costPrice: 110,
    sellingPrice: 132,
    stockQty: 2, // CRITICAL LOW
    minReorderQty: 8,
    unit: 'pack',
    lastUpdated: '2026-08-17'
  },
  {
    id: 'prod-7',
    name: 'MDH Deggi Mirch Powder 100g',
    category: 'Spices',
    barcode: '8901594000012',
    costPrice: 72,
    sellingPrice: 88,
    stockQty: 25,
    minReorderQty: 10,
    unit: 'box',
    lastUpdated: '2026-08-18'
  },
  {
    id: 'prod-8',
    name: 'Cadbury Dairy Milk Silk 150g',
    category: 'Packaged Goods',
    barcode: '8901233020011',
    costPrice: 140,
    sellingPrice: 175,
    stockQty: 30,
    minReorderQty: 10,
    unit: 'bar',
    lastUpdated: '2026-08-19'
  },
  {
    id: 'prod-9',
    name: 'Organic Kashmiri Saffron (Kesar 5g)',
    category: 'Spices & Premium',
    barcode: '8908001234001',
    costPrice: 1600,
    sellingPrice: 1950,
    stockQty: 12,
    minReorderQty: 5,
    unit: 'box',
    lastUpdated: '2026-08-19'
  },
  {
    id: 'prod-10',
    name: 'Royal Dry Fruits Festive Gift Box 1kg',
    category: 'Dry Fruits & Hampers',
    barcode: '8908001234002',
    costPrice: 1850,
    sellingPrice: 2250,
    stockQty: 15,
    minReorderQty: 5,
    unit: 'box',
    lastUpdated: '2026-08-19'
  },
  {
    id: 'prod-11',
    name: 'Premium Desi Cow Ghee 5L Tin',
    category: 'Dairy & Ghee',
    barcode: '8901262090012',
    costPrice: 3200,
    sellingPrice: 3850,
    stockQty: 8,
    minReorderQty: 3,
    unit: 'tin',
    lastUpdated: '2026-08-19'
  },
  {
    id: 'prod-12',
    name: 'Daawat Rozana Super Basmati Rice 25kg Bag',
    category: 'Groceries',
    barcode: '8901594990018',
    costPrice: 2400,
    sellingPrice: 2850,
    stockQty: 10,
    minReorderQty: 4,
    unit: 'bag',
    lastUpdated: '2026-08-19'
  },
  {
    id: 'prod-13',
    name: 'Ferrero Rocher Premium Chocolate Box 24 Pcs',
    category: 'Packaged Goods',
    barcode: '8000500003008',
    costPrice: 850,
    sellingPrice: 1050,
    stockQty: 20,
    minReorderQty: 5,
    unit: 'box',
    lastUpdated: '2026-08-19'
  },
  {
    id: 'prod-14',
    name: 'Nescafe Gold Premium Blend Coffee 200g Jar',
    category: 'Beverages',
    barcode: '8901058200112',
    costPrice: 620,
    sellingPrice: 750,
    stockQty: 18,
    minReorderQty: 6,
    unit: 'jar',
    lastUpdated: '2026-08-19'
  },
  {
    id: 'prod-15',
    name: 'Everyday Premium Almonds (Badam) 1kg Pack',
    category: 'Dry Fruits & Hampers',
    barcode: '8908001234015',
    costPrice: 750,
    sellingPrice: 890,
    stockQty: 25,
    minReorderQty: 8,
    unit: 'pack',
    lastUpdated: '2026-08-19'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Ramesh Sharma',
    phone: '+91 98765 43210',
    address: 'Flat 302, Sai Residency, Main Road',
    currentBalance: 2000,
    creditLimit: 3000,
    riskScore: 'Low',
    lastTransactionDate: '2026-07-24',
    isVIP: true,
    loyaltyTier: 'VIP Gold'
  },
  {
    id: 'cust-2',
    name: 'Sunita Verma',
    phone: '+91 98123 67890',
    address: 'House No. 45, Green Park Society',
    currentBalance: 3430,
    creditLimit: 2500,
    riskScore: 'High',
    lastTransactionDate: '2026-08-15',
    isVIP: true,
    loyaltyTier: 'VIP Gold'
  },
  {
    id: 'cust-3',
    name: 'Amit Patel',
    phone: '+91 97234 56789',
    address: 'Shop 12, Market Complex',
    currentBalance: 0,
    creditLimit: 5000,
    riskScore: 'Low',
    lastTransactionDate: '2026-08-19'
  },
  {
    id: 'cust-4',
    name: 'Priya Sundaram',
    phone: '+91 99887 76655',
    address: 'B-14, Lakeview Apartments',
    currentBalance: 780,
    creditLimit: 2000,
    riskScore: 'Medium',
    lastTransactionDate: '2026-08-17'
  },
  {
    id: 'cust-5',
    name: 'Rajesh Gupta',
    phone: '+91 98345 11223',
    address: 'Station Mandi Gali #4',
    currentBalance: 1200,
    creditLimit: 4000,
    riskScore: 'Low',
    lastTransactionDate: '2026-08-18',
    isVIP: true,
    loyaltyTier: 'VIP Gold'
  },
  {
    id: 'cust-6',
    name: 'Vikram Malhotra',
    phone: '+91 91234 99887',
    address: 'Civil Lines, House 102',
    currentBalance: 0,
    creditLimit: 10000,
    riskScore: 'Low',
    lastTransactionDate: '2026-08-19',
    isVIP: true,
    loyaltyTier: 'VIP Gold'
  }
];

export const INITIAL_LEDGER: LedgerEntry[] = [
  {
    id: 'led-1',
    customerId: 'cust-1',
    customerName: 'Ramesh Sharma',
    date: '2026-08-18 17:30',
    type: 'udhaar',
    amount: 1450,
    note: 'Atta 5kg + Sunflower Oil 1L + Dairy Milk',
    syncStatus: 'synced'
  },
  {
    id: 'led-2',
    customerId: 'cust-2',
    customerName: 'Sunita Verma',
    date: '2026-08-15 11:15',
    type: 'udhaar',
    amount: 2200,
    note: 'Monthly ration purchase on credit',
    syncStatus: 'synced'
  },
  {
    id: 'led-3',
    customerId: 'cust-2',
    customerName: 'Sunita Verma',
    date: '2026-08-15 18:45',
    type: 'udhaar',
    amount: 1000,
    note: 'Surf Excel & Spices box',
    syncStatus: 'synced'
  },
  {
    id: 'led-4',
    customerId: 'cust-4',
    customerName: 'Priya Sundaram',
    date: '2026-08-17 19:20',
    type: 'udhaar',
    amount: 1280,
    note: 'Groceries credit',
    syncStatus: 'synced'
  },
  {
    id: 'led-5',
    customerId: 'cust-4',
    customerName: 'Priya Sundaram',
    date: '2026-08-18 10:00',
    type: 'jama',
    amount: 500,
    note: 'UPI Partial Payment Received',
    paymentMode: 'UPI',
    syncStatus: 'synced'
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'supp-1',
    name: 'Metro Wholesale Trading Co.',
    contactPerson: 'Vikram Singh',
    phone: '+91 98990 11223',
    email: 'orders@metrowholesale.in',
    category: 'FMCG & Groceries',
    address: 'Warehouse Block C, Transport Nagar',
    rating: 4.8
  },
  {
    id: 'supp-2',
    name: 'Amul Dairy Distributors Ltd.',
    contactPerson: 'Rajesh Mehta',
    phone: '+91 98450 33445',
    email: 'supply@amuldistributors.com',
    category: 'Dairy & Cold Storage',
    address: 'Plot 12, Industrial Area Phase 1',
    rating: 4.9
  },
  {
    id: 'supp-3',
    name: 'Hindustan Unilever Distribution',
    contactPerson: 'Suresh Kumar',
    phone: '+91 97112 55667',
    email: 'hul.retailer@hul.com',
    category: 'Home & Personal Care',
    address: 'Sector 4, Wholesale Mandi',
    rating: 4.7
  }
];

export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'po-101',
    poNumber: 'PO-2026-08-01',
    supplierId: 'supp-2',
    supplierName: 'Amul Dairy Distributors Ltd.',
    dateCreated: '2026-08-19 09:30',
    expectedDelivery: '2026-08-20',
    items: [
      { productId: 'prod-4', productName: 'Amul Taaza Toned Milk 500ml', orderQty: 40, unitPrice: 26 },
      { productId: 'prod-5', productName: 'Amul Butter Pasteurised 100g', orderQty: 20, unitPrice: 50 }
    ],
    totalAmount: 2040,
    status: 'Sent',
    notes: 'Please dispatch morning batch before 8:00 AM.',
    syncStatus: 'synced'
  },
  {
    id: 'po-102',
    poNumber: 'PO-2026-08-02',
    supplierId: 'supp-3',
    supplierName: 'Hindustan Unilever Distribution',
    dateCreated: '2026-08-19 14:15',
    expectedDelivery: '2026-08-21',
    items: [
      { productId: 'prod-6', productName: 'Surf Excel Easy Wash Detergent Powder 1kg', orderQty: 25, unitPrice: 110 }
    ],
    totalAmount: 2750,
    status: 'Draft',
    notes: 'Urgent restock due to high customer demand.',
    syncStatus: 'synced'
  }
];

export const SAMPLE_OCR_BILLS: OCRResult[] = [
  {
    id: 'sample-ocr-1',
    storeName: 'SHREE GANESH WHOLESALE MANDI',
    date: '2026-08-18',
    billNumber: 'INV-89421',
    calculatedSubtotal: 1850,
    tax: 92.50,
    grandTotal: 1942.50,
    confidenceScore: 0.94,
    rawText: `SHREE GANESH WHOLESALE MANDI
GSTIN: 27AAAAA0000A1Z5  DATE: 18-08-2026
INV NO: INV-89421

ITEMS:
1. Aashirvaad Shuddh Atta 5kg x 5  @ 210 = 1050.00
2. Fortune Sunlite Sunflower Oil 1L x 4 @ 125 = 500.00
3. Tata Salt Vacuum 1kg x 10 @ 22 = 220.00
------------------------------------------------
SUBTOTAL: 1850.00
GST (5%): 92.50
TOTAL: INR 1942.50
THANK YOU FOR SHOPPING!`,
    lineItems: [
      { name: 'Aashirvaad Shuddh Chakki Atta 5kg', quantity: 5, unitPrice: 210, totalPrice: 1050, confidence: 0.96 },
      { name: 'Fortune Sunlite Sunflower Oil 1L', quantity: 4, unitPrice: 125, totalPrice: 500, confidence: 0.95 },
      { name: 'Tata Salt Vacuum Evaporated 1kg', quantity: 10, unitPrice: 22, totalPrice: 220, confidence: 0.92 }
    ]
  },
  {
    id: 'sample-ocr-2',
    storeName: 'SUPER MART SUPERMARKET RECEIPT',
    date: '2026-08-19',
    billNumber: 'SM-2026-9031',
    calculatedSubtotal: 418,
    tax: 18,
    grandTotal: 436,
    confidenceScore: 0.91,
    rawText: `SUPER MART RETAIL PVT LTD
TAX INVOICE # SM-2026-9031
DATE: 19/08/2026

Amul Taaza Milk 500ml   Qty: 2  Rate: 28.00  Amt: 56.00
Amul Butter 100g        Qty: 1  Rate: 58.00  Amt: 58.00
Cadbury Silk 150g       Qty: 1  Rate: 175.00 Amt: 175.00
Surf Excel 1kg          Qty: 1  Rate: 132.00 Amt: 132.00
------------------------------------------------------
Subtotal: 418.00
CGST+SGST: 18.00
GRAND TOTAL: Rs 436.00`,
    lineItems: [
      { name: 'Amul Taaza Toned Milk 500ml', quantity: 2, unitPrice: 28, totalPrice: 56, confidence: 0.94 },
      { name: 'Amul Butter Pasteurised 100g', quantity: 1, unitPrice: 58, totalPrice: 58, confidence: 0.92 },
      { name: 'Cadbury Dairy Milk Silk 150g', quantity: 1, unitPrice: 175, totalPrice: 175, confidence: 0.89 },
      { name: 'Surf Excel Easy Wash Detergent Powder 1kg', quantity: 1, unitPrice: 132, totalPrice: 132, confidence: 0.90 }
    ]
  }
];

export const INITIAL_WORKERS: WorkerProfile[] = [
  {
    id: 'w-1',
    workerId: 'EMP-101',
    name: 'Rajesh Kumar Verma',
    phone: '+91 98765 11223',
    address: 'Qtr 42, Civil Lines, Main Mandi',
    designation: 'Cashier',
    joiningDate: '2024-03-15',
    monthlySalary: 18000,
    status: 'Active',
    createdAt: '2024-03-15',
    updatedAt: '2026-08-01'
  },
  {
    id: 'w-2',
    workerId: 'EMP-102',
    name: 'Manoj Singh Yadav',
    phone: '+91 98123 44556',
    address: 'Village Badarpur, Near Railway Crossing',
    designation: 'Store Helper',
    joiningDate: '2024-07-01',
    monthlySalary: 14000,
    status: 'Active',
    createdAt: '2024-07-01',
    updatedAt: '2026-08-01'
  },
  {
    id: 'w-3',
    workerId: 'EMP-103',
    name: 'Anjali Sharma',
    phone: '+91 99345 66778',
    address: 'Plot 18, Shanti Nagar',
    designation: 'Store Manager',
    joiningDate: '2023-11-10',
    monthlySalary: 25000,
    status: 'Active',
    createdAt: '2023-11-10',
    updatedAt: '2026-08-01'
  },
  {
    id: 'w-4',
    workerId: 'EMP-104',
    name: 'Suresh Chand Gupta',
    phone: '+91 97112 88990',
    address: 'House 88, Sector 12',
    designation: 'Delivery Executive',
    joiningDate: '2025-01-05',
    monthlySalary: 15000,
    status: 'Active',
    createdAt: '2025-01-05',
    updatedAt: '2026-08-01'
  }
];

export const INITIAL_SALARY_RECORDS: SalaryRecord[] = [
  {
    id: 'sal-1',
    workerId: 'w-1',
    workerName: 'Rajesh Kumar Verma',
    month: 'August',
    year: 2026,
    baseSalary: 18000,
    festivalBonus: 1800, // 10% Diwali Bonus
    otherBonus: 500,
    deductions: 0,
    totalPayable: 20300,
    paymentStatus: 'Pending'
  },
  {
    id: 'sal-2',
    workerId: 'w-2',
    workerName: 'Manoj Singh Yadav',
    month: 'August',
    year: 2026,
    baseSalary: 14000,
    festivalBonus: 1400,
    otherBonus: 300,
    deductions: 200,
    totalPayable: 15500,
    paymentStatus: 'Pending'
  },
  {
    id: 'sal-3',
    workerId: 'w-3',
    workerName: 'Anjali Sharma',
    month: 'August',
    year: 2026,
    baseSalary: 25000,
    festivalBonus: 2500,
    otherBonus: 1000,
    deductions: 0,
    totalPayable: 28500,
    paymentStatus: 'Paid',
    paymentDate: '2026-08-05',
    paymentMode: 'UPI'
  },
  {
    id: 'sal-4',
    workerId: 'w-4',
    workerName: 'Suresh Chand Gupta',
    month: 'August',
    year: 2026,
    baseSalary: 15000,
    festivalBonus: 1500,
    otherBonus: 0,
    deductions: 0,
    totalPayable: 16500,
    paymentStatus: 'Paid',
    paymentDate: '2026-08-07',
    paymentMode: 'Cash'
  }
];

export const INITIAL_FESTIVALS: FestivalItem[] = [
  {
    id: 'fest-diwali',
    name: 'Diwali (Festival of Lights)',
    date: '2026-11-08',
    month: 11,
    day: 8,
    year: 2026,
    description: 'Grand Indian Festival of Lights. Traditional 10% salary bonus enabled for all shop workers.',
    isActive: true,
    bonusEnabled: true,
    bonusType: 'Percentage',
    bonusValue: 10,
    eligibilityType: 'All',
    emoji: '🪔'
  },
  {
    id: 'fest-holi',
    name: 'Holi (Festival of Colors)',
    date: '2026-03-04',
    month: 3,
    day: 4,
    year: 2026,
    description: 'Festival of colors and spring celebration. 5% festive bonus.',
    isActive: true,
    bonusEnabled: true,
    bonusType: 'Percentage',
    bonusValue: 5,
    eligibilityType: 'All',
    emoji: '🎨'
  },
  {
    id: 'fest-durga-puja',
    name: 'Durga Puja',
    date: '2026-10-17',
    month: 10,
    day: 17,
    year: 2026,
    description: 'Grand Navratri & Durga Puja celebration. Fixed ₹2,000 festival bonus.',
    isActive: true,
    bonusEnabled: true,
    bonusType: 'Fixed',
    bonusValue: 2000,
    eligibilityType: 'All',
    emoji: '🪔'
  },
  {
    id: 'fest-dussehra',
    name: 'Dussehra (Vijayadashami)',
    date: '2026-10-20',
    month: 10,
    day: 20,
    year: 2026,
    description: 'Victory of good over evil. Festive sweets allowance.',
    isActive: true,
    bonusEnabled: true,
    bonusType: 'Fixed',
    bonusValue: 1000,
    eligibilityType: 'All',
    emoji: '🏹'
  },
  {
    id: 'fest-raksha-bandhan',
    name: 'Raksha Bandhan',
    date: '2026-08-28',
    month: 8,
    day: 28,
    year: 2026,
    description: 'Celebration of sibling bond. ₹1,000 festival bonus for all workers.',
    isActive: true,
    bonusEnabled: true,
    bonusType: 'Fixed',
    bonusValue: 1000,
    eligibilityType: 'All',
    emoji: '🧵'
  },
  {
    id: 'fest-janmashtami',
    name: 'Janmashtami',
    date: '2026-09-04',
    month: 9,
    day: 4,
    year: 2026,
    description: 'Lord Krishna birth celebration.',
    isActive: true,
    bonusEnabled: true,
    bonusType: 'Fixed',
    bonusValue: 500,
    eligibilityType: 'All',
    emoji: '🪶'
  },
  {
    id: 'fest-ganesh-chaturthi',
    name: 'Ganesh Chaturthi',
    date: '2026-09-14',
    month: 9,
    day: 14,
    year: 2026,
    description: 'Ganesh Utsav celebration. Modak sweets & ₹1,000 bonus.',
    isActive: true,
    bonusEnabled: true,
    bonusType: 'Fixed',
    bonusValue: 1000,
    eligibilityType: 'All',
    emoji: '🐘'
  },
  {
    id: 'fest-eid',
    name: 'Eid-ul-Fitr',
    date: '2026-03-20',
    month: 3,
    day: 20,
    year: 2026,
    description: 'Joyous Eid celebration with 10% festival bonus.',
    isActive: true,
    bonusEnabled: true,
    bonusType: 'Percentage',
    bonusValue: 10,
    eligibilityType: 'All',
    emoji: '🌙'
  },
  {
    id: 'fest-christmas',
    name: 'Christmas',
    date: '2026-12-25',
    month: 12,
    day: 25,
    year: 2026,
    description: 'Year-end holiday celebration.',
    isActive: true,
    bonusEnabled: true,
    bonusType: 'Fixed',
    bonusValue: 1000,
    eligibilityType: 'All',
    emoji: '🎄'
  },
  {
    id: 'fest-independence',
    name: 'Independence Day',
    date: '2026-08-15',
    month: 8,
    day: 15,
    year: 2026,
    description: 'National Independence Day. Flag hoisting & ₹1,000 bonus.',
    isActive: true,
    bonusEnabled: true,
    bonusType: 'Fixed',
    bonusValue: 1000,
    eligibilityType: 'All',
    emoji: '🇮🇳'
  },
  {
    id: 'fest-republic',
    name: 'Republic Day',
    date: '2026-01-26',
    month: 1,
    day: 26,
    year: 2026,
    description: 'National Republic Day celebration.',
    isActive: true,
    bonusEnabled: true,
    bonusType: 'Fixed',
    bonusValue: 1000,
    eligibilityType: 'All',
    emoji: '🇮🇳'
  }
];

export const INITIAL_WORKER_NOTIFICATIONS: WorkerNotification[] = [
  {
    id: 'notif-1',
    title: '🪔 Upcoming Festival: Raksha Bandhan',
    message: 'Raksha Bandhan is in 8 days. Configured bonus for 4 workers. Estimated payout: ₹4,000.',
    notificationType: 'Warning',
    relatedFestivalId: 'fest-raksha-bandhan',
    scheduledDate: '2026-08-20',
    daysRemaining: 8,
    estimatedBonusPayout: 4000,
    isRead: false
  },
  {
    id: 'notif-2',
    title: '🪶 Upcoming Festival: Janmashtami',
    message: 'Janmashtami is in 15 days. Bonus enabled: ₹500 fixed per worker.',
    notificationType: 'Normal',
    relatedFestivalId: 'fest-janmashtami',
    scheduledDate: '2026-08-20',
    daysRemaining: 15,
    estimatedBonusPayout: 2000,
    isRead: false
  }
];

export const TRADABLE_ASSETS: TradableAsset[] = [
  {
    id: 'asset-sync-layer',
    name: 'Universal Low-Connectivity Sync Layer',
    tagline: 'Offline-first PouchDB/IndexedDB sync engine with conflict visualizer & delta queue',
    category: 'Sync',
    targetDomains: ['Healthcare Logistics', 'Disaster Response', 'Shopkeeper POS', 'Fleet Transport'],
    description: 'A modular, high-reliability local-first database adapter built on PouchDB/RxDB standards. Enables full offline read/write access with low latency, background mutation queueing, automatic server catchup, and visual conflict resolution.',
    demoVideoDuration: '35 Seconds',
    features: [
      'IndexedDB local persistence with zero network dependency',
      'Live network connection simulator (Online, 2G, Offline)',
      'Out-of-band mutation queue with automatic flush retry',
      'Visual conflict side-by-side diff & auto-merge resolution strategies'
    ],
    integrationCodeSnippet: `import { SyncEngine } from '@dukaan/sync-layer';

const syncEngine = new SyncEngine({
  dbName: 'emergency_triage_db',
  remoteUrl: 'https://sync.health-core.org/db',
  autoSyncIntervalMs: 5000
});

await syncEngine.saveMutation('PATIENT_RECORD', { id: 'p101', status: 'CRITICAL' });`,
    isLocked: false
  },
  {
    id: 'asset-ocr-engine',
    name: 'Universal Document & Bill OCR Component',
    tagline: 'Client-side Tesseract OCR with adaptive canvas binarization & regex line-item extraction',
    category: 'OCR',
    targetDomains: ['Retail Shopkeeper', 'Medical Prescriptions', 'Govt Tax Invoices', 'Expense Management'],
    description: 'An isolated OCR processing module that captures document images via camera or file upload, applies adaptive thresholding, and parses tabular line items, prices, tax totals, and header metadata completely on client side.',
    demoVideoDuration: '40 Seconds',
    features: [
      'In-browser Tesseract WASM execution - no cloud dependency required',
      'Smart Canvas Image pre-processor (Contrast boost, grayscale, deskew)',
      'Regex & LLM-like heuristic line-item table parser',
      '1-Click payload transformation into cart items or inventory entries'
    ],
    integrationCodeSnippet: `import { ExtractInvoiceData } from '@dukaan/bill-ocr';

const result = await ExtractInvoiceData(fileInput.files[0], {
  detectTable: true,
  enhanceImage: true
});

console.log('Extracted Store:', result.storeName);`,
    isLocked: false
  },
  {
    id: 'asset-khata-ledger',
    name: 'Khata Credit & Payment Engine',
    tagline: 'Multi-party double-entry ledger with credit risk scoring & automated WhatsApp payload builder',
    category: 'Ledger',
    targetDomains: ['Micro-Finance', 'Retail Shopkeeper', 'Freelance Billing', 'Agri-Market Trading'],
    description: 'A bulletproof credit tracking engine managing customer balances (Jama vs Udhaar), credit limit enforcement, risk categorization algorithms, and automated deep-linked payment collection alerts.',
    demoVideoDuration: '30 Seconds',
    features: [
      'Double-entry transaction audit trail',
      'Real-time customer credit risk classifier (Low/Med/High)',
      'WhatsApp API formatted payment link & receipt generator',
      'PDF printable customer statement exporter'
    ],
    integrationCodeSnippet: `import { KhataLedger } from '@dukaan/khata-engine';

const ledger = new KhataLedger();
const customerRisk = ledger.calculateRiskScore({
  totalDebt: 3200,
  creditLimit: 2500,
  daysOverdue: 14
});`,
    isLocked: false
  },
  {
    id: 'asset-ai-promotions',
    name: 'AI Inventory Offer & Promotion Generator',
    tagline: 'Autonomous slow-moving inventory analyzer & smart bundle deal builder ("Buy 2 Get ₹10 Off")',
    category: 'AI',
    targetDomains: ['Retail Shopkeeper', 'Supermarkets', 'E-Commerce', 'B2B Inventory'],
    description: 'An AI engine that analyzes inventory turn rates, identifies overstocked / slow-moving products, and constructs margin-optimized promotional bundles (e.g. Milk + Bread combos or Buy 2 Get ₹10 Off) to unlock cash flow.',
    demoVideoDuration: '35 Seconds',
    features: [
      'Slow-moving stock velocity detection',
      'Automated margin-safe bundle generation',
      '1-Click instant application to POS billing cart',
      'Dynamic sales lift estimation (+18% basket conversion)'
    ],
    integrationCodeSnippet: `import { AIPromotionService } from '@apnadukan/ai-promotions';

const service = new AIPromotionService();
const offers = service.generateInventoryOffers(productsList);

console.log('Suggested Offer:', offers[0].discountBadge);`,
    isLocked: false
  },
  {
    id: 'asset-smart-restock',
    name: 'Emergency Smart Restock & Rate Comparator',
    tagline: 'Instant supplier delivery time & rate comparison module with 1-click PO dispatch',
    category: 'Workflow',
    targetDomains: ['Retail POS', 'Pharma Logistics', 'Supply Chain Mandi', 'Hospital Stocks'],
    description: 'Replaces generic Out-of-Stock warnings with live local supplier rate comparisons (Delivery time vs Unit Price), allowing shopkeepers to order stock instantly with 1-click PO generation.',
    demoVideoDuration: '35 Seconds',
    features: [
      'Real-time supplier delivery time comparison (2-Hour Express vs Tomorrow)',
      'Lowest unit price vs fastest delivery score calculator',
      '1-Click automated Purchase Order (PO) dispatch',
      'Confetti & audio notification triggers upon dispatch'
    ],
    integrationCodeSnippet: `import { SmartRestockEngine } from '@apnadukan/smart-restock';

const restock = new SmartRestockEngine();
const options = await restock.getSupplierRates(product.id);
await restock.dispatchPO(options[0].supplierId, 50);`,
    isLocked: false
  },
  {
    id: 'asset-pitch-simulation',
    name: '✨ AI Pitch Storytelling Presentation Simulator',
    tagline: '6-step automated pitch simulation widget for live hackathon judge demonstrations',
    category: 'AI',
    targetDomains: ['Hackathon Pitches', 'VC Demos', 'Interactive Showcase', 'Product Launches'],
    description: 'An interactive, animated storytelling modal designed specifically for hackathon judging. Simulates live sales streaming, inventory decrements, AI stock-out prediction, and automated restock dispatch in a 60-second automated walkthrough.',
    demoVideoDuration: '45 Seconds',
    features: [
      'Automated 6-stage storytelling step progress bar',
      'Live metric streaming & animated SVG graphs',
      'Confetti celebration upon 6th step completion',
      'Manual pause, resume, and restart pitch controls'
    ],
    integrationCodeSnippet: `import { AIPitchSimulator } from '@apnadukan/pitch-simulator';

<AIPitchSimulator
  isOpen={showPitchModal}
  onClose={() => setShowPitchModal(false)}
/>`,
    isLocked: false
  },
  {
    id: 'asset-price-predictor',
    name: 'Smart Price & Profit ML Predictor Engine',
    tagline: 'Demand elasticity analyzer & optimal selling price calculation module',
    category: 'Analytics',
    targetDomains: ['Retail Shopkeeper', 'Wholesale Distributors', 'SaaS Subscriptions'],
    description: 'Analyzes historical customer purchasing records and demand curves to recommend optimal selling prices, calculating projected monthly profit increases with an interactive elasticity slider.',
    demoVideoDuration: '35 Seconds',
    features: [
      'Historical sales velocity & price elasticity modeling',
      'Margin-safe price recommendation calculator',
      'Interactive elasticity aggressiveness slider',
      '1-Click catalog price update execution'
    ],
    integrationCodeSnippet: `import { SmartPricePredictor } from '@apnadukan/price-predictor';

const predictor = new SmartPricePredictor();
const rec = predictor.predictOptimalPrice(product);
console.log('Rec Price:', rec.recommendedPrice);`,
    isLocked: false
  },
  {
    id: 'asset-supplier-ai',
    name: 'Supplier Vendor AI Margin & Clearance Advisor',
    tagline: 'Vendor-only AI assistant for wholesale clearance discounts & B2B pricing',
    category: 'AI',
    targetDomains: ['Wholesale Vendors', 'Supply Chain Distributors', 'B2B Marketplaces'],
    description: 'A private vendor-only AI advisor that calculates recommended clearance discount rates for unsold wholesale inventory, preserving gross margins while accelerating stock turnover.',
    demoVideoDuration: '30 Seconds',
    features: [
      'Vendor-only role authentication check',
      'Unsold inventory clearance discount calculator',
      'Wholesale bulk pricing strategy generator',
      'B2B profit margin optimization prompts'
    ],
    integrationCodeSnippet: `import { SupplierAIChatbot } from '@apnadukan/supplier-ai';

<SupplierAIChatbot
  isOpen={showSupplierChat}
  onClose={() => setShowSupplierChat(false)}
/>`,
    isLocked: false
  },
  {
    id: 'asset-worker-festival-payroll',
    name: 'Indian Festival Calendar & Worker Payroll Engine',
    tagline: 'Automated festival bonus calculation, worker payroll, and countdown alert system',
    category: 'Workflow',
    targetDomains: ['Retail Shopkeepers', 'SME Business Payroll', 'Factory Staff Management'],
    description: 'An integrated staff management engine featuring a dynamic Indian Festival Calendar (Diwali, Holi, Durga Puja), automated percentage & fixed bonus calculation, and a multi-stage countdown notification system.',
    demoVideoDuration: '40 Seconds',
    features: [
      'Interactive Indian Festival Calendar (Diwali, Holi, Eid, Christmas)',
      'Automated % and Fixed festival bonus calculator per worker',
      '14-day, 7-day, 3-day, 1-day festival countdown alert schedule',
      'Monthly salary expense, bonuses & pending payment tracking'
    ],
    integrationCodeSnippet: `import { WorkerPayrollEngine } from '@apnadukan/worker-payroll';

const payroll = new WorkerPayrollEngine();
await payroll.generateMonthlySalaryRecords('August', 2026);
const bonus = payroll.calculateFestivalBonus(worker, festival);`,
    isLocked: false
  },
  {
    id: 'asset-whatsapp-reminders',
    name: 'Automated WhatsApp Reminders & Notification Engine',
    tagline: 'Deep-link payment reminder & invoice notification generator (0 Paid API keys required)',
    category: 'Workflow',
    targetDomains: ['Retail Shopkeepers', 'Micro-Finance', 'Freelance Billing', 'E-Commerce Orders'],
    description: 'A zero-cost WhatsApp messaging engine that constructs deep-linked payment collection alerts, festival greetings, and invoice receipts using the wa.me protocol directly on the user device.',
    demoVideoDuration: '30 Seconds',
    features: [
      'Deep-Link Protocol (wa.me) format generator',
      'Automated Udhaar debt collection message builder',
      'Festival greeting & bonus announcement templates',
      'Zero external API key dependency (100% Client-Side)'
    ],
    integrationCodeSnippet: `import { buildWhatsAppPaymentReminder } from '@apnadukan/whatsapp-reminders';

const res = buildWhatsAppPaymentReminder({
  recipientName: 'Ramesh Sharma',
  phone: '+919876543210',
  amountDue: 1450,
  reminderType: 'Udhaar Payment'
});

window.open(res.deepLinkUrl, '_blank');`,
    isLocked: false
  },
  {
    id: 'asset-dashboard-analytics',
    name: 'Executive Dashboard & Business Analytics Engine',
    tagline: 'Visual sales KPI dashboard, category breakdowns, and net profit velocity tracker',
    category: 'Analytics',
    targetDomains: ['Executive Dashboards', 'Retail Shopkeepers', 'B2B Analytics', 'SaaS Metrics'],
    description: 'A modular analytics engine calculating real-time sales KPIs, average order values (AOV), category profit share breakdowns, and projected monthly net margins.',
    demoVideoDuration: '35 Seconds',
    features: [
      'Real-time Sales Revenue, AOV, and Bill Volume metrics',
      'Category revenue share percentage calculations',
      'Monthly Net Profit vs Operating Expense series model',
      'Interactive visual charts & CSV data export'
    ],
    integrationCodeSnippet: `import { calculateExecutiveDashboardMetrics } from '@apnadukan/dashboard-analytics';

const metrics = calculateExecutiveDashboardMetrics(210000, 142);
console.log('Revenue KPI:', metrics[0].value);`,
    isLocked: false
  }
];


