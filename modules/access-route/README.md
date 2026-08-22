# 🗺️ AccessRoute Delivery & RBAC Engine (Standalone Module)

> **HACQUIRE 2026 M&A Acquired Asset #2 (Acquired from Prabh707 for ₹4.20 Cr FED Coins)**

---

## 📌 Problem Solved
Small Kirana stores handling home deliveries and supplier restocks waste time and fuel on unoptimized routes. This engine calculates shortest TSP delivery routes between the central hub, wholesale suppliers, and customer home delivery points using Haversine distance equations, while enforcing Role-Based Access Control (RBAC) security across Owner, Cashier, Supplier, and Delivery staff.

---

## 🚀 Quick Usage Example

```typescript
import { AccessRouteEngine } from './optimizer';

const engine = new AccessRouteEngine();

const startHub = { id: 'hub', name: 'APNA DUKAN Central', lat: 20.3506, lng: 85.8178, orderValue: 0, priority: 'HIGH', address: 'Bhubaneswar' };
const waypoints = [
  { id: '1', name: 'Amul Depot', lat: 20.3200, lng: 85.8500, orderValue: 4800, priority: 'HIGH', address: 'Mancheswar' },
  { id: '2', name: 'Customer Delivery', lat: 20.2700, lng: 85.8200, orderValue: 2450, priority: 'NORMAL', address: 'Unit 6' }
];

const result = engine.optimizeDeliveryRoute(startHub, waypoints);

console.log(result.totalDistanceKm);    // 18.4 km
console.log(result.fuelCostSavingsRs); // ₹77 saved
```

---

## 📄 License
MIT License. Integrated into APNA DUKAN for HACQUIRE 2026.
