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

## 2026-05-28

- Day 2 UI 컴포넌트 + 화면 조립 완료
  - `src/data/stations.ts` — 12개 역 목록 (GPS 좌표, 호선, 방향 타입)
  - `src/hooks/useGeolocation.ts` — Haversine 거리 계산으로 가장 가까운 역 자동 감지
  - `src/components/CarBlock.tsx` — 혼잡도 3단계 색상, BEST 뱃지
  - `src/components/SubwayGrid.tsx` — 10칸 그리드, 가로 스크롤, 스켈레톤 로딩
  - `src/components/RecommendBanner.tsx` — 추천 칸 배너, 혼잡도 색상 tint
  - `src/components/ArrivalInfo.tsx` — 도착 정보 표시, 언마운트 시 요청 취소
  - `src/components/StationHeader.tsx` — 역 선택 바텀시트 모달 + 방향 토글 (호선별 분기)
  - `src/App.tsx` — 전체 상태 연결 및 화면 조립 (GPS 자동 감지 → 역 자동 설정)
- `src/api/subway.ts` 버그 수정 2건
  - `getTimeSlotKey()`: `"18:00~ (%)"` → `"18시00분"` (공공데이터포털 실제 응답 키 형식 일치)
  - `toApiDirection()`: `'상선'`/`'하선'` → `'상행'`/`'하행'` (API 응답 키 형식 일치)
- 모바일 반응형 세밀 조정
  - `index.css`: `-webkit-tap-highlight-color: transparent`, `overscroll-behavior: none`
  - `App.tsx`: `safe-area-inset` 패딩 적용 (노치 폰 대응)
  - `SubwayGrid.tsx`: `scrollbar-width: none`, `-webkit-overflow-scrolling: touch`
- 혼잡도 API 버그 2건 수정 (실제 API 응답 확인 기반)
  - `toApiDirection()`: `'상행'/'하행'` → `'상선'/'하선'` (1·3·4호선 API 실제 방향 키값)
  - `getTimeSlotKey()`: `"8시30분"` → `"8:30~ (%)"` (API 실제 시간 컬럼명 형식)
- GitHub 업로드 → Vercel 배포 완료
- 라이트모드 전환: 모든 컴포넌트의 다크 색상 교체 (`#0a0e1a` 배경 → `#f8fafc`, 카드 `bg-white`, 텍스트 `slate-900/500`)
- 혼잡도 색상 라이트모드 조정: `bgDimClass` (`*-900/40` → `*-50`), `textClass` (`*-400` → `*-600`)
- 방향 버튼 행선지 표시: "내선/외선/상행/하행" 대신 종착역 기준 표시
  - 1호선: 소요산행 / 신창행
  - 2호선: 내선 ↺ / 외선 ↻
  - 3호선: 대화행 / 오금행
  - 4호선: 당고개행 / 오이도행
- `getDirectionLabel(lineNo, direction)` 유틸 추가 (`stations.ts`)
- `SubwayGrid` props: `direction` → `directionLabel` (표시용 문자열로 분리)
- 역 목록 대폭 확장 (12개 → 87개): GPS 기반 가장 가까운 역 감지 정확도 향상
  - 2호선: 순환선 전 역 + 성수지선 (51개)
  - 1호선: 종각·종로3가·동대문·서울역·용산·노량진·영등포·구로 (8개)
  - 3호선: 경복궁·안국·종로3가·충무로·압구정·고속터미널·양재 등 (16개)
  - 4호선: 혜화·동대문·명동·회현·서울역·삼각지·이촌·사당 등 (14개)


## 2026-05-29

- 4호선 가중치 추가 (`src/constants/stationWeights.ts`)
  - 신규 역 9개: 혜화, 명동, 회현, 숙대입구, 삼각지, 신용산, 이촌, 동작, 이수
  - 사당: 기존 내선/외선에 상행/하행(4호선 방향) 병합
  - 동대문, 충무로, 서울역: 기존 상행/하행 항목 그대로 4호선과 공유
  - 주요 환승역: 삼각지(6호선), 신용산(경의중앙선), 이촌(경의중앙선), 동작(9호선), 이수(7호선) 환승 통로 위치 기반 가중치 반영
- 1~4호선 역 28개 추가 (stations.ts + stationWeights.ts)
  - 1호선 7개: 청량리, 종로5가, 동묘앞, 신설동, 남영, 대방, 신길
  - 3호선 북부 6개: 연신내, 불광, 녹번, 홍제, 무악재, 독립문
  - 3호선 남부 10개: 매봉, 도곡, 대치, 학여울, 대청, 일원, 수서, 가락시장, 경찰병원, 오금
  - 4호선 북부 5개: 수유, 미아사거리, 길음, 성신여대입구, 한성대입구
  - 총 역 수: 87개 → 115개

## 2026-06-14

- 시작 화면 개선: `StationSearch.tsx` 신규 생성
  - 호선 탭(1~4호선) + 역 목록 카드 형태로 화면 중앙 배치
  - `station === null` 시 검색 화면 표시, 역 선택 즉시 혼잡도 뷰 전환
  - `StationHeader.tsx` 모달 제거 → "← 역 변경" 버튼으로 검색 화면 복귀
  - GPS 자동 감지 버그 수정: `useRef(geoAutoSelected)`로 중복 자동 선택 방지
- 역 검색 기능 추가 (StationSearch.tsx)
  - 상단 검색 입력창: 타이핑 시 전체 호선 필터링, 결과에 호선 뱃지 표시
  - 검색 비어 있을 때: 호선 탭 + 선택 호선 역 목록 (기존 동작)
  - ✕ 버튼으로 검색 초기화
- 5~9호선 추가 (stations.ts + stationWeights.ts)
  - 5호선 32개: 김포공항~상일동 전 구간
  - 6호선 29개: 연신내~태릉입구 전 구간
  - 7호선 33개: 노원~철산 주요 구간
  - 8호선 11개: 암사~복정 전 구간
  - 9호선 35개: 개화~중앙보훈병원 전 구간 (이후 제거됨 — 아래 항목 참조)
  - 주요 신규 역 가중치 추가: 여의도, 광화문, 공덕, 이태원, 노원, 청담, 강남구청 등
  - LINE_DIRECTION_LABEL 5~9호선 행선지 추가 (방화행/마천행 등)
  - 총 역 수: 115개 → 250개+
- 9호선 전체 제거 (stations.ts, StationSearch.tsx, stationWeights.ts)
  - 사유: 혼잡도 API(서울교통공사)가 1~8호선만 지원 — 9호선 데이터는 2020~2022년 자료만 존재 (PRD 4.5항 명시)
  - `AVAILABLE_LINES` 수정: `[1, 2, 3, 4, 5, 6, 7, 8, 9]` → `[1, 2, 3, 4, 5, 6, 7, 8]`
  - `LINE_DIRECTION_LABEL`에서 9호선 항목 제거
  - `stationWeights.ts`에서 9호선 전용 역 가중치(신논현, 선정릉, 국회의사당, 올림픽공원) 제거
