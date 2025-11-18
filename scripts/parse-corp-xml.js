import fs from 'fs';
import path from 'path';
import xml2js from 'xml2js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// XML 파일 경로
const xmlFilePath = path.join(process.env.USERPROFILE, 'Desktop', 'corp.xml');
const outputPath = path.join(__dirname, '..', 'public', 'corp-list.json');

async function parseXml() {
  try {
    console.log('XML 파일 읽기 중...');
    const xmlData = fs.readFileSync(xmlFilePath, 'utf-8');

    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(xmlData);

    if (!result.result || !result.result.list) {
      throw new Error('Invalid XML structure');
    }

    // 회사 데이터 추출 및 변환
    const companies = result.result.list.map((item) => ({
      corp_code: item.corp_code?.[0] || '',
      corp_name: item.corp_name?.[0] || '',
      corp_eng_name: item.corp_eng_name?.[0] || '',
      stock_code: item.stock_code?.[0] || '',
      modify_date: item.modify_date?.[0] || '',
    }));

    console.log(`총 ${companies.length}개 회사 데이터 추출됨`);

    // 출력 디렉토리가 없으면 생성
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // JSON 파일로 저장
    fs.writeFileSync(
      outputPath,
      JSON.stringify({ list: companies }, null, 2),
      'utf-8'
    );

    console.log(`✓ JSON 파일 저장 완료: ${outputPath}`);
    console.log(`첫 5개 항목:`);
    companies.slice(0, 5).forEach((company) => {
      console.log(
        `  - ${company.corp_name} (${company.corp_code})`
      );
    });
  } catch (error) {
    console.error('에러 발생:', error.message);
    process.exit(1);
  }
}

parseXml();
