import axios, { AxiosError } from 'axios';
import type { VercelRequest, VercelResponse } from '@vercel/node';

interface OpenDartResponse {
  status: string;
  message: string;
  list: Array<{
    rcept_no: string;
    bsns_year: string;
    stock_code: string;
    reprt_code: string;
    account_nm: string;
    fs_div: string;
    fs_nm: string;
    sj_div: string;
    sj_nm: string;
    thstrm_nm: string;
    thstrm_dt: string;
    thstrm_amount: number;
    thstrm_add_amount?: number;
    frmtrm_nm: string;
    frmtrm_dt: string;
    frmtrm_amount: number;
    frmtrm_add_amount?: number;
    bfefrmtrm_nm?: string;
    bfefrmtrm_dt?: string;
    bfefrmtrm_amount?: number;
    ord: string;
    currency: string;
  }>;
}

const OPENDART_API_URL = 'https://opendart.fss.or.kr/api/fnlttSinglAcnt.json';
const API_KEY = process.env.OPENDART_API_KEY;

const ERROR_CODES: Record<string, string> = {
  '000': '정상',
  '010': '등록되지 않은 키입니다',
  '011': '사용할 수 없는 키입니다',
  '012': '접근할 수 없는 IP입니다',
  '013': '조회된 데이터가 없습니다',
  '014': '파일이 존재하지 않습니다',
  '020': '요청 제한을 초과하였습니다',
  '021': '조회 가능한 회사 개수가 초과하였습니다',
  '100': '필드의 부적절한 값입니다',
  '101': '부적절한 접근입니다',
  '800': '시스템 점검으로 인한 서비스가 중지 중입니다',
  '900': '정의되지 않은 오류가 발생하였습니다',
  '901': '사용자 계정의 개인정보 보유기간이 만료되었습니다',
};

async function fetchFromOpenDart(
  corpCode: string,
  bsnsYear: string,
  reprtCode: string,
  retries = 3
): Promise<OpenDartResponse> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await axios.get(OPENDART_API_URL, {
        params: {
          crtfc_key: API_KEY,
          corp_code: corpCode,
          bsns_year: bsnsYear,
          reprt_code: reprtCode,
        },
        timeout: 10000,
      });

      const data = response.data as OpenDartResponse;

      if (data.status !== '000') {
        const errorMessage =
          ERROR_CODES[data.status] || `오류 코드: ${data.status}`;
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      const isLastAttempt = attempt === retries - 1;

      if (isLastAttempt) {
        throw error;
      }

      // 재시도 전 대기 (exponential backoff)
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error('Failed to fetch data from OpenDart');
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,OPTIONS,PATCH,DELETE,POST,PUT'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { corp_code, bsns_year, reprt_code } = req.query;

  if (!corp_code || !bsns_year || !reprt_code) {
    return res.status(400).json({
      error: 'Missing required parameters',
      required: ['corp_code', 'bsns_year', 'reprt_code'],
    });
  }

  if (!API_KEY) {
    return res.status(500).json({
      error: 'API key not configured',
    });
  }

  try {
    const data = await fetchFromOpenDart(
      String(corp_code),
      String(bsns_year),
      String(reprt_code)
    );

    // 필요한 데이터만 필터링 및 정제
    const processedList = data.list
      .filter((item) => item.thstrm_amount || item.frmtrm_amount)
      .map((item) => ({
        ...item,
        thstrm_amount: item.thstrm_amount || 0,
        frmtrm_amount: item.frmtrm_amount || 0,
      }));

    res.status(200).json({
      status: data.status,
      message: data.message,
      list: processedList,
    });
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorMessage =
      axiosError.message ||
      ERROR_CODES[(error as any)?.status] ||
      'Unknown error occurred';

    console.error('OpenDart API Error:', errorMessage);

    res.status(500).json({
      error: 'Failed to fetch financial data',
      message: errorMessage,
    });
  }
}

