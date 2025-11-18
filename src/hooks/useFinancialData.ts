import { useState, useCallback } from 'react';
import axios from 'axios';
import type { FinancialAccount, FinancialSummary } from '../types';

interface UseFinancialDataReturn {
  data: FinancialSummary | null;
  previousData: FinancialSummary | null;
  loading: boolean;
  error: string | null;
  fetchData: (corpCode: string, year: string, reportCode: string) => Promise<void>;
}

function extractFinancialSummary(accounts: FinancialAccount[]): FinancialSummary {
  // 주요 계정명으로 데이터 추출
  const accountMap = new Map<string, FinancialAccount>();
  
  accounts.forEach((account) => {
    accountMap.set(account.account_nm, account);
  });

  // 부채와 자본을 찾아서 자산 계산 (자산 = 부채 + 자본)
  const totalLiabilities = accountMap.get('부채총계')?.thstrm_amount || 
                           accountMap.get('유동부채')?.thstrm_amount || 0;
  const totalEquity = accountMap.get('자본총계')?.thstrm_amount ||
                      accountMap.get('주주자본')?.thstrm_amount || 0;
  const totalAssets = (accountMap.get('자산총계')?.thstrm_amount || 
                       totalLiabilities + totalEquity) || 0;

  const revenue = accountMap.get('매출액')?.thstrm_amount ||
                  accountMap.get('영업수익')?.thstrm_amount || 0;
  const operatingProfit = accountMap.get('영업이익')?.thstrm_amount ||
                          accountMap.get('영업이익(손실)')?.thstrm_amount || 0;
  const netProfit = accountMap.get('당기순이익')?.thstrm_amount ||
                    accountMap.get('당기순이익(손실)')?.thstrm_amount || 0;

  const firstAccount = accounts[0];
  const year = firstAccount?.bsns_year || new Date().getFullYear().toString();

  return {
    year,
    revenue,
    operatingProfit,
    netProfit,
    totalAssets,
    totalLiabilities,
    totalEquity,
  };
}

export function useFinancialData(): UseFinancialDataReturn {
  const [data, setData] = useState<FinancialSummary | null>(null);
  const [previousData, setPreviousData] = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (corpCode: string, year: string, reportCode: string) => {
      setLoading(true);
      setError(null);

      try {
        // 개발 환경에서는 Mock 데이터 사용
        if (import.meta.env.DEV) {
          // Mock 데이터
          const mockData: FinancialSummary = {
            year,
            revenue: 280000000000000,
            operatingProfit: 50000000000000,
            netProfit: 40000000000000,
            totalAssets: 370000000000000,
            totalLiabilities: 120000000000000,
            totalEquity: 250000000000000,
          };

          const mockPreviousData: FinancialSummary = {
            year: (parseInt(year) - 1).toString(),
            revenue: 260000000000000,
            operatingProfit: 45000000000000,
            netProfit: 35000000000000,
            totalAssets: 350000000000000,
            totalLiabilities: 110000000000000,
            totalEquity: 240000000000000,
          };

          setData(mockData);
          setPreviousData(mockPreviousData);
          console.log('📊 Mock 데이터 로드됨 (개발 환경)');
        } else {
          // 프로덕션에서는 실제 API 사용
          const currentResponse = await axios.get('/api/financial-data', {
            params: {
              corp_code: corpCode,
              bsns_year: year,
              reprt_code: reportCode,
            },
          });

          if (currentResponse.data.status !== '000') {
            throw new Error(
              currentResponse.data.message || '데이터 조회에 실패했습니다'
            );
          }

          const currentSummary = extractFinancialSummary(
            currentResponse.data.list as FinancialAccount[]
          );
          setData(currentSummary);

          // 전년도 데이터 조회 (선택사항)
          try {
            const previousYear = (parseInt(year) - 1).toString();
            const previousResponse = await axios.get('/api/financial-data', {
              params: {
                corp_code: corpCode,
                bsns_year: previousYear,
                reprt_code: reportCode,
              },
            });

            if (previousResponse.data.status === '000') {
              const previousSummary = extractFinancialSummary(
                previousResponse.data.list as FinancialAccount[]
              );
              setPreviousData(previousSummary);
            }
          } catch {
            // 전년도 데이터가 없을 수 있으므로 무시
            console.debug('전년도 데이터를 찾을 수 없습니다');
          }
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : '데이터 조회 중 오류가 발생했습니다';
        setError(errorMessage);
        console.error('Financial data fetch error:', err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { data, previousData, loading, error, fetchData };
}

