import type { WhatsAppReminderPayload, WhatsAppNotificationResult } from './types';

export * from './types';

export function buildWhatsAppPaymentReminder(payload: WhatsAppReminderPayload): WhatsAppNotificationResult {
  const cleanPhone = payload.phone.replace(/[^0-9]/g, '');
  const formattedPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
  
  let message = `Namaste ${payload.recipientName} ji! 🙏\n`;
  
  if (payload.reminderType === 'Udhaar Payment') {
    message += `Payment Reminder from APNA DUKAN: Your pending Udhaar balance is ₹${payload.amountDue}. Please clear it via UPI or Cash. Thank you!`;
  } else if (payload.reminderType === 'Festival Greeting') {
    message += `Wishing you and your family a very Happy Festival! 🎉 Thank you for being a valued customer of APNA DUKAN!`;
  } else {
    message += `Your order update: Amount ₹${payload.amountDue}. Status: Confirmed.`;
  }

  if (payload.customNote) {
    message += `\nNote: ${payload.customNote}`;
  }

  const encodedMessage = encodeURIComponent(message);
  const deepLinkUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;

  return {
    success: true,
    deepLinkUrl,
    formattedPhone,
    encodedMessage
  };
}
