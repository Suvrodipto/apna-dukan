export interface WorkerProfile {
  id: string;
  workerId: string;
  name: string;
  phone: string;
  address: string;
  designation: 'Cashier' | 'Store Helper' | 'Store Manager' | 'Delivery Executive' | 'Accountant';
  joiningDate: string;
  monthlySalary: number;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

export interface SalaryRecord {
  id: string;
  workerId: string;
  workerName: string;
  month: string;
  year: number;
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
  date: string;
  month: number;
  day: number;
  year: number;
  description: string;
  isActive: boolean;
  bonusEnabled: boolean;
  bonusType: 'Fixed' | 'Percentage';
  bonusValue: number;
  eligibilityType: 'All' | 'Selected';
  eligibleWorkerIds?: string[];
  emoji?: string;
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
