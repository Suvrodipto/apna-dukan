import type { MetricSummaryCard, CategorySalesBreakdown, MonthlyRevenueDataPoint } from './types';

export * from './types';

export function calculateExecutiveDashboardMetrics(totalSales: number, totalBills: number): MetricSummaryCard[] {
  const averageOrderValue = totalBills > 0 ? Math.round(totalSales / totalBills) : 0;

  return [
    {
      title: 'Total Sales Revenue',
      value: `₹${totalSales.toLocaleString()}`,
      trendPercentage: 14.5,
      trendDirection: 'up',
      subtitle: 'vs previous month'
    },
    {
      title: 'Total Bills Issued',
      value: totalBills,
      trendPercentage: 8.2,
      trendDirection: 'up',
      subtitle: 'POS Transactions'
    },
    {
      title: 'Average Order Value (AOV)',
      value: `₹${averageOrderValue}`,
      trendPercentage: 5.1,
      trendDirection: 'up',
      subtitle: 'Basket Size'
    }
  ];
}

export function getSampleMonthlyRevenueSeries(): MonthlyRevenueDataPoint[] {
  return [
    { month: 'May', revenue: 145000, expenses: 110000, netProfit: 35000 },
    { month: 'Jun', revenue: 168000, expenses: 122000, netProfit: 46000 },
    { month: 'Jul', revenue: 185000, expenses: 130000, netProfit: 55000 },
    { month: 'Aug', revenue: 210000, expenses: 142000, netProfit: 68000 }
  ];
}
