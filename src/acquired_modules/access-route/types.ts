export type UserRole = 'owner' | 'cashier' | 'supplier' | 'delivery';

export interface DeliveryPoint {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  orderValue: number;
  priority: 'HIGH' | 'NORMAL' | 'LOW';
}

export interface RouteOptimizationResult {
  totalDistanceKm: number;
  estimatedTimeMins: number;
  fuelCostSavingsRs: number;
  optimizedWaypoints: DeliveryPoint[];
  efficiencyScorePercent: number;
}

export interface AccessPermission {
  moduleName: string;
  canRead: boolean;
  canWrite: boolean;
  canDelete: boolean;
  canExport: boolean;
}

export interface RoleAccessMatrix {
  role: UserRole;
  permissions: AccessPermission[];
}
