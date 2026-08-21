import Dexie, { type Table } from 'dexie';
import type { 
  Product, 
  Customer, 
  LedgerEntry, 
  PurchaseOrder, 
  Bill, 
  Supplier, 
  SyncMutation,
  WorkerProfile,
  SalaryRecord,
  FestivalItem,
  WorkerNotification
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_CUSTOMERS, 
  INITIAL_LEDGER, 
  INITIAL_PURCHASE_ORDERS, 
  INITIAL_SUPPLIERS,
  INITIAL_WORKERS,
  INITIAL_SALARY_RECORDS,
  INITIAL_FESTIVALS,
  INITIAL_WORKER_NOTIFICATIONS
} from './mockData';

class DukaanDexieDB extends Dexie {
  products!: Table<Product, string>;
  customers!: Table<Customer, string>;
  ledger!: Table<LedgerEntry, string>;
  purchaseOrders!: Table<PurchaseOrder, string>;
  bills!: Table<Bill, string>;
  suppliers!: Table<Supplier, string>;

  // Worker & Festival Management Tables
  workers!: Table<WorkerProfile, string>;
  salaryRecords!: Table<SalaryRecord, string>;
  festivals!: Table<FestivalItem, string>;
  workerNotifications!: Table<WorkerNotification, string>;

  constructor() {
    super('DukaanOfflineDB');
    this.version(2).stores({
      products: 'id, name, category, barcode, stockQty',
      customers: 'id, name, phone, riskScore',
      ledger: 'id, customerId, date, type',
      purchaseOrders: 'id, poNumber, supplierId, status',
      bills: 'id, billNumber, date, paymentMode',
      suppliers: 'id, name, category',
      workers: 'id, workerId, name, designation, status',
      salaryRecords: 'id, workerId, month, year, paymentStatus',
      festivals: 'id, name, date, month, year',
      workerNotifications: 'id, scheduledDate, notificationType'
    });
  }
}

const db = new DukaanDexieDB();

export class PouchStoreManager {
  private static instance: PouchStoreManager;
  private isOnline: boolean = true;
  private networkMode: 'Online' | 'Low-Bandwidth (2G)' | 'Offline' = 'Online';
  private pendingMutations: SyncMutation[] = [];
  private listeners: Array<() => void> = [];

  private constructor() {
    this.initDatabase();
    this.setupNetworkListeners();
  }

  public static getInstance(): PouchStoreManager {
    if (!PouchStoreManager.instance) {
      PouchStoreManager.instance = new PouchStoreManager();
    }
    return PouchStoreManager.instance;
  }

  private async initDatabase() {
    try {
      const prodCount = await db.products.count();
      if (prodCount === 0) {
        await db.products.bulkAdd(INITIAL_PRODUCTS);
      } else {
        const existingProds = await db.products.toArray();
        for (const p of INITIAL_PRODUCTS) {
          if (!existingProds.some(ep => ep.id === p.id)) {
            await db.products.put(p);
          }
        }
      }

      const custCount = await db.customers.count();
      if (custCount === 0) {
        await db.customers.bulkAdd(INITIAL_CUSTOMERS);
      } else {
        const existingCusts = await db.customers.toArray();
        for (const c of INITIAL_CUSTOMERS) {
          if (!existingCusts.some(ec => ec.id === c.id)) {
            await db.customers.put(c);
          }
        }
      }

      const ledCount = await db.ledger.count();
      if (ledCount === 0) {
        await db.ledger.bulkAdd(INITIAL_LEDGER);
      }

      const poCount = await db.purchaseOrders.count();
      if (poCount === 0) {
        await db.purchaseOrders.bulkAdd(INITIAL_PURCHASE_ORDERS);
      }

      const suppCount = await db.suppliers.count();
      if (suppCount === 0) {
        await db.suppliers.bulkAdd(INITIAL_SUPPLIERS);
      }

      const wCount = await db.workers.count();
      if (wCount === 0) {
        await db.workers.bulkAdd(INITIAL_WORKERS);
      }

      const salCount = await db.salaryRecords.count();
      if (salCount === 0) {
        await db.salaryRecords.bulkAdd(INITIAL_SALARY_RECORDS);
      }

      const festCount = await db.festivals.count();
      if (festCount === 0) {
        await db.festivals.bulkAdd(INITIAL_FESTIVALS);
      }

      const notifCount = await db.workerNotifications.count();
      if (notifCount === 0) {
        await db.workerNotifications.bulkAdd(INITIAL_WORKER_NOTIFICATIONS);
      }
    } catch (err) {
      console.error('Dexie DB Initialization Error:', err);
    }
  }

