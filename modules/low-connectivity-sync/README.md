# 🌐 Universal Low-Connectivity Sync Layer

Standalone, offline-first database synchronization engine built on IndexedDB & PouchDB standards. Enables full offline read/write access, mutation queueing, automatic server catchup, and visual conflict resolution.

## 📦 Features
- **Zero Network Dependency**: Full IndexedDB read/write speed (<5ms).
- **Network Simulator**: Online, Low-Bandwidth (2G), and Offline modes.
- **Out-of-Band Queue**: Automatic delta mutation queue with retry flush on connection recovery.
- **Visual Conflict Resolver**: Side-by-side local vs cloud diff resolution.

## 🚀 Quick Integration

```typescript
import { SyncManager } from './modules/low-connectivity-sync';

const sync = SyncManager.getInstance();
sync.queueMutation('ledger', 'CREATE', { amount: 500 });
```
