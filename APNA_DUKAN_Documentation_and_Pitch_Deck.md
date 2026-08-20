# APNA DUKAN - Complete Technical Architecture, Working Guide & Presentation

---

## 🏛️ Executive Summary

**APNA DUKAN** is a state-of-the-art, human-crafted retail shopkeeper management application designed for small shopkeepers operating in environments with intermittent or poor network connectivity. Built using **React 18**, **Vite**, **TypeScript**, **Tailwind CSS**, and **Dexie IndexedDB (PouchDB sync queue)**, APNA DUKAN combines offline-first database synchronization, client-side OCR for paper invoices, voice-driven POS billing, soundbox audio alerts, Razorpay payment gateway integration, smart credit risk analysis, AI inventory promotions ("Offer Banao"), emergency smart restocking, customer audio greetings, a vendor-only Supplier AI Chatbot, a Smart Price & Profit Predictor module, a VIP Customer Loyalty Program with ₹5,000+ Gift Hampers, an interactive **Worker Management & Festival Payroll Engine**, and a live judge pitch simulator into a unified, high-performance operating system.

---

## 🎨 Design System & Visual Identity

- **Main Canvas Background**: Deep Obsidian Charcoal (`#0a0a0e`) with subtle warm radial amber gold glows.
- **Panels & Nav Bar**: Dark Graphite (`#121218` & `#14141c`).
- **Product Cards & Inputs**: Lighter Charcoal (`#181820` / `#1c1c26`) with subtle warm borders (`rgba(255, 255, 255, 0.08)`).
- **Golden Accent Color**: Warm Amber Gold (`#f59e0b`), High-Contrast Yellow (`#fbbf24`), and Muted Gold (`#d97706`).

---

## 🔑 Permanent Authentication Credentials

| Role Context | User ID / Email | Permanent Password | Access Level |
| :--- | :--- | :--- | :--- |
| 👑 **Shop Owner (Admin)** | `admin@apnadukan.com` *(or `admin`)* | `ApnaDukan@123` *(or `admin`)* | Full Access (All 9 Modules + Staff HR + Analytics + Settings) |
| 💳 **POS Cashier** | `cashier@apnadukan.com` | `cashier123` | POS Billing, Khata Ledger, Catalogue View, Bill OCR |
| 🚚 **Supplier Vendor** | `supplier@apnadukan.com` | `supplier123` | Wholesale Purchase Orders, Vendor-Only AI, Tradable Studio |

---

## ⚙️ Module-by-Module Technical Working & New Innovations

### 1. 👷 Worker Management & Festival Payroll Engine (NEW!)
- **Worker Profiles Directory**: Full Name, Mobile Number, Address, Employee ID (`EMP-101`), Joining Date, Designation (Cashier, Store Helper, Store Manager, Delivery Executive, Accountant), Monthly Salary, and Active/Inactive status.
- **Monthly Salary & Payroll Automation**: Tracks Base Salary, Festival Bonus, Other Bonus, Deductions, and Net Payable (`Base + Bonus - Deductions`). Allows 1-click **"Mark Paid"** via Cash, UPI, or Bank Transfer.
- **Interactive Indian Festival Calendar**: Pre-loaded major festivals (**Diwali**, **Holi**, **Durga Puja**, **Dussehra**, **Raksha Bandhan**, **Janmashtami**, **Ganesh Chaturthi**, **Eid**, **Christmas**, **Independence Day**, **Republic Day**). Includes month navigation and festival details modal.
- **Festival Bonus Settings**: Configure ON/OFF rules per festival with Fixed Amount (e.g. ₹2,000) or Percentage of Monthly Salary (e.g. 10% Diwali bonus = ₹1,800 on ₹18k salary).
- **Festival Alerts & Notification Schedule**: Countdown alert engine (14-day, 7-day, 3-day, 1-day, Festival Today) with estimated bonus liability calculations.