  private setupNetworkListeners() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleNetworkChange(true));
      window.addEventListener('offline', () => this.handleNetworkChange(false));
      this.isOnline = navigator.onLine;
    }
  }

  private handleNetworkChange(online: boolean) {
    this.isOnline = online;
    this.networkMode = online ? 'Online' : 'Offline';
    if (online) {
      this.flushMutationQueue();
    }
    this.notifyListeners();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  public setNetworkMode(mode: 'Online' | 'Low-Bandwidth (2G)' | 'Offline') {
    this.networkMode = mode;
    this.isOnline = mode !== 'Offline';
    if (this.isOnline) {
      this.flushMutationQueue();
    }
    this.notifyListeners();
  }

  public setNetworkSimulatorMode(mode: 'Online' | 'Low-Bandwidth (2G)' | 'Offline') {
    this.setNetworkMode(mode);
  }

  public syncPendingMutations() {
    this.flushMutationQueue();
  }

  public getNetworkStatus() {
    return {
      isOnline: this.isOnline,
      networkMode: this.networkMode,
      pendingCount: this.pendingMutations.length,
      mutations: this.pendingMutations
    };
  }

  private queueMutation(entityType: any, action: 'CREATE' | 'UPDATE' | 'DELETE', payload: any) {
    const mutation: SyncMutation = {
      id: `mut-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      entityType,
      action,
      payload,
      timestamp: new Date().toISOString(),
      status: this.isOnline ? 'synced' : 'queued'
    };

    if (!this.isOnline) {
      this.pendingMutations.push(mutation);
    }
    this.notifyListeners();
  }

  private async flushMutationQueue() {
    if (this.pendingMutations.length === 0) return;
    this.pendingMutations = [];
    this.notifyListeners();
  }

  // PRODUCTS
  public async getProducts(): Promise<Product[]> {
    try {
      const res = await db.products.toArray();
      return res.length > 0 ? res : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  }

  public async saveProduct(product: Product): Promise<void> {
    try {
      const existing = await db.products.get(product.id);
      await db.products.put(product);
      this.queueMutation('inventory', existing ? 'UPDATE' : 'CREATE', product);
    } catch (err) {
      console.error('Product save error:', err);
    }
    this.notifyListeners();
  }

  // CUSTOMERS
  public async getCustomers(): Promise<Customer[]> {
    try {
      const res = await db.customers.toArray();
      return res.length > 0 ? res : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  }

  public async saveCustomer(customer: Customer): Promise<void> {
    try {
      const existing = await db.customers.get(customer.id);
      await db.customers.put(customer);
      this.queueMutation('ledger', existing ? 'UPDATE' : 'CREATE', customer);
    } catch (err) {
      console.error('Customer save error:', err);
    }
    this.notifyListeners();
  }

  // LEDGER
  public async getLedgerEntries(): Promise<LedgerEntry[]> {
    try {
      const res = await db.ledger.toArray();
      return res.length > 0 ? res : INITIAL_LEDGER;
    } catch {
      return INITIAL_LEDGER;
    }
  }

  public async addLedgerEntry(entry: LedgerEntry): Promise<void> {
    try {
      const syncState = this.isOnline ? ('synced' as const) : ('pending' as const);
      const record: LedgerEntry = { ...entry, syncStatus: syncState };
      await db.ledger.put(record);

      const customers = await this.getCustomers();
      const targetCustomer = customers.find(c => c.id === entry.customerId);
      if (targetCustomer) {
        const delta = entry.type === 'udhaar' ? entry.amount : -entry.amount;
        const newBal = targetCustomer.currentBalance + delta;
        const newRisk = newBal > targetCustomer.creditLimit ? 'High' : newBal > (targetCustomer.creditLimit * 0.7) ? 'Medium' : 'Low';
        await this.saveCustomer({
          ...targetCustomer,
          currentBalance: newBal,
          riskScore: newRisk,
          lastTransactionDate: new Date().toISOString().split('T')[0]
        });
      }

      this.queueMutation('ledger', 'CREATE', record);
    } catch (err) {
      console.error('Ledger entry save error:', err);
    }
    this.notifyListeners();
  }

  // PURCHASE ORDERS & SUPPLIERS
  public async getPurchaseOrders(): Promise<PurchaseOrder[]> {
    try {
      const res = await db.purchaseOrders.toArray();
      return res.length > 0 ? res : INITIAL_PURCHASE_ORDERS;
    } catch {
      return INITIAL_PURCHASE_ORDERS;
    }
  }

  public async savePurchaseOrder(po: PurchaseOrder): Promise<void> {
    try {
      const existing = await db.purchaseOrders.get(po.id);
      const record: PurchaseOrder = { ...po, syncStatus: this.isOnline ? ('synced' as const) : ('pending' as const) };
      await db.purchaseOrders.put(record);
      this.queueMutation('po', existing ? 'UPDATE' : 'CREATE', record);
    } catch (err) {
      console.error('Purchase Order save error:', err);
    }
    this.notifyListeners();
  }

  public async getSuppliers(): Promise<Supplier[]> {
    try {
      const res = await db.suppliers.toArray();
      return res.length > 0 ? res : INITIAL_SUPPLIERS;
    } catch {
      return INITIAL_SUPPLIERS;
    }
  }

  // BILLS
  public async getBills(): Promise<Bill[]> {
    try {
      return await db.bills.toArray();
    } catch {
      return [];
    }
  }

  public async saveBill(bill: Bill): Promise<void> {
    try {
      const record: Bill = { ...bill, syncStatus: this.isOnline ? ('synced' as const) : ('pending' as const) };
      await db.bills.put(record);

      const products = await this.getProducts();
      for (const item of bill.items) {
        const prod = products.find(p => p.id === item.product.id);
        if (prod) {
          await this.saveProduct({
            ...prod,
            stockQty: Math.max(0, prod.stockQty - item.quantity)
          });
        }
      }

      if (bill.paymentMode === 'Khata' && bill.customerId) {
        await this.addLedgerEntry({
          id: `led-${Date.now()}`,
          customerId: bill.customerId,
          customerName: bill.customerName || 'Khata Customer',
          date: bill.date,
          type: 'udhaar',
          amount: bill.total,
          note: `POS Bill #${bill.billNumber}`,
          billId: bill.id,
          syncStatus: 'synced'
        });
      }

      this.queueMutation('bill', 'CREATE', record);
    } catch (err) {
      console.error('Bill save error:', err);
    }
    this.notifyListeners();
  }

  // WORKERS MANAGEMENT
  public async getWorkers(): Promise<WorkerProfile[]> {
    try {
      const res = await db.workers.toArray();
      return res.length > 0 ? res : INITIAL_WORKERS;
    } catch {
      return INITIAL_WORKERS;
    }
  }

  public async saveWorker(worker: WorkerProfile): Promise<void> {
    try {
      await db.workers.put(worker);
    } catch (err) {
      console.error('Worker save error:', err);
    }
    this.notifyListeners();
  }

  public async deleteWorker(workerId: string): Promise<void> {
    try {
      await db.workers.delete(workerId);
    } catch (err) {
      console.error('Worker delete error:', err);
    }
    this.notifyListeners();
  }

  // SALARY & PAYROLL
  public async getSalaryRecords(): Promise<SalaryRecord[]> {
    try {
      const res = await db.salaryRecords.toArray();
      return res.length > 0 ? res : INITIAL_SALARY_RECORDS;
    } catch {
      return INITIAL_SALARY_RECORDS;
    }
  }

  public async saveSalaryRecord(record: SalaryRecord): Promise<void> {
    try {
      await db.salaryRecords.put(record);
    } catch (err) {
      console.error('Salary Record save error:', err);
    }
    this.notifyListeners();
  }

  public async markSalaryPaid(recordId: string, paymentMode: 'Cash' | 'UPI' | 'Bank Transfer'): Promise<void> {
    try {
      const rec = await db.salaryRecords.get(recordId);
      if (rec) {
        await db.salaryRecords.put({
          ...rec,
          paymentStatus: 'Paid',
          paymentDate: new Date().toISOString().split('T')[0],
          paymentMode
        });
      }
    } catch (err) {
      console.error('Mark salary paid error:', err);
    }
    this.notifyListeners();
  }

  // FESTIVALS
  public async getFestivals(): Promise<FestivalItem[]> {
    try {
      const res = await db.festivals.toArray();
      return res.length > 0 ? res : INITIAL_FESTIVALS;
    } catch {
      return INITIAL_FESTIVALS;
    }
  }

  public async saveFestival(festival: FestivalItem): Promise<void> {
    try {
      await db.festivals.put(festival);
    } catch (err) {
      console.error('Festival save error:', err);
    }
    this.notifyListeners();
  }

  // WORKER NOTIFICATIONS
  public async getWorkerNotifications(): Promise<WorkerNotification[]> {
    try {
      const res = await db.workerNotifications.toArray();
      return res.length > 0 ? res : INITIAL_WORKER_NOTIFICATIONS;
    } catch {
      return INITIAL_WORKER_NOTIFICATIONS;
    }
  }
}

export const pouchStore = PouchStoreManager.getInstance();
