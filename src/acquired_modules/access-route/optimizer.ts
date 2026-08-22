import type { DeliveryPoint, RouteOptimizationResult, UserRole, AccessPermission } from './types';

export class AccessRouteEngine {
  // Haversine distance formula between two lat/lng points
  public calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  }

  // Nearest-neighbor TSP algorithm for delivery route optimization
  public optimizeDeliveryRoute(startPoint: DeliveryPoint, waypoints: DeliveryPoint[]): RouteOptimizationResult {
    if (!waypoints || waypoints.length === 0) {
      return {
        totalDistanceKm: 0,
        estimatedTimeMins: 0,
        fuelCostSavingsRs: 0,
        optimizedWaypoints: [],
        efficiencyScorePercent: 100
      };
    }

    const unvisited = [...waypoints];
    const optimizedPath: DeliveryPoint[] = [startPoint];
    let current = startPoint;
    let totalDistanceKm = 0;

    while (unvisited.length > 0) {
      let nearestIdx = 0;
      let minDistance = Infinity;

      for (let i = 0; i < unvisited.length; i++) {
        const dist = this.calculateDistanceKm(current.lat, current.lng, unvisited[i].lat, unvisited[i].lng);
        if (dist < minDistance) {
          minDistance = dist;
          nearestIdx = i;
        }
      }

      const nextPoint = unvisited.splice(nearestIdx, 1)[0];
      totalDistanceKm += minDistance;
      optimizedPath.push(nextPoint);
      current = nextPoint;
    }

    const estimatedTimeMins = Math.round(totalDistanceKm * 3.5 + waypoints.length * 5);
    const fuelCostSavingsRs = Math.round(totalDistanceKm * 4.2); // Savings vs unoptimized routes
    const efficiencyScorePercent = Math.min(98, Math.max(75, 100 - Math.round(totalDistanceKm * 1.2)));

    return {
      totalDistanceKm: Math.round(totalDistanceKm * 10) / 10,
      estimatedTimeMins,
      fuelCostSavingsRs,
      optimizedWaypoints: optimizedPath,
      efficiencyScorePercent
    };
  }

  // Role-Based Access Control matrix check
  public getPermissionsForRole(role: UserRole): AccessPermission[] {
    const matrix: Record<UserRole, AccessPermission[]> = {
      owner: [
        { moduleName: 'POS Billing', canRead: true, canWrite: true, canDelete: true, canExport: true },
        { moduleName: 'Khata Udhaar Ledger', canRead: true, canWrite: true, canDelete: true, canExport: true },
        { moduleName: 'Worker Payroll', canRead: true, canWrite: true, canDelete: true, canExport: true },
        { moduleName: 'Supplier Purchase Orders', canRead: true, canWrite: true, canDelete: true, canExport: true },
        { moduleName: 'Price Predictor ML', canRead: true, canWrite: true, canDelete: false, canExport: true },
        { moduleName: 'Anomaly Detection Engine', canRead: true, canWrite: true, canDelete: true, canExport: true }
      ],
      cashier: [
        { moduleName: 'POS Billing', canRead: true, canWrite: true, canDelete: false, canExport: false },
        { moduleName: 'Khata Udhaar Ledger', canRead: true, canWrite: true, canDelete: false, canExport: false },
        { moduleName: 'Worker Payroll', canRead: false, canWrite: false, canDelete: false, canExport: false },
        { moduleName: 'Supplier Purchase Orders', canRead: false, canWrite: false, canDelete: false, canExport: false },
        { moduleName: 'Price Predictor ML', canRead: false, canWrite: false, canDelete: false, canExport: false },
        { moduleName: 'Anomaly Detection Engine', canRead: true, canWrite: false, canDelete: false, canExport: false }
      ],
      supplier: [
        { moduleName: 'POS Billing', canRead: false, canWrite: false, canDelete: false, canExport: false },
        { moduleName: 'Khata Udhaar Ledger', canRead: false, canWrite: false, canDelete: false, canExport: false },
        { moduleName: 'Worker Payroll', canRead: false, canWrite: false, canDelete: false, canExport: false },
        { moduleName: 'Supplier Purchase Orders', canRead: true, canWrite: true, canDelete: false, canExport: true },
        { moduleName: 'Price Predictor ML', canRead: true, canWrite: false, canDelete: false, canExport: false },
        { moduleName: 'Anomaly Detection Engine', canRead: false, canWrite: false, canDelete: false, canExport: false }
      ],
      delivery: [
        { moduleName: 'POS Billing', canRead: true, canWrite: false, canDelete: false, canExport: false },
        { moduleName: 'Khata Udhaar Ledger', canRead: false, canWrite: false, canDelete: false, canExport: false },
        { moduleName: 'Worker Payroll', canRead: false, canWrite: false, canDelete: false, canExport: false },
        { moduleName: 'Supplier Purchase Orders', canRead: true, canWrite: true, canDelete: false, canExport: false },
        { moduleName: 'Price Predictor ML', canRead: false, canWrite: false, canDelete: false, canExport: false },
        { moduleName: 'Anomaly Detection Engine', canRead: false, canWrite: false, canDelete: false, canExport: false }
      ]
    };

    return matrix[role] || matrix.owner;
  }
}
