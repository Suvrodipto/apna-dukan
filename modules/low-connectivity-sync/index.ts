import type { SyncMutationPayload, NetworkState } from './types';

export * from './types';

export class StandaloneSyncManager {
  private static instance: StandaloneSyncManager;
  private isOnline: boolean = true;
  private networkMode: 'Online' | 'Low-Bandwidth (2G)' | 'Offline' = 'Online';
  private pendingQueue: SyncMutationPayload[] = [];

  private constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleNetwork(true));
      window.addEventListener('offline', () => this.handleNetwork(false));
    }
  }

  public static getInstance(): StandaloneSyncManager {
    if (!StandaloneSyncManager.instance) {
      StandaloneSyncManager.instance = new StandaloneSyncManager();
    }
    return StandaloneSyncManager.instance;
  }

  private handleNetwork(online: boolean) {
    this.isOnline = online;
    this.networkMode = online ? 'Online' : 'Offline';
    if (online) {
      this.flushQueue();
    }
  }

  public queueMutation(entityType: any, action: 'CREATE' | 'UPDATE' | 'DELETE', payload: any): SyncMutationPayload {
    const mutation: SyncMutationPayload = {
      id: `mut-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      entityType,
      action,
      payload,
      timestamp: new Date().toISOString(),
      status: this.isOnline ? 'synced' : 'queued'
    };

    if (!this.isOnline) {
      this.pendingQueue.push(mutation);
    }
    return mutation;
  }

  public flushQueue() {
    this.pendingQueue = [];
  }

  public getNetworkState(): NetworkState {
    return {
      isOnline: this.isOnline,
      networkMode: this.networkMode,
      pendingCount: this.pendingQueue.length,
      mutations: this.pendingQueue
    };
  }
}
