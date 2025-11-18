import { useState } from 'react';
import './App.css';
import type { Company } from './types';
import { CompanySearch } from './components/CompanySearch';
import { FinancialSelector } from './components/FinancialSelector';
import { FinancialCards } from './components/FinancialCards';
import { FinancialCharts } from './components/FinancialCharts';
import { AIAnalysis } from './components/AIAnalysis';
import { useFinancialData } from './hooks/useFinancialData';

function App() {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const { data, previousData, loading, error, fetchData } = useFinancialData();

  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company);
  };

  const handleFetchFinancialData = async (
    corpCode: string,
    year: string,
    reportCode: string
  ) => {
    await fetchData(corpCode, year, reportCode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-6 px-4 sm:px-6 lg:px-8">
      {/* 헤더 */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            📊 재무 데이터 분석
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            누구나 쉽게 이해할 수 있는 기업 재무 현황 분석 서비스
          </p>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="max-w-7xl mx-auto">
        {/* 1단계: 회사 검색 */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <CompanySearch onSelectCompany={handleCompanySelect} />
        </div>

        {/* 2단계: 재무 데이터 선택 */}
        {selectedCompany && (
          <div className="mb-8">
            <FinancialSelector
              company={selectedCompany}
              onFetch={handleFetchFinancialData}
              isLoading={loading}
            />
          </div>
        )}

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <h3 className="font-semibold text-red-700 dark:text-red-300 mb-1">
              오류가 발생했습니다
            </h3>
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* 3단계: 재무 데이터 표시 */}
        {data && (
          <div className="space-y-8">
            {/* 카드 */}
            <div>
              <FinancialCards current={data} previous={previousData || undefined} />
            </div>

            {/* 차트 */}
            <div>
              <FinancialCharts current={data} previous={previousData || undefined} />
            </div>

            {/* AI 분석 */}
            {selectedCompany && (
              <div>
                <AIAnalysis corpName={selectedCompany.corp_name} data={data} />
              </div>
            )}
          </div>
        )}

        {/* 로딩 상태 */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin h-12 w-12 border-4 border-secondary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                재무 데이터를 로드 중입니다...
              </p>
            </div>
          </div>
        )}

        {/* 초기 상태 메시지 */}
        {!data && !loading && !error && selectedCompany && (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400">
              <p className="text-lg">
                위에서 조회 설정을 선택한 후 "재무 데이터 조회" 버튼을 클릭하세요.
              </p>
            </div>
          </div>
        )}

        {/* 처음 상태 메시지 */}
        {!selectedCompany && !data && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400">
              <p className="text-lg">회사를 검색하여 시작하세요.</p>
            </div>
          </div>
        )}
      </div>

      {/* 푸터 */}
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          데이터는 OpenDart API를 통해 제공되며, AI 분석은 Google Gemini를 사용합니다.
        </p>
      </div>
    </div>
  );
}

export default App;
