# 📊 재무 데이터 시각화 분석 서비스

누구나 쉽게 이해할 수 있는 한국 기업 재무제표 검색 및 시각화 서비스입니다.

## 기능

### 1. 회사 검색 및 조회
- **빠른 검색**: 회사명, 종목코드, 고유번호로 3,864개 회사 검색
- **자동완성**: 입력 시 자동으로 검색 결과 표시
- **선택된 회사 정보**: 검색 후 선택된 회사의 고유번호 및 종목코드 확인

### 2. 재무 데이터 시각화
- **주요 재무 지표 카드**:
  - 총 자산, 총 부채, 총 자본
  - 매출액, 영업이익, 순이익
  - 전년도 대비 증감률 표시

- **다양한 차트**:
  - 막대 차트: 연도별 매출/이익 비교
  - 선 그래프: 재무 지표 추이 (준비 중)
  - 파이 차트: 자산/부채/자본 구성

- **주요 재무 비율**:
  - 부채 비율: 총자산 대비 부채 비율
  - 순이익률: 매출액 대비 순이익 비율
  - 자기자본비율: 총자산 대비 자본 비율

### 3. AI 재무 분석
- **Gemini 2.0 Flash API 기반**
- **쉬운 설명**: 금융 전문 용어 최소화로 누구나 이해 가능
- **분석 항목**:
  - 재무 상태 요약 (자산, 부채, 자본 해석)
  - 수익성 분석 (매출, 이익 추세)
  - 투자 시 고려사항
  - 요약 평가

## 기술 스택

### 프론트엔드
- **React 19** with Vite (빠른 개발 및 빌드)
- **TypeScript** (타입 안정성)
- **Tailwind CSS** (모던하고 반응형 UI)
- **Recharts** (직관적인 차트 라이브러리)
- **Axios** (HTTP 클라이언트)
- **React Markdown** (마크다운 렌더링)

### 백엔드
- **Vercel Serverless Functions** (API Routes)
- **OpenDart API** (한국 상장회사 재무제표)
- **Google Gemini API** (AI 분석)

### 데이터
- **corp.xml** → **JSON** 변환 (3,864개 회사 데이터)

## 시작하기

### 설치

```bash
# 프로젝트 의존성 설치
npm install

# corp.xml을 JSON으로 변환
npm run parse-xml
```

### 환경 변수 설정

`env.example` 파일을 참고하여 환경 변수를 설정합니다:

```bash
# .env.local 파일 생성
VITE_OPENDART_API_KEY=your_opendart_api_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

**참고**: Vercel 배포 시에는 Vercel 대시보드에서 환경 변수를 등록해야 합니다.

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173`으로 접속합니다.

### 빌드

```bash
npm run build
```

## 프로젝트 구조

```
finance/
├── public/
│   └── corp-list.json              # 변환된 회사 목록
├── src/
│   ├── components/
│   │   ├── CompanySearch.tsx       # 회사 검색 컴포넌트
│   │   ├── FinancialSelector.tsx   # 재무 데이터 선택
│   │   ├── FinancialCards.tsx      # 재무 지표 카드
│   │   ├── FinancialCharts.tsx     # 차트 시각화
│   │   ├── AIAnalysis.tsx          # AI 분석 결과
│   │   ├── ErrorBoundary.tsx       # 에러 처리
│   │   └── Skeleton.tsx            # 로딩 스켈레톤
│   ├── hooks/
│   │   └── useFinancialData.ts     # 재무 데이터 페칭 훅
│   ├── types/
│   │   └── index.ts                # TypeScript 타입 정의
│   ├── utils/
│   │   └── format.ts               # 데이터 포맷팅 유틸
│   ├── api/
│   │   └── client.ts               # API 클라이언트
│   ├── App.tsx                     # 메인 컴포넌트
│   ├── main.tsx                    # 진입점
│   └── index.css                   # 글로벌 스타일
├── api/
│   ├── financial-data.ts           # OpenDart API 프록시
│   └── ai-analysis.ts              # Gemini API 프록시
├── scripts/
│   └── parse-corp-xml.js           # XML → JSON 변환 스크립트
├── .env.example                    # 환경 변수 템플릿
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── vercel.json                     # Vercel 배포 설정
```

## API 문서

### OpenDart API

- **엔드포인트**: `/api/financial-data`
- **메서드**: GET
- **파라미터**:
  - `corp_code`: 회사 고유번호 (8자리)
  - `bsns_year`: 사업연도 (4자리)
  - `reprt_code`: 보고서 코드
    - `11011`: 사업보고서 (연간)
    - `11012`: 반기보고서
    - `11013`: 1분기보고서
    - `11014`: 3분기보고서

### Gemini AI Analysis API

- **엔드포인트**: `/api/ai-analysis`
- **메서드**: POST
- **요청 본문**:
  ```json
  {
    "corp_name": "회사명",
    "financial_data": {
      "총자산": 1000000000,
      "총부채": 500000000,
      "총자본": 500000000,
      "매출액": 200000000,
      "영업이익": 50000000,
      "순이익": 40000000
    }
  }
  ```

## Vercel 배포

### 1. Git 저장소 생성

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo>
git push -u origin main
```

### 2. Vercel 연결

- [Vercel 대시보드](https://vercel.com)에 접속
- GitHub 저장소 선택
- 자동 배포 활성화

### 3. 환경 변수 등록

Vercel 프로젝트 설정 → Environment Variables에서:
- `OPENDART_API_KEY`
- `GEMINI_API_KEY`

## 보안 주의사항

- ✅ API 키는 서버사이드에서만 처리 (클라이언트 노출 X)
- ✅ `.env.local` 파일은 `.gitignore`에 포함
- ✅ 환경 변수는 예제 파일로 관리 (`.env.example`)
- ✅ CORS 설정으로 API 보호
- ✅ Rate Limiting 대응 (재시도 로직 구현)

## 오류 처리

- OpenDart API 에러 코드별 메시지 표시
- 네트워크 오류 시 재시도 로직 (exponential backoff)
- Gemini API 타임아웃 처리 (30초)
- ErrorBoundary로 전역 에러 처리

## 성능 최적화

- 반응형 레이아웃 (모바일, 태블릿, 데스크톱)
- 로딩 상태 표시 (스피너, 스켈레톤)
- 이미지/데이터 캐싱
- 코드 스플리팅

## 향후 개선사항

- [ ] 다크모드 완벽 지원
- [ ] 여러 회사 비교 분석
- [ ] 분기별 데이터 비교
- [ ] 재무 비율 분석 추가 (ROE, ROA 등)
- [ ] PDF 보고서 내보내기
- [ ] 자산 배분 시뮬레이션

## 라이선스

MIT

## 지원

문제가 발생하면 이슈를 등록해주세요.

---

**참고**: 이 서비스는 교육 목적으로 만들어졌으며, 투자 결정의 기초로 사용하기 전에 전문가의 상담을 받으시기 바랍니다.
