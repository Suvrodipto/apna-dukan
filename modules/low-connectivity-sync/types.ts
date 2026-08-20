export interface SyncMutationPayload {
  id: string;
  entityType: 'ledger' | 'inventory' | 'bill' | 'po' | 'worker';
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  payload: any;
  timestamp: string;
  status: 'queued' | 'syncing' | 'synced' | 'conflict';
  conflictDetails?: {
    localVersion: any;
    remoteVersion: any;
  };
}

export interface NetworkState {
  isOnline: boolean;
  networkMode: 'Online' | 'Low-Bandwidth (2G)' | 'Offline';
  pendingCount: number;
  mutations: SyncMutationPayload[];
}
