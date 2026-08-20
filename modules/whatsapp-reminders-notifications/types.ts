export interface WhatsAppReminderPayload {
  id: string;
  recipientName: string;
  phone: string;
  amountDue: number;
  dueDate: string;
  reminderType: 'Udhaar Payment' | 'Festival Greeting' | 'Order Status' | 'Invoice Delivery';
  customNote?: string;
}

export interface WhatsAppNotificationResult {
  success: boolean;
  deepLinkUrl: string;
  formattedPhone: string;
  encodedMessage: string;
}