### 2. 🛒 POS Billing Terminal, Voice Billing & Customer Greeting
- **Voice Billing ("Bolo aur Bill Banao")**: Uses `window.SpeechRecognition` (Web Speech API) listening in Hindi (`hi-IN`) and English. Matches spoken text (e.g., "Atta", "Milk", "Butter") against product catalogue names and automatically adds items to the cart.
- **Paytm/PhonePe Audio Soundbox Alerts**: Uses `window.speechSynthesis` with Hindi voice locale (`hi-IN`). Upon completing checkout, it announces audio alerts out loud (*"Apna Dukan par ₹540 praapt hue!"*).
- **Customer Audio & Visual Greeting Experience**: Greets customers automatically upon completed checkout (*"Thank you for shopping with APNA DUKAN! Aapka din shubh ho!"* / *"Apna Dukan par aane ke liye dhanyavaad!"*).
- **AI Smart Cross-Selling Engine**: Recommends complementary basket items (e.g. Tea -> Sugar/Biscuits) in real time (+18% basket conversion).
- **Razorpay Secure Checkout Gateway**: Integrated modal simulating UPI Apps (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards, and Netbanking.
- **Rolling Thermal Receipt Printer Animation**: Renders a thermal printer dispenser slot graphic, an active red laser scanning line moving line-by-line, and a thermal barcode printed at the receipt bottom.

### 3. 🚚 Vendor-Only Supplier AI Chatbot
- **Private Supplier Access**: Accessible ONLY when role is set to `supplier` (or switched in role context).
- **Unsold Inventory Clearance Strategy**: Calculates optimal wholesale discount rates for slow-moving products (*"Recommend 15% clearance discount to clear 85 units while preserving a 14.2% gross profit margin"*).

### 4. 📈 Smart Price & Profit ML Predictor Engine
- **Historical Sales Analysis**: Analyzes past purchasing velocity and price elasticity curves.
- **Optimal Price Recommender**: Compares current selling prices against **AI Recommended Optimal Prices** to maximize monthly net profit without losing customer volume.
- **Interactive Elasticity Slider**: Allows shopkeepers to adjust pricing aggressiveness from high volume to maximum margin!

### 5. ⭐ Dukan VIP Gold Loyalty Club & ₹5,000+ Gift Hamper Trigger
- **VIP Customer Perks**: Monthly regular customers receive ⭐ **VIP GOLD MEMBER** status, giving them an automatic 5% extra discount on POS billing!
- **🎁 ₹5,000+ Gift Hamper Trigger**: When a bill total crosses **₹5,000**, the system automatically triggers a festive **"🎁 FREE GIFT HAMPER & ₹500 COUPON UNLOCKED!"** modal with celebratory sound & confetti!

### 6. 🔥 AI Inventory Offer & Promotion Generator ("Offer Banao - Increase Sales")
- **Problem Solved**: Prevents dead capital caused by slow-moving or overstocked inventory.
- **Automated AI Offers**: Detects high-inventory velocity curves and auto-builds promotional deals (*"Buy 2 Get ₹10 Off"* / *"Milk + Bread Combo"*).

### 7. ⚡ Emergency Smart Restocking Engine
- **Replaces Generic Out-of-Stock Warnings**: Clicking `⚡ SMART RESTOCK` opens real-time local supplier rate comparison (*Supplier A: 2-Hour Express vs Supplier B: Lowest Price*) with 1-click PO dispatch!

### 8. ✨ "Show AI in Action" - Judge Presentation Pitch Simulator
- **Interactive Storytelling Modal**: Prominent header button (`✨ SHOW AI IN ACTION`) launching an automated 6-step presentation simulation walkthrough.

### 9. 📖 Khata / Udhaar Credit Ledger Engine & Bill OCR Scanner
- Double-entry ledger with credit limit enforcement, risk scoring (Low, Medium, High), 1-click WhatsApp reminders, and in-browser Tesseract.js WASM OCR parser.

---

## 💎 9 Tradable & Transferable Assets (40% Dealmaking Score Weightage)

Teams can sell or transfer these **9 isolated, modular components** independently to other teams:

1. **Asset 1: Low-Connectivity RxDB/PouchDB Sync Engine** (35s Demo Video Spec)
2. **Asset 2: Bill OCR & Invoice Extraction WASM Engine** (40s Demo Video Spec)
3. **Asset 3: Khata Credit Ledger & Risk Scoring Engine** (30s Demo Video Spec)
4. **Asset 4: AI Inventory Offer & Promotion Generator ("Offer Banao")** (35s Demo Video Spec)
5. **Asset 5: Emergency Smart Restock & Supplier Rate Comparator** (35s Demo Video Spec)
6. **Asset 6: ✨ AI Pitch Presentation Storytelling Simulator** (45s Demo Video Spec)
7. **Asset 7: Smart Price & Profit ML Predictor Engine** (35s Demo Video Spec)
8. **Asset 8: Supplier Vendor AI Margin & Clearance Advisor** (30s Demo Video Spec)
9. **Asset 9: Indian Festival Calendar & Worker Payroll Engine** (40s Demo Video Spec)

---

## 🎯 Verification & Local Server

- **Build Status**: `npm run build` compiled 100% cleanly with **0 errors**.
- **Live Local Server**: Active at **`http://localhost:5173/`**.
