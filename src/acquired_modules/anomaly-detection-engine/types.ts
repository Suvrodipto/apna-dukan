export type AnomalySeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface AnomalyResult {
  isAnomaly: boolean;
  currentValue: number;
  mean: number;
  stdDev: number;
  zScore: number;
  deviationPercent: number;
  severity: AnomalySeverity;
  recommendation: string;
  timestamp: string;
}

export interface TelemetryPoint {
  timestamp: string;
  metricName: string;
  value: number;
}
