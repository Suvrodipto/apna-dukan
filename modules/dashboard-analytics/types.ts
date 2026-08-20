export interface MetricSummaryCard {
  title: string;
  value: string | number;
  trendPercentage: number;
  trendDirection: 'up' | 'down';
  subtitle: string;
}

export interface CategorySalesBreakdown {
  category: string;
  totalSales: number;
  percentageShare: number;
}

export interface MonthlyRevenueDataPoint {
  month: string;
  revenue: number;
  expenses: number;
  netProfit: number;
}
