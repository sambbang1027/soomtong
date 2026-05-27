# 숨통 (Soomtong)

실시간 지하철 혼잡도 기반으로 가장 한산한 칸을 안내하는 단일 화면 웹앱.

---

## 커맨드

```bash
npm run dev      # 개발 서버 (http://localhost:5173)
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 결과 미리보기
npm run lint     # ESLint 검사
```

---

## 기술 스택

- **React 19** + **Vite 8** — UI 및 번들러
- **Tailwind CSS v4** — `@tailwindcss/vite` 플러그인 방식 (설정 파일 없음, `src/index.css`에 `@import "tailwindcss"` 한 줄)
- **Axios** — SK Open API HTTP 클라이언트
- **SK Open API** — 실시간 지하철 혼잡도 데이터 소스

---

## 프로젝트 구조

```
src/
  App.jsx                  # 루트 컴포넌트, 전체 상태 관리
  api/
    subway.js              # SK API 호출 함수 + 목업 폴백
  components/
    StationHeader.jsx      # 상단 헤더 (현재 역·호선 표시)
    RecommendBanner.jsx    # 추천 칸 배너
    SubwayGrid.jsx         # 열차 10칸 그리드 컨테이너
    CarBlock.jsx           # 칸 1개 블록 (혼잡도 % + 색상)
  data/
    stations.js            # 역 목록 (이름, 호선, GPS 좌표, SK API 코드)
  hooks/
    useGeolocation.js      # 브라우저 GPS 훅
  utils/
    congestion.js          # 혼잡도 레벨 판정·색상·추천 칸 계산
docs/
  prd.md                   # 기능 요구사항 명세
  DESIGN.md                # UI/UX 설계 (색상, 레이아웃, 컴포넌트 구조)
  WORK.md                  # 진행 예정 작업 + 기술적 결정 사항
  HISTORY.md               # 완료된 작업 전체 이력
```

---

## 환경변수

`.env` 파일을 루트에 생성해야 실제 API를 호출함.

```
VITE_SK_API_KEY=발급받은_키
```

키가 없으면 `src/api/subway.js`의 목업 데이터로 자동 동작.
API 등록: https://openapi.sk.com → 지하철 혼잡도(TDI) 서비스 신청

---

## SK API 연동

- **엔드포인트:** `GET /tdi/v1/subway/congestion/train/station/{stationCd}`
- **인증:** 요청 헤더 `appKey: {VITE_SK_API_KEY}`
- **응답:** `result.congestionResult.congestionCar` — 칸별 혼잡도 문자열 (`"35,60,85,..."`)

> 실제 엔드포인트·응답 구조는 SK API 문서 확인 후 `src/api/subway.js`에서 수정.

### CORS 처리

| 환경 | 방법 |
|------|------|
| 개발 | `vite.config.js` proxy: `/api/sk` → `https://apis.openapi.sk.com` |
| 프로덕션 | `vercel.json` rewrites: 동일 경로 처리 |

---

## 문서 파일 역할

| 파일 | 역할 | 두는 것 | 두지 않는 것 |
|------|------|---------|-------------|
| `docs/prd.md` | 기능 요구사항 명세 | 기능 정의, 화면 설계, 비기능 요구사항 | 작업 진행 상황, 기술 결정 |
| `docs/DESIGN.md` | UI/UX 설계 | 색상 팔레트, 컴포넌트 레이아웃, 타이포그래피, 애니메이션 | 기능 요구사항, 작업 이력 |
| `docs/WORK.md` | 현재 진행 상태 | 진행 예정 작업, 기술적 결정 사항 | 완료된 작업(→ HISTORY), 기능 요구사항(→ prd.md) |
| `docs/HISTORY.md` | 완료 작업 전체 이력 | 날짜 포함 완료 항목 | 진행 예정 작업, 미래 계획 |

---

## 작업 프로토콜 (Claude 필수 준수)

### 작업 시작 전
`docs/WORK.md`의 **진행 예정** 섹션에 수행할 작업 항목을 추가한다.
이를 통해 다음에 무엇을 해야 하는지, 앞으로 어떤 작업이 남아 있는지 항상 파악 가능하게 유지한다.

### 작업 완료 후
1. `docs/WORK.md`의 진행 예정에서 해당 항목을 **제거**한다.
2. `docs/HISTORY.md`에 **날짜와 함께** 해당 항목을 이동·기록한다.

### 기술적 결정이 생겼을 때
`docs/WORK.md`의 **결정 사항** 섹션에 결정 내용과 이유를 기록한다.

### HISTORY.md 관리 규칙
- 완료된 작업의 전체 이력을 날짜순으로 보관한다.
- 항목은 `YYYY-MM-DD` 날짜 헤더 아래에 기술한다.
- 삭제하거나 수정하지 않는다 — 이력은 항상 누적된다.

---

## 코드 컨벤션

### 파일 및 폴더 네이밍
- 컴포넌트 파일: `PascalCase.jsx` (예: `CarBlock.jsx`)
- 컴포넌트 외 나머지: `camelCase.js` (예: `congestion.js`, `useGeolocation.js`)
- 폴더: `camelCase` (예: `components/`, `hooks/`)

### 컴포넌트
- 함수형 컴포넌트만 사용, `export default function ComponentName` 형태
- Props는 구조 분해 할당으로 받음

```jsx
// good
export default function CarBlock({ carNumber, congestion, isRecommended }) { ... }

// bad
export default function CarBlock(props) { return <div>{props.carNumber}</div> }
```

### 상태 관리
- 전역 상태는 `App.jsx`에서 관리, props로 하위에 전달
- 상태가 많아지면 `useReducer`로 전환 (별도 Context 도입 금지 — MVP 범위 초과)

### 훅
- 커스텀 훅은 `src/hooks/` 폴더에 위치, 이름은 `use`로 시작
- 훅 내부에서 UI 렌더링 없음 — 데이터·상태만 반환

### API 호출
- 모든 SK API 호출은 `src/api/subway.js`에서만 처리
- 컴포넌트에서 `axios`를 직접 import하지 않음
- API 키 없을 때는 목업 데이터 반환

```js
export async function fetchCongestion(stationCd) {
  if (!import.meta.env.VITE_SK_API_KEY) return getMockCongestion()
  // 실제 호출 ...
}
```

### Tailwind CSS
- 인라인 `style` 속성 사용 금지 — Tailwind 클래스로 대체
- 동적으로 결정되는 색상값(호선 컬러 등)은 `style={{ color: lineColor }}` 예외 허용
- 조건부 클래스는 템플릿 리터럴 사용 (clsx 라이브러리 도입 금지)

```jsx
// good
<div className={`rounded-lg ${isRecommended ? 'border-white' : 'border-transparent'}`}>
```

### Import 순서
1. React 및 외부 라이브러리
2. 내부 컴포넌트
3. 훅
4. 유틸·데이터·API

### 주석
- 코드가 자명하면 주석 작성 금지
- WHY가 비자명한 경우에만 한 줄 작성 (SK API 특이사항, 브라우저 quirk 등)
- `console.log`는 커밋 전 제거, 목업 사용 시 `console.warn('[숨통] 목업 데이터 사용 중')` 명시
