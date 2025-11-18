import axios from 'axios';
import type { FinancialDataResponse, AIAnalysis } from '../types';

const API_BASE_URL = import.meta.env.DEV ? 'http://localhost:5173/api' : '/api';

// 재무 데이터 조회
export async function fetchFinancialData(
  corpCode: string,
  bsnsYear: string,
  reprtCode: string
): Promise<FinancialDataResponse> {
  try {
    const response = await axios.get(`${API_BASE_URL}/financial-data`, {
      params: {
        corp_code: corpCode,
        bsns_year: bsnsYear,
        reprt_code: reprtCode,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch financial data:', error);
    throw error;
  }
}

// AI 분석 요청
export async function fetchAIAnalysis(
  corpName: string,
  financialData: Record<string, number>
): Promise<AIAnalysis> {
  try {
    const response = await axios.post(`${API_BASE_URL}/ai-analysis`, {
      corp_name: corpName,
      financial_data: financialData,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch AI analysis:', error);
    throw error;
  }
}

// 회사 목록 조회
export async function fetchCompanyList() {
  try {
    const response = await axios.get('/corp-list.json');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch company list:', error);
    throw error;
  }
}

