# 👷 Worker Management & Festival Bonus Payroll Engine

> **Standalone HR, Employee Directory, Automated Payroll, and Indian Festival Bonus Engine.**

---

## 🎬 30–45s Video Demo & Execution Walkthrough

- **Video Demo Duration**: `40 Seconds`
- **Interactive Walkthrough URL**: Launch the web application (`http://localhost:5173/`), switch to the **Tradable Asset Marketplace & Demo Studio** tab, select **Worker Management**, and click **▶️ Play Interactive Video Demo**.
- **Execution Summary**:
  1. **Step 1**: Ingest worker profile records (`EMP-101`, `EMP-102`), monthly salary definitions, and status filters.
  2. **Step 2**: Query active Indian Festival Calendar (Diwali, Durga Puja, Eid, Christmas) and load bonus rules (`Fixed ₹` or `%`).
  3. **Step 3**: Execute monthly salary payroll calculation, applying custom festival bonus values (e.g. ₹500, ₹800, ₹1000).
  4. **Step 4**: Dispatch 14-day, 7-day, 3-day countdown alerts and process 1-click UPI/Cash salary payout verification.

---

## 🚀 Features
- **Worker Directory**: Auto-generated Employee IDs, full name, contact, designation, and salary tracking.
- **Indian Festival Calendar**: Built-in festival database with countdown notifications.
- **Manual Bonus Editing**: Custom fixed amount (₹) or percentage (%) bonus configuration per festival.
- **1-Click Salary Disbursement**: UPI, Cash, and Bank Transfer payment marking.

## 💡 Quick Code Integration

```typescript
import { WorkerPayrollEngine } from './modules/worker-management';

const payroll = new WorkerPayrollEngine();
await payroll.generateMonthlySalaryRecords('August', 2026);
```
