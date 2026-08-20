import type { WorkerProfile, SalaryRecord, FestivalItem } from './types';

export * from './types';

export function calculateFestivalBonus(worker: WorkerProfile, festival: FestivalItem): number {
  if (!festival.bonusEnabled || worker.status !== 'Active') return 0;
  if (festival.bonusType === 'Percentage') {
    return Math.round((worker.monthlySalary * festival.bonusValue) / 100);
  }
  return festival.bonusValue;
}

export function generateMonthlySalaryRecord(
  worker: WorkerProfile,
  month: string,
  year: number,
  festivalBonus: number = 0,
  otherBonus: number = 0,
  deductions: number = 0
): SalaryRecord {
  const totalPayable = worker.monthlySalary + festivalBonus + otherBonus - deductions;
  return {
    id: `sal-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
    workerId: worker.id,
    workerName: worker.name,
    month,
    year,
    baseSalary: worker.monthlySalary,
    festivalBonus,
    otherBonus,
    deductions,
    totalPayable: Math.max(0, totalPayable),
    paymentStatus: 'Pending'
  };
}
