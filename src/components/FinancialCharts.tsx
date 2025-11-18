import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { FinancialSummary } from '../types';
import { formatCurrency } from '../utils/format';

interface FinancialChartsProps {
  current: FinancialSummary;
  previous?: FinancialSummary;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

function formatTooltipValue(value: number) {
  return [formatCurrency(Math.round(value / 100000000)), '억 원'];
}

export function FinancialCharts({ current, previous }: FinancialChartsProps) {
  // 연도별 비교 데이터
  const comparisonData = [];
  if (previous) {
    comparisonData.push({
      year: `${previous.year}년`,
      매출액: previous.revenue / 100000000,
      영업이익: previous.operatingProfit / 100000000,
      순이익: previous.netProfit / 100000000,
    });
  }
  comparisonData.push({
    year: `${current.year}년`,
    매출액: current.revenue / 100000000,
    영업이익: current.operatingProfit / 100000000,
    순이익: current.netProfit / 100000000,
  });

  // 자산 구성 데이터 (파이 차트)
  const assetCompositionData = [
    {
      name: '자본',
      value: current.totalEquity / 100000000,
    },
    {
      name: '부채',
      value: current.totalLiabilities / 100000000,
    },
  ].filter((item) => item.value > 0);

  return (
    <div className="w-full space-y-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        재무 데이터 시각화
      </h2>

      {/* 막대 차트: 연도별 비교 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
          매출액 / 이익 추이
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="year" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              formatter={(value) => formatTooltipValue(value as number)}
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff',
              }}
            />
            <Legend />
            <Bar dataKey="매출액" fill="#6366f1" />
            <Bar dataKey="영업이익" fill="#10b981" />
            <Bar dataKey="순이익" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 파이 차트: 자산 구성 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
          자산 구성 (억 원)
        </h3>
        {assetCompositionData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={assetCompositionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent = 0 }) =>
                  `${name}: ${(value as number).toFixed(0)}억 원 (${(percent * 100).toFixed(1)}%)`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {assetCompositionData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${(value as number).toFixed(0)}억 원`, '금액']}
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
            자산 구성 데이터가 없습니다
          </div>
        )}
      </div>

      {/* 재무 비율 요약 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
          <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase mb-1">
            부채 비율
          </div>
          <div className="text-xl font-bold text-blue-900 dark:text-blue-100">
            {current.totalAssets > 0
              ? ((current.totalLiabilities / current.totalAssets) * 100).toFixed(1)
              : '0'}
            %
          </div>
          <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
            {current.totalLiabilities > 0 ? '부채가 있음' : '무차입'}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-lg p-4 border border-green-200 dark:border-green-700">
          <div className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase mb-1">
            순이익률
          </div>
          <div className="text-xl font-bold text-green-900 dark:text-green-100">
            {current.revenue > 0
              ? ((current.netProfit / current.revenue) * 100).toFixed(1)
              : '0'}
            %
          </div>
          <div className="text-xs text-green-700 dark:text-green-300 mt-1">
            매출대비 순이익
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
          <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase mb-1">
            자기자본비율
          </div>
          <div className="text-xl font-bold text-purple-900 dark:text-purple-100">
            {current.totalAssets > 0
              ? ((current.totalEquity / current.totalAssets) * 100).toFixed(1)
              : '0'}
            %
          </div>
          <div className="text-xs text-purple-700 dark:text-purple-300 mt-1">
            자본/총자산
          </div>
        </div>
      </div>
    </div>
  );
}

