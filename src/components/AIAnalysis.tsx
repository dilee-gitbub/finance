import { useState } from 'react';
import type { FinancialSummary } from '../types';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

interface AIAnalysisProps {
  corpName: string;
  data: FinancialSummary;
}

export function AIAnalysis({ corpName, data }: AIAnalysisProps) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateAnalysis = async () => {
    setLoading(true);
    setError(null);

    try {
      const financialData = {
        '총자산': data.totalAssets,
        '총부채': data.totalLiabilities,
        '총자본': data.totalEquity,
        '매출액': data.revenue,
        '영업이익': data.operatingProfit,
        '순이익': data.netProfit,
      };

      if (import.meta.env.DEV) {
        // 개발 환경에서는 Mock 분석 사용
        const debtRatio = ((data.totalLiabilities / data.totalAssets) * 100).toFixed(1);
        const equityRatio = ((data.totalEquity / data.totalAssets) * 100).toFixed(1);
        const operatingMargin = ((data.operatingProfit / data.revenue) * 100).toFixed(1);
        const netMargin = ((data.netProfit / data.revenue) * 100).toFixed(1);
        const roe = ((data.netProfit / data.totalEquity) * 100).toFixed(1);
        const roa = ((data.netProfit / data.totalAssets) * 100).toFixed(1);

        let investmentRating = '⭐⭐⭐';
        let riskLevel = '중간';
        
        if (parseFloat(debtRatio) < 30) {
          investmentRating = '⭐⭐⭐⭐⭐';
          riskLevel = '매우 낮음';
        } else if (parseFloat(debtRatio) < 50) {
          investmentRating = '⭐⭐⭐⭐';
          riskLevel = '낮음';
        } else if (parseFloat(debtRatio) > 70) {
          investmentRating = '⭐⭐';
          riskLevel = '높음';
        }

        const mockAnalysis = `# 🎯 ${corpName} 투자 분석 리포트

## 1️⃣ 한눈에 보는 투자 평가

| 평가항목 | 지수 | 의견 |
|---------|------|------|
| **투자 매력도** | ${investmentRating} | 투자 가치 있음 |
| **재무 안정성** | ${riskLevel === '매우 낮음' ? '⭐⭐⭐⭐⭐' : riskLevel === '낮음' ? '⭐⭐⭐⭐' : '⭐⭐⭐'} | ${riskLevel} |
| **수익성** | ${parseFloat(netMargin) > 10 ? '⭐⭐⭐⭐⭐' : parseFloat(netMargin) > 5 ? '⭐⭐⭐⭐' : '⭐⭐⭐'} | 양호 |
| **성장 가능성** | ⭐⭐⭐⭐ | 중간~우상향 |

---

## 2️⃣ 재무 건강도 분석

### 자산 및 자본 구조
**총자산: ${(data.totalAssets / 1000000000000).toFixed(1)}조 원** | **자본: ${(data.totalEquity / 1000000000000).toFixed(1)}조 원**

✅ **자본의 질**: 자본금이 총자산의 **${equityRatio}%**를 차지하고 있습니다.
- **${parseFloat(equityRatio) > 70 ? '🟢 매우 건강함' : parseFloat(equityRatio) > 50 ? '🟡 양호함' : '🔴 개선 필요'}**

### 부채 현황 (⚠️ 투자자가 중요하게 봐야 할 지표)
**총부채: ${(data.totalLiabilities / 1000000000000).toFixed(1)}조 원** | **부채 비율: ${debtRatio}%**

📊 **부채 평가:**
- ${parseFloat(debtRatio) < 30 ? '🟢 안정적: 부채가 매우 적어 위험이 낮습니다. 추가 차입금을 통한 성장 기회가 있습니다.' : parseFloat(debtRatio) < 50 ? '🟡 양호: 적절한 수준의 부채를 유지하고 있습니다. 레버리지 활용이 효율적입니다.' : parseFloat(debtRatio) < 70 ? '🟠 주의: 부채 수준이 높아지고 있습니다. 추가 부채 증가 시 위험요소입니다.' : '🔴 위험: 부채가 과다합니다. 경기 부양시 지급 능력 문제 발생 가능성이 있습니다.'}

---

## 3️⃣ 수익성 분석 (투자자 수익률 예측)

### 핵심 수익 지표
- **매출액**: ${(data.revenue / 1000000000000).toFixed(1)}조 원
- **영업이익**: ${(data.operatingProfit / 1000000000000).toFixed(1)}조 원
- **순이익**: ${(data.netProfit / 1000000000000).toFixed(1)}조 원

### 수익성 비율 (초보자도 이해하기 쉬운 설명)

**영업이익률: ${operatingMargin}%**
- 100원을 벌었을 때 **${operatingMargin}원**을 기본 사업에서 번다는 의미입니다.
- ${parseFloat(operatingMargin) > 15 ? '🟢 우수 (15% 이상)' : parseFloat(operatingMargin) > 10 ? '🟡 양호 (10~15%)' : '🟠 개선 필요 (10% 미만)'}: 산업 내 경쟁력이 있습니다.

**순이익률: ${netMargin}%**
- 100원을 벌었을 때 **${netMargin}원**이 순이익(실제 벌이)입니다.
- ${parseFloat(netMargin) > 10 ? '🟢 탁월한 수익성' : parseFloat(netMargin) > 5 ? '🟡 건강한 수익성' : '🟠 평범한 수익성'}: 주주에게 돌아갈 이익이 충분합니다.

### 투자 수익률 지표 (매우 중요!)

**자기자본수익률 (ROE): ${roe}%**
- 주주가 투자한 1,000원이 1년에 **${roe}원**을 벌어다준다는 의미입니다.
- ${parseFloat(roe) > 20 ? '🟢 매우 높음 (20% 이상)' : parseFloat(roe) > 15 ? '🟢 높음 (15~20%)' : parseFloat(roe) > 10 ? '🟡 양호 (10~15%)' : '🟠 낮음 (10% 미만)'}
- **투자자 입장**: 이 비율이 높을수록 좋은 투자입니다.

**자산수익률 (ROA): ${roa}%**
- 회사의 자산이 얼마나 효율적으로 이익을 만드는지 보여줍니다.
- ${parseFloat(roa) > 10 ? '🟢 매우 효율적' : parseFloat(roa) > 5 ? '🟡 효율적' : '🟠 개선 필요'}

---

## 4️⃣ 투자자를 위한 리스크 평가

### 🔴 높은 위험 요소
${parseFloat(debtRatio) > 70 ? '- 과다한 부채: 경기 침체 시 지급 불능 위험' : ''}
${parseFloat(netMargin) < 3 ? '- 낮은 이익: 경쟁 심화 시 실적 악화 가능' : ''}
${parseFloat(operatingMargin) < 5 ? '- 낮은 영업이익: 기본 사업 경쟁력 약함' : ''}

### 🟡 중간 위험 요소
- 시장 변화에 따른 수익 변동성
- 환율 및 원자재 가격 변동 영향
- 경쟁사 출현에 따른 시장 점유율 변화

### 🟢 긍정 요소
${parseFloat(debtRatio) < 50 ? '✅ 안정적인 자본 구조' : ''}
${parseFloat(netMargin) > 5 ? '✅ 건강한 이익 창출 능력' : ''}
${parseFloat(roe) > 15 ? '✅ 높은 주주 수익률' : ''}

---

## 5️⃣ 투자 의사결정 가이드

### 📈 추천 투자자 유형
${parseFloat(debtRatio) < 50 && parseFloat(roe) > 15 ? '✅ **안정적 수익 추구 투자자**: 배당 기대 가능' : ''}
${parseFloat(operatingMargin) > 10 ? '✅ **성장주 투자자**: 사업 경쟁력이 있어 장기 보유 추천' : ''}
${parseFloat(roa) > 10 ? '✅ **가치 투자자**: 자산 효율성이 좋아 저평가 가능성' : ''}

### ⏰ 추천 투자 시기
- ${parseFloat(debtRatio) < 40 ? '🟢 **즉시 투자 고려**: 재무 상태가 매우 좋습니다' : parseFloat(debtRatio) < 60 ? '🟡 **적절한 시점**: 현재 수익 지표를 확인하고 진입하세요' : '🔴 **신중함 필요**: 기업의 구조 조정 계획을 먼저 확인하세요'}

### 💰 예상 배당수익률
**예상 배당**: 순이익의 30~50%를 배당한다고 가정했을 때
- **연간 예상 배당금**: ${(data.netProfit * 0.4 / 1000000000000).toFixed(2)}조 원
- (정확한 배당은 회사의 배당 정책에 따라 결정됩니다)

---

## 6️⃣ 투자 체크리스트

투자하기 전에 다음을 확인하세요:

- [ ] 부채 비율 (${debtRatio}%) - ${parseFloat(debtRatio) < 50 ? '✅ 양호' : '⚠️ 주의'}
- [ ] ROE (${roe}%) - ${parseFloat(roe) > 15 ? '✅ 우수' : '⚠️ 평범'}
- [ ] 영업이익률 (${operatingMargin}%) - ${parseFloat(operatingMargin) > 10 ? '✅ 양호' : '⚠️ 낮음'}
- [ ] 회사의 업계 순위와 경쟁 상황 - ❓ 추가 조사 필요
- [ ] 향후 신사업 및 투자 계획 - ❓ 추가 조사 필요
- [ ] 경제 사이클과 업계 전망 - ❓ 추가 조사 필요

---

## ⭐ 최종 투자 결론

**${corpName}은 어떤 투자인가?**

${parseFloat(debtRatio) < 50 && parseFloat(roe) > 15 ? '✅ **안정적이면서도 수익성 있는 기업입니다.** 장기 보유를 고려해볼 만합니다.' : parseFloat(debtRatio) < 60 ? '⚠️ **무난한 기업입니다.** 추가 분석 후 투자 결정을 권장합니다.' : '❌ **재무 지표 개선을 기다리는 것이 좋습니다.** 단기적으로 위험성이 높습니다.'}

> **⚠️ 중요한 알림**: 본 분석은 재무 지표에만 기반한 분석입니다. 실제 투자 결정 전에는:
> 1. 회사 실적 발표 및 경영진 회의
> 2. 산업 및 경제 전망
> 3. 전문가 분석 리포트
> 4. 기술적 분석
> 
> ...을 함께 고려해야 합니다. 항상 신중하게 투자하세요! 🎯`;

        setAnalysis(mockAnalysis);
        console.log('🤖 투자자 맞춤형 AI 분석 생성됨 (개발 환경)');
      } else {
        // 프로덕션에서는 실제 Gemini API 사용
        const response = await axios.post('/api/ai-analysis', {
          corp_name: corpName,
          financial_data: financialData,
        });

        setAnalysis(response.data.analysis);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'AI 분석에 실패했습니다';
      setError(errorMessage);
      console.error('AI analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-lg p-6 border-2 border-secondary dark:border-indigo-700 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              🤖 AI 투자 분석 리포트
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              투자자 관점에서 심층적인 재무 분석을 제공합니다
            </p>
          </div>
          <button
            onClick={handleGenerateAnalysis}
            disabled={loading || !corpName}
            className={`px-6 py-3 text-white font-semibold rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-secondary to-indigo-600 hover:from-secondary/90 hover:to-indigo-700 shadow-lg'
            }`}
          >
            {loading ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                분석 생성 중...
              </>
            ) : analysis ? (
              <>
                <span>✓</span>
                <span>분석 완료</span>
              </>
            ) : (
              <>
                <span>📊</span>
                <span>AI 분석 생성</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="text-sm text-red-700 dark:text-red-300">
              <strong>오류:</strong> {error}
            </div>
          </div>
        )}

        {analysis ? (
          <div className="prose dark:prose-invert max-w-none">
            <div className="bg-white dark:bg-gray-800/50 rounded-lg p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="max-h-[600px] overflow-y-auto">
                <ReactMarkdown
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1
                        className="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-4 first:mt-0 pb-2 border-b-2 border-secondary"
                        {...props}
                      />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2
                        className="text-xl font-bold text-secondary dark:text-indigo-400 mt-5 mb-3 pt-2"
                        {...props}
                      />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3
                        className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4 mb-2"
                        {...props}
                      />
                    ),
                    p: ({ node, ...props }) => (
                      <p className="text-gray-700 dark:text-gray-300 my-2 leading-relaxed" {...props} />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="text-gray-700 dark:text-gray-300 ml-4 my-1.5" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul className="list-disc my-3 pl-4" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol className="list-decimal my-3 pl-4" {...props} />
                    ),
                    strong: ({ node, ...props }) => (
                      <strong className="font-bold text-gray-900 dark:text-white" {...props} />
                    ),
                    em: ({ node, ...props }) => (
                      <em className="italic text-gray-700 dark:text-gray-400" {...props} />
                    ),
                    code: ({ node, ...props }) => (
                      <code
                        className="bg-gray-100 dark:bg-gray-900 px-2.5 py-1 rounded text-sm text-secondary font-mono"
                        {...props}
                      />
                    ),
                    blockquote: ({ node, ...props }) => (
                      <blockquote
                        className="border-l-4 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 pl-4 py-3 my-3 italic text-gray-700 dark:text-gray-300 rounded"
                        {...props}
                      />
                    ),
                    table: ({ node, ...props }) => (
                      <table
                        className="w-full my-4 border-collapse border border-gray-300 dark:border-gray-600"
                        {...props}
                      />
                    ),
                    thead: ({ node, ...props }) => (
                      <thead className="bg-secondary dark:bg-indigo-700 text-white" {...props} />
                    ),
                    th: ({ node, ...props }) => (
                      <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left" {...props} />
                    ),
                    td: ({ node, ...props }) => (
                      <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-700 dark:text-gray-300" {...props} />
                    ),
                    hr: () => (
                      <hr className="my-4 border-t-2 border-gray-200 dark:border-gray-700" />
                    ),
                  }}
                >
                  {analysis}
                </ReactMarkdown>
              </div>
            </div>
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-400">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                💡 <strong>팁:</strong> 본 분석은 재무 지표에 기반한 객관적 평가입니다. 투자 결정 전에 최신 뉴스, 업계 분석, 기술적 분석도 함께 고려하세요.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-block">
              <div className="text-6xl mb-4">📊</div>
              <div className="text-gray-500 dark:text-gray-400">
                {loading ? (
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="animate-spin h-8 w-8 border-3 border-secondary border-t-transparent rounded-full"></div>
                    <p className="text-lg font-semibold">AI가 투자 분석 리포트를 생성 중입니다...</p>
                    <p className="text-sm">상세한 재무 분석이 곧 나타납니다</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <p className="text-lg font-semibold">AI 투자 분석 리포트</p>
                    <p className="text-sm">위의 "AI 분석 생성" 버튼을 클릭하면</p>
                    <p className="text-sm">투자자 관점에서의 심층 분석이 생성됩니다</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

