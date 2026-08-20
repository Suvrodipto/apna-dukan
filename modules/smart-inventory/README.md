# 📦 Smart Inventory & Emergency Restock Engine

Autonomous inventory velocity analyzer, slow-moving stock bundle builder ("Buy 2 Get ₹10 Off"), and instant local supplier rate comparator module.

## 🚀 Features
- **Slow-Moving Detection**: Auto-flags products with turn rate > 30 days.
- **AI Deal Generator**: Constructs margin-safe promotional bundles.
- **Emergency Restock Comparator**: Replaces "Out of Stock" alerts with live delivery time vs unit price comparisons (2-Hour Express vs Tomorrow).

## 💡 Quick Integration

```typescript
import { analyzeInventoryTurnover, generateSmartOffers } from './modules/smart-inventory';

const offers = generateSmartOffers(productList);
```
