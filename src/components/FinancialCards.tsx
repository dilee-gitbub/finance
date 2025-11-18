import type { FinancialSummary } from '../types';
import { formatCurrency, calculateChangePercentage } from '../utils/format';

interface FinancialCardsProps {
  current: FinancialSummary;
  previous?: FinancialSummary;
}

interface CardProps {
  title: string;
  value: number;
  unit?: string;
  changePercent?: number;
}

function Card({ title, value, unit = '억 원', changePercent }: CardProps) {
  const numValue = Number(value) || 0;
  const displayValue = Math.abs(numValue) > 1000 ? (numValue / 1000000).toFixed(1) : numValue.toFixed(0);
  const displayUnit = Math.abs(numValue) > 1000 ? '조 원' : unit;

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
        {title}
      </h3>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(Number(displayValue))}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {displayUnit}
          </div>
        </div>
        {changePercent !== undefined && changePercent !== 0 && (
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded ${
              changePercent > 0
                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
            }`}
          >
            <span className="text-lg">
              {changePercent > 0 ? '▲' : '▼'}
            </span>
            <span className="text-sm font-semibold">
              {Math.abs(changePercent).toFixed(1)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export function FinancialCards({ current, previous }: FinancialCardsProps) {
  const calculateChange = (currentVal: number, previousVal?: number) => {
    if (!previousVal || previousVal === 0) return undefined;
    return calculateChangePercentage(currentVal, previousVal);
  };

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        주요 재무 지표
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card
          title="총 자산"
          value={current.totalAssets}
          changePercent={calculateChange(current.totalAssets, previous?.totalAssets)}
        />
        <Card
          title="총 부채"
          value={current.totalLiabilities}
          changePercent={calculateChange(current.totalLiabilities, previous?.totalLiabilities)}
        />
        <Card
          title="총 자본"
          value={current.totalEquity}
          changePercent={calculateChange(current.totalEquity, previous?.totalEquity)}
        />
        <Card
          title="매출액"
          value={current.revenue}
          changePercent={calculateChange(current.revenue, previous?.revenue)}
        />
        <Card
          title="영업이익"
          value={current.operatingProfit}
          changePercent={calculateChange(current.operatingProfit, previous?.operatingProfit)}
        />
        <Card
          title="순이익"
          value={current.netProfit}
          changePercent={calculateChange(current.netProfit, previous?.netProfit)}
        />
      </div>
    </div>
  );
}

