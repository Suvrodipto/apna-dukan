# 🚨 Plug-and-Play Anomaly Detection Engine (Standalone Module)

> **HACQUIRE 2026 M&A Acquired Asset #1 (Acquired from Voltiq / Ashmit-Roy for ₹4.00 Cr FED Coins)**

---

## 📌 Problem Solved
Unexpected sales spikes, revenue surges, inventory drain anomalies, and unusual transaction volumes can occur during peak store hours or festival sales. This engine provides a zero-training statistical solution ($Z = \frac{x - \mu}{\sigma}$) that flags numerical time-series stream anomalies and categorizes severity (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).

---

## 🚀 Quick Usage Example

```typescript
import { AnomalyDetector } from './detector';

const detector = new AnomalyDetector(2.0); // Z-Score threshold 2.0σ
const history = [1200, 1450, 1300, 1850, 1600, 1750, 1900, 1800];
const currentValue = 5850; // Festive Saffron + Ghee purchase surge

const result = detector.evaluate(currentValue, history);

console.log(result.isAnomaly); // true
console.log(result.zScore);    // +12.5σ
console.log(result.severity);  // 'CRITICAL'
```

---

## 📄 License
MIT License. Integrated into APNA DUKAN for HACQUIRE 2026.
