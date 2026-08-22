export function calculateMean(history: number[]): number {
  if (!history || history.length === 0) return 0;
  const sum = history.reduce((acc, val) => acc + val, 0);
  return sum / history.length;
}

export function calculateStdDev(history: number[], mean: number): number {
  if (!history || history.length <= 1) return 1;
  const variance = history.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (history.length - 1);
  return Math.sqrt(variance) || 1;
}

export function calculateZScore(value: number, mean: number, stdDev: number): number {
  if (stdDev === 0) return 0;
  return (value - mean) / stdDev;
}
