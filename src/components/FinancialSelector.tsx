import { useState } from 'react';
import type { Company } from '../types';

interface FinancialSelectorProps {
  company: Company | null;
  onFetch: (corpCode: string, year: string, reportCode: string) => void;
  isLoading: boolean;
}

const CURRENT_YEAR = new Date().getFullYear();
const AVAILABLE_YEARS = Array.from({ length: 10 }, (_, i) =>
  (CURRENT_YEAR - i).toString()
);

const REPORT_TYPES = [
  { code: '11011', label: '사업보고서 (연간)' },
  { code: '11012', label: '반기보고서 (상반기)' },
  { code: '11013', label: '1분기보고서' },
  { code: '11014', label: '3분기보고서' },
];

export function FinancialSelector({
  company,
  onFetch,
  isLoading,
}: FinancialSelectorProps) {
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR.toString());
  const [selectedReport, setSelectedReport] = useState('11011');

  const handleFetch = () => {
    if (!company) return;
    onFetch(company.corp_code, selectedYear, selectedReport);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        재무 데이터 조회
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 사업연도 선택 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            사업연도
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            disabled={!company || isLoading}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-secondary"
          >
            {AVAILABLE_YEARS.map((year) => (
              <option key={year} value={year}>
                {year}년
              </option>
            ))}
          </select>
        </div>

        {/* 보고서 유형 선택 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            보고서 유형
          </label>
          <select
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value)}
            disabled={!company || isLoading}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-secondary"
          >
            {REPORT_TYPES.map((report) => (
              <option key={report.code} value={report.code}>
                {report.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 조회 버튼 */}
      <button
        onClick={handleFetch}
        disabled={!company || isLoading}
        className="mt-6 w-full px-6 py-3 bg-secondary hover:bg-secondary/90 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
            데이터 로드 중...
          </div>
        ) : (
          '재무 데이터 조회'
        )}
      </button>
    </div>
  );
}

