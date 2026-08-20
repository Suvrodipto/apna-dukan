import type { KhataCustomer } from './types';

export * from './types';

export function calculateCustomerRisk(balance: number, creditLimit: number): 'Low' | 'Medium' | 'High' {
  if (balance > creditLimit) return 'High';
  if (balance > creditLimit * 0.7) return 'Medium';
  return 'Low';
}

export function generateWhatsAppReminderUrl(phone: string, customerName: string, balance: number): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const message = `Namaste ${customerName} ji! Reminder from APNA DUKAN: Your pending Khata balance is ₹${balance}. Please pay via UPI. Thank you!`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
