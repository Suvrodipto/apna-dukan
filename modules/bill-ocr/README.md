# 📄 Client-Side Bill & Document OCR Component

Standalone, zero-cloud dependency OCR processing component powered by Tesseract.js WebAssembly. Extracts line items, prices, store titles, and totals from uploaded or camera-scanned receipts, featuring **Supplier Price History 📈** and **✨ AI Insights Summary**.

## 🚀 Features
- **In-Browser Execution**: 100% offline, zero API keys required.
- **Supplier Price History 📈**: Compare scanned wholesale rates against previous cost prices (e.g. Atta 5kg ₹195 $\rightarrow$ ₹210, +7.6%).
- **✨ AI Bill Summary**: Real-time breakdown of total purchase value, items added, wholesale price inflation (+₹85), highest value item, and 18% estimated profit margin.
- **Table Line-Item Parser**: Extract product names, rates, and totals automatically.
- **POS Cart Pre-loader**: 1-Click transfer of parsed items into billing cart.

## 💡 Usage

```typescript
import { parseInvoiceRawText, compareSupplierPriceHistory } from './modules/bill-ocr';

const parsedData = parseInvoiceRawText(ocrTextContent);
const priceHistory = compareSupplierPriceHistory(210, 195);
// Returns { changeAmount: 15, changePercent: 7.6, isInflation: true }
```
