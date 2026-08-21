# 🏬 APNA DUKAN - Smart Retail & Shopkeeper Management OS

> **A State-of-the-Art, Offline-First Retail Management OS & Standalone Tradable Asset Suite for Small Shopkeepers in India.**

---

## 🎬 30–45 Second Demo Videos & Interactive Demo Studio

Judges and hackathon participants can view interactive 30–45 second video demos of all separable assets directly inside the application under the **Tradable Asset Marketplace & Demo Studio** tab, or directly via the standalone GitHub module directories below.

### 🎥 How to Access Video Demos:
1. **Live Interactive Demo Studio in Web App**: Launch the app at `http://localhost:5173/`, navigate to **Asset Marketplace**, select any asset, and click **▶️ Play 30–45s Video Demo**.
2. **AI Presentation Pitch Simulator**: Click the **✨ SHOW AI IN ACTION** button in the top navigation bar to run the automated 45-second judge presentation walkthrough.

---

## 📦 Standalone Tradable Asset Suite (`/modules`)

Each asset below is completely separable with zero cross-module coupling, its own `README.md`, `types.ts`, `index.ts`, and `.env.example`:

| # | Standalone Module Name | Category | Video Demo Duration | Direct GitHub Repository Folder Link |
| :-: | :--- | :--- | :-: | :--- |
| **1** | **👷 Worker Management & Festival Bonus** | HR & Payroll | `40 Seconds` | [📁 `/modules/worker-management`](file:///C:/Users/KIIT/.gemini/antigravity-ide/scratch/dukaan-os/modules/worker-management) |
| **2** | **📦 Smart Inventory & Emergency Restock** | Inventory | `35 Seconds` | [📁 `/modules/smart-inventory`](file:///C:/Users/KIIT/.gemini/antigravity-ide/scratch/dukaan-os/modules/smart-inventory) |
| **3** | **📖 Khata Credit & Udhaar Ledger Engine** | Ledger | `30 Seconds` | [📁 `/modules/khata-ledger`](file:///C:/Users/KIIT/.gemini/antigravity-ide/scratch/dukaan-os/modules/khata-ledger) |
| **4** | **📄 Client-Side Bill & Document OCR** | Computer Vision | `40 Seconds` | [📁 `/modules/bill-ocr`](file:///C:/Users/KIIT/.gemini/antigravity-ide/scratch/dukaan-os/modules/bill-ocr) |
| **5** | **📈 Sales Analytics & Price Predictor Engine** | ML Analytics | `35 Seconds` | [📁 `/modules/sales-analytics`](file:///C:/Users/KIIT/.gemini/antigravity-ide/scratch/dukaan-os/modules/sales-analytics) |
| **6** | **🌐 Universal Low-Connectivity Sync Layer** | Offline Sync | `35 Seconds` | [📁 `/modules/low-connectivity-sync`](file:///C:/Users/KIIT/.gemini/antigravity-ide/scratch/dukaan-os/modules/low-connectivity-sync) |
| **7** | **💬 WhatsApp Reminders & Notifications** | Messaging | `30 Seconds` | [📁 `/modules/whatsapp-reminders-notifications`](file:///C:/Users/KIIT/.gemini/antigravity-ide/scratch/dukaan-os/modules/whatsapp-reminders-notifications) |
| **8** | **📊 Executive Dashboard & Business Analytics** | Analytics | `35 Seconds` | [📁 `/modules/dashboard-analytics`](file:///C:/Users/KIIT/.gemini/antigravity-ide/scratch/dukaan-os/modules/dashboard-analytics) |

---

## 🌟 Key Application Features

1. **👷 Worker Management & Festival Payroll**: Auto-generates unique Employee IDs (`EMP-101`), tracks monthly salary expenses, interactive Indian Festival Calendar (Diwali, Eid, Durga Puja), and customizable festival bonus rules (`Fixed ₹` or `%`).
2. **🚚 Vendor-Only Supplier AI Chatbot**: Private advisor for shopkeepers/suppliers recommending stock clearance discount rates while preserving gross profit margins.
3. **📈 Smart Price & Margin Predictor**: On-device demand elasticity optimizer calculating ideal product selling prices for targeted gross margins.
4. **🛍️ Dukan VIP Gold Loyalty Club & Gift Hampers**: Automatically promotes repeat monthly customers to VIP status and triggers celebratory ₹5,000+ purchase gift hampers.
5. **⚡ Zero-Latency POS Billing**: Fast checkout with barcode scanner support, Hindi/English voice commands (`hi-IN` / `en-IN`), thermal receipt generation, and Razorpay payment gateway integration.
6. **📴 Local-First Offline Sync**: Operates 100% offline via Dexie.js (IndexedDB) with background mutation queueing and conflict resolution.

---

## 🚀 Quick Start Guide

### 1. Installation
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open **`http://localhost:5173/`** in your browser.

### 3. Build Production Bundle
```bash
npm run build
```

---

## 📄 License & Hackathon Notice
Created for the Hackathon Pitch & Dealmaking Exchange. All modular assets are licensed for team trading under MIT standards.
