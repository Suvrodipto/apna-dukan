# 📄 Client-Side Bill & Document OCR Component

Standalone, zero-cloud dependency OCR processing component powered by Tesseract.js WebAssembly. Extracts line items, prices, store titles, and totals from uploaded or camera-scanned receipts.

## 🚀 Features
- **In-Browser Execution**: 100% offline, zero API keys required.
- **Table Line-Item Parser**: Extract product names, rates, and totals automatically.
- **POS Cart Pre-loader**: 1-Click transfer of parsed items into billing cart.

## 💡 Usage

```typescript
import { parseInvoiceRawText } from './modules/bill-ocr';

const parsedData = parseInvoiceRawText(ocrTextContent);
```
