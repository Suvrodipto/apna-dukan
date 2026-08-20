# 📖 Khata Credit & Udhaar Ledger Engine

Multi-party double-entry credit ledger, customer risk score classifier (Low/Med/High), and automated WhatsApp deep-link payment collection alert generator.

## 🚀 Features
- **Double-Entry Auditing**: Tracks Jama (payments received) vs Udhaar (credit given).
- **Risk Score Algorithm**: Classifies customers based on debt vs credit limit.
- **WhatsApp Collection Generator**: Deep-linked payment links (`wa.me`).

## 💡 Usage

```typescript
import { calculateCustomerRisk, generateWhatsAppReminderUrl } from './modules/khata-ledger';

const risk = calculateCustomerRisk(3200, 2500); // Returns 'High'
const link = generateWhatsAppReminderUrl('+919876543210', 'Ramesh', 1500);
```
