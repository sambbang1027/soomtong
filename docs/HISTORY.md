# HISTORY.md — 숨통 작업 이력

> 완료된 작업의 전체 이력. 삭제·수정하지 않고 날짜순으로 누적한다.

---

## 2026-05-26

- 기획안 기반 `docs/prd.md` 작성 (기능 요구사항, 와이어프레임, 3일 스프린트 계획)
- `CLAUDE.md` 작성 (기술 스택, 프로젝트 구조, 작업 프로토콜, 코드 컨벤션)
- `docs/DESIGN.md` 작성 (색상 팔레트, 컴포넌트 레이아웃, 타이포그래피, 애니메이션)
- `docs/WORK.md` 작성 (진행 예정 작업 목록, 초기 기술 결정 사항)
- `docs/HISTORY.md` 생성
- 프로젝트 초기 세팅 완료
  - Vite + React + Tailwind CSS v4 환경 구성
  - `vite.config.js`: Tailwind 플러그인 + SK API CORS 프록시 설정
  - `vercel.json`: 프로덕션 CORS rewrites 설정
  - `index.html`: 한국어, 모바일 뷰포트, PWA 메타태그 적용
  - `.env.example` 생성
  - `.gitignore`에 `.env` 추가
- 프로젝트 전체 TypeScript 전환
  - `typescript` 패키지 설치, `tsconfig.json` / `tsconfig.app.json` / `tsconfig.node.json` 생성
  - `.jsx` → `.tsx`, `.js` → `.ts` 파일 변환 (`App`, `main`, `congestion`, `vite.config`)
  - `src/vite-env.d.ts` 생성 (환경변수 타입 선언)
  - `src/utils/congestion.ts` 타입 추가 (`CongestionLevel`, `LevelConfig`, `CarCongestion`)
- Day 1: `src/api/subway.ts` 작성
  - SK API 실제 호출 (`GET /tdi/v1/subway/congestion/train/station/{stationCd}`)
  - API 키 없을 때 목업 데이터 자동 폴백
  - `CongestionResponse` 인터페이스 정의
- Day 1: `.env` 생성 (SK Open API 키 세팅)

## 2026-05-27

- 기반 정비: `vite.config.ts` 프록시 — SK API 제거, 공공데이터포털(`/api/congestion`) + 서울 열린데이터광장(`/api/arrival`) 경로로 교체
- Day 1: `src/api/subway.ts` 전면 재작성
  - 공공데이터포털 혼잡도 API (시간대 슬롯 추출, 요일 분기, 2호선 내선/외선 처리 포함)
  - 서울 열린데이터광장 도착 정보 API
  - `VITE_CONGESTION_API_KEY` / `VITE_ARRIVAL_API_KEY` 없을 때 목업 폴백 유지
- Day 2: `src/hooks/useCongestion.ts` 작성 — `(stationName, lineNo, direction)` 받아 `{ cars, loading, error, refetch }` 반환, 언마운트 시 요청 취소 처리
- Day 2: `src/utils/calcCongestion.ts` 작성 — `calcCarCongestions(stationName, direction, overallPct)` → `CarCongestionResult[]` 반환, 추천 칸 자동 마킹
- Day 2: `src/constants/stationWeights.ts` 작성 — 12개 주요 역 가중치 테이블
  - 2호선(강남·선릉·삼성·잠실·홍대입구·신림·사당·신도림·교대·왕십리·합정): 내선/외선
  - 1호선(서울역): 상행/하행
  - 역당 가중치 10개(합 10.0 고정), `tip` 필드, `getWeights()` 유틸 함수 포함
- 기획 변경에 따른 `docs/prd.md` 전면 재정비
  - 데이터 소스 변경: SK API 제외 → 공공데이터포털 혼잡도 API + 서울 열린데이터광장 도착 API 채택
  - 혼잡도 표현 수정: "실시간" → "현재 시간대 30분 통계 기준"
  - Feature 3.5 추가: 상행/하행 방향 토글 버튼
  - Feature 3.6 추가: 역사 구조 팁 (stationWeights tip 필드 기반)
  - 4.6 추가: 커버리지 미달 역 폴백 정책 (균등 가중치 1.0)
  - PWA Post-MVP으로 이동
  - 와이어프레임 상행/하행 토글 반영
- `docs/WORK.md` 새 기획 기준으로 전면 재정리
