export interface KhataCustomer {
  id: string;
  name: string;
  phone: string;
  address?: string;
  currentBalance: number;
  creditLimit: number;
  riskScore: 'Low' | 'Medium' | 'High';
  lastTransactionDate: string;
  isVIP?: boolean;
}

export interface KhataTransaction {
  id: string;
  customerId: string;
  customerName: string;
  date: string;
  type: 'udhaar' | 'jama';
  amount: number;
  note: string;
  paymentMode?: string;
}
