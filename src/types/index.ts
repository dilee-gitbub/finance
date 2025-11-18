// Company Types
export interface Company {
  corp_code: string;
  corp_name: string;
  corp_eng_name: string;
  stock_code: string;
  modify_date: string;
}

// Financial Data Types
export interface FinancialAccount {
  rcept_no: string;
  bsns_year: string;
  stock_code: string;
  reprt_code: string;
  account_nm: string;
  fs_div: 'OFS' | 'CFS'; // OFS: 개별, CFS: 연결
  fs_nm: string;
  sj_div: 'BS' | 'IS'; // BS: 재무상태표, IS: 손익계산서
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
}

export interface FinancialDataResponse {
  result: {
    status: string;
    message: string;
    list: FinancialAccount[];
  };
}

// Summary Types
export interface FinancialSummary {
  year: string;
  revenue: number;
  operatingProfit: number;
  netProfit: number;
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
}

export interface AIAnalysis {
  summary: string;
  profitability: string;
  solvency: string;
  warnings: string[];
}

// API Request/Response Types
export interface ApiError {
  status: string;
  message: string;
}

export interface SearchResult {
  companies: Company[];
}

