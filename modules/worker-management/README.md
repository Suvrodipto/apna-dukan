# 👷 Worker Management & Indian Festival Payroll Module

Standalone, plug-and-play HR management component featuring worker profiles, automated monthly salary calculations, an interactive Indian Festival Calendar (Diwali, Holi, Durga Puja), percentage/fixed festival bonus settings, and countdown alert notifications.

## 📦 Features
- **Worker Database**: Add, edit, search, and delete staff profiles (Cashier, Manager, Helper, Delivery Exec).
- **Salary Payroll**: Auto-calculate net payable salary (`Base + Bonus - Deductions`) and 1-click payment status updates.
- **Indian Festival Calendar**: Integrated holiday dates and bonus rules.
- **Festival Alert System**: Scheduled notifications (14-day, 7-day, 3-day countdowns) with estimated bonus payouts.

## 🚀 Quick Integration

```tsx
import { WorkerManagementModule } from './modules/worker-management';

export default function App() {
  return <WorkerManagementModule />;
}
```

## 🛠️ API & Exported Utilities

```typescript
import { 
  calculateFestivalBonus, 
  generateMonthlySalaryRecord 
} from './modules/worker-management';

const bonus = calculateFestivalBonus(workerProfile, festivalItem);
```
