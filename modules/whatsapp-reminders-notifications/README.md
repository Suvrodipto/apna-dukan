# 💬 Automated WhatsApp Reminders & Notifications Engine

Standalone, zero-cost WhatsApp messaging & deep-link notification generator. Formats payment collection alerts, invoice receipts, order updates, and festival greetings for instant 1-click dispatch.

## 📦 Features
- **Deep-Link Protocol**: Formats `https://wa.me/` URLs without paid API keys.
- **Udhaar Collection Generator**: Formats credit debt reminders with customer name & amount.
- **Festival Greetings**: Formats festival bonus & greeting payloads.

## 🚀 Quick Integration

```typescript
import { buildWhatsAppPaymentReminder } from './modules/whatsapp-reminders-notifications';

const result = buildWhatsAppPaymentReminder({
  id: 'rem-101',
  recipientName: 'Ramesh Sharma',
  phone: '+919876543210',
  amountDue: 1450,
  dueDate: '2026-08-25',
  reminderType: 'Udhaar Payment'
});

window.open(result.deepLinkUrl, '_blank');
```
