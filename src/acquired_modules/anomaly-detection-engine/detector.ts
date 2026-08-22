import type { AnomalyResult, AnomalySeverity } from './types';
import { calculateMean, calculateStdDev, calculateZScore } from './statistical';

export class AnomalyDetector {
  private zScoreThreshold: number;

  constructor(zScoreThreshold: number = 2.0) {
    this.zScoreThreshold = zScoreThreshold;
  }

  public evaluate(currentValue: number, history: number[]): AnomalyResult {
    const mean = calculateMean(history);
    const stdDev = calculateStdDev(history, mean);
    const zScore = calculateZScore(currentValue, mean, stdDev);
    const absZ = Math.abs(zScore);

    const isAnomaly = absZ >= this.zScoreThreshold;
    const deviationPercent = mean > 0 ? Math.round(((currentValue - mean) / mean) * 100) : 0;

    let severity: AnomalySeverity = 'LOW';
    let recommendation = 'Normal operations within baseline distribution bounds.';

    if (absZ >= 3.5) {
      severity = 'CRITICAL';
      recommendation = `CRITICAL SPIKE DETECTED (+${deviationPercent}% vs baseline). Immediate manual audit required.`;
    } else if (absZ >= 2.5) {
      severity = 'HIGH';
      recommendation = `High statistical variance detected (Z-score: ${zScore.toFixed(2)}). Review inventory turn rates.`;
    } else if (absZ >= 2.0) {
      severity = 'MEDIUM';
      recommendation = `Moderate anomaly detected (Z-score: ${zScore.toFixed(2)}). Monitor subsequent transaction stream.`;
    }

    return {
      isAnomaly,
      currentValue,
      mean: Math.round(mean * 100) / 100,
      stdDev: Math.round(stdDev * 100) / 100,
      zScore: Math.round(zScore * 100) / 100,
      deviationPercent,
      severity,
      recommendation,
      timestamp: new Date().toLocaleTimeString()
    };
  }
}
