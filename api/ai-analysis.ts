import axios from 'axios';
import type { VercelRequest, VercelResponse } from '@vercel/node';

interface GeminiMessage {
  role: 'user' | 'model';
  parts: Array<{
    text: string;
  }>;
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const API_KEY = process.env.GEMINI_API_KEY;

function createAnalysisPrompt(
  corpName: string,
  financialData: Record<string, number>
): string {
  const dataString = Object.entries(financialData)
    .map(([key, value]) => `${key}: ${value.toLocaleString()}원`)
    .join('\n');

  return `너는 금융 분석 전문가야. 다음 회사의 재무 데이터를 분석해서 누구나 쉽게 이해할 수 있게 설명해줘.

회사명: ${corpName}

재무 데이터:
${dataString}

다음 항목들을 포함해서 분석해줘:

1. **재무 상태 요약**: 회사의 재무 건강도를 자산, 부채, 자본 관점에서 초보자도 이해하기 쉽게 설명
2. **수익성 분석**: 매출, 이익을 통해 회사가 얼마나 잘 수익을 내고 있는지 설명
3. **투자 시 고려사항**: 이 회사에 투자하기 전에 살펴봐야 할 주요 지표나 주의사항
4. **요약 평가**: 한 문장으로 이 회사의 재무 상태를 평가

모든 설명은 한국어로 해주고, 금융 전문 용어는 최소화하고 쉬운 표현을 사용해줘.`;
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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { corp_name, financial_data } = req.body;

  if (!corp_name || !financial_data) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['corp_name', 'financial_data'],
    });
  }

  if (!API_KEY) {
    return res.status(500).json({
      error: 'API key not configured',
    });
  }

  try {
    const prompt = createAnalysisPrompt(corp_name, financial_data);

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    const geminiResponse = response.data as GeminiResponse;

    if (!geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response format from Gemini');
    }

    const analysisText = geminiResponse.candidates[0].content.parts[0].text;

    res.status(200).json({
      analysis: analysisText,
    });
  } catch (error) {
    console.error('Gemini API Error:', error);

    const errorMessage = 
      error instanceof Error ? error.message : 'Unknown error occurred';

    res.status(500).json({
      error: 'Failed to generate analysis',
      message: errorMessage,
    });
  }
}

