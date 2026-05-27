# 숨통 (Soomtong)

> 숨 막히는 지옥철, 당신의 출퇴근길에 틔워주는 단 하나의 숨통

지하철 혼잡도 통계와 역사 구조 기반 가중치 알고리즘을 결합해, 가장 한산한 칸을 1초 만에 안내하는 단일 화면 웹앱.

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:5173)
npm run dev
```

### 환경변수 설정

`.env.example`을 복사해 `.env` 파일을 생성하고 API 키를 입력하세요.

```bash
cp .env.example .env
```

| 변수명 | 설명 |
|--------|------|
| `VITE_CONGESTION_API_KEY` | 공공데이터포털 서울교통공사 혼잡도 API 키 |
| `VITE_ARRIVAL_API_KEY` | 서울 열린데이터광장 실시간 도착정보 API 키 |

키가 없으면 목업 데이터로 자동 동작합니다.

## 기술 스택

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS v4**
- 공공데이터포털 서울교통공사 혼잡도 API
- 서울 열린데이터광장 지하철 실시간 도착정보 OA-12764

## 커맨드

```bash
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 결과 미리보기
npm run lint     # ESLint 검사
```
