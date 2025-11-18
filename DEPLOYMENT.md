# 🚀 Vercel 배포 가이드

이 가이드를 따라 재무 데이터 시각화 서비스를 Vercel에 배포할 수 있습니다.

## 사전 준비사항

1. **GitHub 계정** (또는 GitLab, Bitbucket)
2. **Vercel 계정** - https://vercel.com에서 무료로 가입
3. **API 키**:
   - OpenDart API 키: `1a0b2ad5f7ed5522e1c647bbf3c8f8992bb66398`
   - Gemini API 키: `AIzaSyC2ZzT9QO0ZD_C_8M2ALsEF_KU90bqaCx8`

## Step 1: GitHub에 배포

### 1.1 GitHub 저장소 생성

1. GitHub에 로그인 (https://github.com)
2. 새 저장소 생성 (`New repository`)
3. 저장소 이름: `finance` (또는 원하는 이름)
4. Public/Private 선택 (Public 권장)

### 1.2 로컬에서 GitHub로 푸시

```bash
cd C:\Users\gilbut\Desktop\finance

# Git 설정
git config user.email "your-email@example.com"
git config user.name "Your Name"

# 첫 번째 커밋
git commit -m "Initial commit: Financial data visualization service"

# GitHub 저장소 연결
git remote add origin https://github.com/YOUR_USERNAME/finance.git
git branch -M main
git push -u origin main
```

## Step 2: Vercel 배포 설정

### 2.1 Vercel에 GitHub 연결

1. https://vercel.com에 접속하여 로그인
2. "Add New..." → "Project" 클릭
3. "Import Git Repository" 선택
4. GitHub에서 `finance` 저장소 선택
5. 자동 배포 활성화

### 2.2 환경 변수 설정

Vercel 프로젝트 설정에서 환경 변수 추가:

**Settings → Environment Variables**에서 다음을 추가:

```
OPENDART_API_KEY=1a0b2ad5f7ed5522e1c647bbf3c8f8992bb66398
GEMINI_API_KEY=AIzaSyC2ZzT9QO0ZD_C_8M2ALsEF_KU90bqaCx8
```

### 2.3 배포

환경 변수 설정 후:

1. "Deploy" 버튼 클릭
2. 배포 완료 대기 (약 1-2분)
3. "Visit" 링크를 클릭하여 배포된 서비스 확인

## Step 3: 배포 후 확인사항

### 3.1 서비스 확인

배포된 URL에서 다음을 확인:

1. ✅ 회사 검색 기능 작동
2. ✅ 재무 데이터 조회 가능
3. ✅ 차트 표시
4. ✅ AI 분석 기능

### 3.2 로그 확인

Vercel 대시보드에서 "Functions" 탭에서 API 함수 로그 확인:
- `/api/financial-data`
- `/api/ai-analysis`

## Step 4: 자동 배포 설정

Vercel은 GitHub에 push할 때마다 자동으로 배포합니다.

```bash
# 로컬에서 수정 후
git add .
git commit -m "Fix: Update styling"
git push

# 자동으로 Vercel에 배포됨
```

## 주의사항

### API 키 보안

- ⚠️ `.env` 파일은 **절대** GitHub에 commit하지 않기
- ✅ `.gitignore`에 `.env*` 포함 확인
- ✅ Vercel 대시보드에서만 환경 변수 관리

### 레이트 제한

- **OpenDart API**: 하루에 20,000건 요청 제한
- **Gemini API**: 분 단위 요청 제한

### 성능 최적화

Vercel 배포 시 주의사항:

```bash
# 로컬에서 빌드 테스트
npm run build

# 빌드 크기 확인
du -sh dist/
```

## 트러블슈팅

### 배포 실패

**로그 확인**:
- Vercel 대시보드 → "Deployments" → 실패한 배포 클릭
- "Build Logs" 확인

**일반적인 원인**:
- 환경 변수 누락
- 빌드 스크립트 오류
- Node.js 버전 호환성

### API 오류

**OpenDart API 오류 (코드: 013)**
- 해당 회사의 데이터가 없음
- 다른 연도/보고서 코드 시도

**Gemini API 오류 (timeout)**
- API 응답 시간 초과
- 재시도

## 도메인 연결 (선택사항)

커스텀 도메인 설정:

1. Vercel 프로젝트 Settings
2. "Domains" 탭
3. 도메인 추가 및 DNS 설정

## 모니터링

### Vercel Analytics

1. 프로젝트 Settings
2. "Analytics" 활성화
3. 성능 메트릭 모니터링

### 에러 추적

Vercel의 built-in 로깅으로 에러 추적 가능:
- Functions 실행 로그
- 에러율 모니터링

## 업데이트 및 유지보수

### 로컬 업데이트

```bash
# 의존성 업그레이드
npm outdated
npm update

# 테스트
npm run build
npm run dev
```

### Vercel에 배포

```bash
git add .
git commit -m "Upgrade dependencies"
git push
```

## 추가 리소스

- [Vercel 문서](https://vercel.com/docs)
- [React 배포](https://react.dev/learn/start-a-new-react-project#next-steps)
- [OpenDart API](https://opendart.fss.or.kr)
- [Gemini API](https://ai.google.dev)

## 지원

배포 관련 문제가 발생하면:

1. 위 트러블슈팅 섹션 확인
2. Vercel 대시보드 로그 확인
3. 각 API 제공자의 문서 확인

---

**배포 완료!** 🎉

이제 당신의 재무 데이터 시각화 서비스가 온라인에서 실행되고 있습니다.

