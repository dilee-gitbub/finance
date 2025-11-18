import { useState, useEffect, useCallback } from 'react';
import type { Company } from '../types';

interface CompanySearchProps {
  onSelectCompany: (company: Company) => void;
}

export function CompanySearch({ onSelectCompany }: CompanySearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  // 회사 목록 로드
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/corp-list.json');
        const data = await response.json();
        setCompanies(data.list);
      } catch (error) {
        console.error('회사 목록 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCompanies();
  }, []);

  // 검색 로직 (디바운싱)
  const handleSearch = useCallback(
    (value: string) => {
      setSearchTerm(value);

      if (value.trim().length === 0) {
        setFilteredCompanies([]);
        setIsOpen(false);
        return;
      }

      const searchLower = value.toLowerCase();
      const filtered = companies
        .filter(
          (company) =>
            company.corp_name.toLowerCase().includes(searchLower) ||
            company.corp_code.includes(value) ||
            company.stock_code.includes(value)
        )
        .slice(0, 10); // 최대 10개만 표시

      setFilteredCompanies(filtered);
      setIsOpen(true);
    },
    [companies]
  );

  const handleSelectCompany = (company: Company) => {
    setSelectedCompany(company);
    setSearchTerm(company.corp_name);
    setIsOpen(false);
    onSelectCompany(company);
  };

  return (
    <div className="w-full">
      <div className="relative">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            회사 검색
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="회사명, 종목코드, 고유번호로 검색..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => filteredCompanies.length > 0 && setIsOpen(true)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:border-secondary transition-colors"
            />
            {isLoading && (
              <div className="absolute right-3 top-3">
                <div className="animate-spin h-5 w-5 border-2 border-secondary border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>
        </div>

        {/* 검색 결과 드롭다운 */}
        {isOpen && filteredCompanies.length > 0 && (
          <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 dark:border-gray-600 max-h-64 overflow-y-auto">
            {filteredCompanies.map((company) => (
              <button
                key={company.corp_code}
                onClick={() => handleSelectCompany(company)}
                className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-700 last:border-b-0"
              >
                <div className="font-semibold text-gray-900 dark:text-white">
                  {company.corp_name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  고유번호: {company.corp_code} | 종목코드: {company.stock_code}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* 검색 결과 없음 */}
        {isOpen && searchTerm && filteredCompanies.length === 0 && !isLoading && (
          <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 dark:border-gray-600 p-4 text-center text-gray-500 dark:text-gray-400">
            검색 결과가 없습니다.
          </div>
        )}
      </div>

      {/* 선택된 회사 정보 */}
      {selectedCompany && (
        <div className="mt-4 p-4 bg-secondary/10 border-l-4 border-secondary rounded">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            선택된 회사: {selectedCompany.corp_name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            고유번호: <span className="font-mono font-semibold">{selectedCompany.corp_code}</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            종목코드: <span className="font-mono font-semibold">{selectedCompany.stock_code}</span>
          </p>
        </div>
      )}
    </div>
  );
}

