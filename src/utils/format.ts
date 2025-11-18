/**
 * 숫자를 한국 원화 형식으로 포맷팅
 * @param amount 금액
 * @returns 포맷된 문자열 (예: "1,234,567,890")
 */
export function formatCurrency(amount: number): string {
  if (amount === null || amount === undefined) {
    return '0';
  }
  return new Intl.NumberFormat('ko-KR').format(Math.round(amount));
}

/**
 * 백만 단위로 숫자 변환
 * @param amount 금액
 * @returns 백만 단위 숫자
 */
export function formatMillions(amount: number): number {
  if (amount === null || amount === undefined) {
    return 0;
  }
  return Math.round(amount / 1000000);
}

/**
 * 백분율 계산
 * @param current 현재 값
 * @param previous 이전 값
 * @returns 증감률 (소수점 2자리)
 */
export function calculateChangePercentage(current: number, previous: number): number {
  if (previous === 0 || previous === null || previous === undefined) {
    return 0;
  }
  return parseFloat((((current - previous) / previous) * 100).toFixed(2));
}

/**
 * 날짜 포맷팅 (YYYY.MM.DD 형식)
 * @param dateString 날짜 문자열
 * @returns 포맷된 날짜
 */
export function formatDate(dateString: string): string {
  if (!dateString || dateString.length < 8) {
    return '';
  }
  const year = dateString.substring(0, 4);
  const month = dateString.substring(4, 6);
  const day = dateString.substring(6, 8);
  return `${year}.${month}.${day}`;
}

/**
 * 사업연도 문자열 포맷팅
 * @param year 사업연도
 * @returns 포맷된 문자열
 */
export function formatYear(year: string): string {
  return `${year}년`;
}

/**
 * 보고서 코드를 한글명으로 변환
 * @param reportCode 보고서 코드
 * @returns 보고서 한글명
 */
export function getReportName(reportCode: string): string {
  const reportMap: Record<string, string> = {
    '11011': '사업보고서',
    '11012': '반기보고서',
    '11013': '1분기보고서',
    '11014': '3분기보고서',
  };
  return reportMap[reportCode] || '보고서';
}

/**
 * 재무 상태표와 손익계산서 구분 표시
 * @param sjDiv 재무제표 구분
 * @returns 한글명
 */
export function getStatementType(sjDiv: string): string {
  return sjDiv === 'BS' ? '재무상태표' : '손익계산서';
}

/**
 * 개별/연결재무제표 구분 표시
 * @param fsFiv 개별/연결 구분
 * @returns 한글명
 */
export function getFinancialStatementType(fsFiv: string): string {
  return fsFiv === 'OFS' ? '개별재무제표' : '연결재무제표';
}

