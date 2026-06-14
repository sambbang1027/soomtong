# 혼잡도 & 가중치 시스템 설명서

숨통이 "지금 어느 칸이 가장 한산한가"를 어떻게 계산하는지 처음부터 끝까지 설명합니다.

---

## 1. 문제: API는 열차 전체 혼잡도만 알려준다

공공데이터포털 혼잡도 API를 호출하면 아래처럼 숫자 하나만 돌아옵니다.

```
강남역 / 내선 / 평일 / 10:00~ → 68(%)
```

**"열차 전체가 68% 차 있다"는 뜻입니다.**

칸별 데이터(1번 칸 80%, 5번 칸 40%...)는 공개된 API가 없습니다.
그래서 숨통은 **역사 구조를 직접 조사해 추정치를 만드는 방법**을 선택했습니다.

---

## 2. 아이디어: 출구·계단 위치로 칸별 혼잡도를 추정한다

지하철을 자주 타다 보면 경험적으로 알 수 있습니다.

> 강남역에서 내릴 때 3~4번 칸 앞에 사람이 몰린다.  
> 왜냐면 지상으로 나가는 에스컬레이터가 그쪽에 있기 때문이다.

이 원리를 숫자로 만든 것이 **가중치(weight)** 입니다.

```
칸별 혼잡도 = 전체 혼잡도 × 칸별 가중치
```

예를 들어 강남역 내선 방향 가중치가 아래와 같다면:

| 칸   | 1    | 2    | 3    | 4    | 5    | 6    | 7    | 8    | 9    | 10   |
|------|------|------|------|------|------|------|------|------|------|------|
| 가중치 | 0.8 | 0.9 | 1.3 | 1.4 | 1.1 | 1.0 | 0.9 | 0.8 | 0.8 | 1.0 |

전체 혼잡도가 68%일 때 각 칸의 추정 혼잡도는:

| 칸   | 1    | 2    | 3    | 4    | 5    | 6    | 7    | 8    | 9    | 10   |
|------|------|------|------|------|------|------|------|------|------|------|
| 혼잡도 | 54% | 61% | 88% | 95% | 75% | 68% | 61% | 54% | 54% | 68% |

→ **1·8·9번 칸이 가장 한산** → 앱이 이 칸을 추천합니다.

---

## 3. 가중치 설계 규칙

### 합은 반드시 10.0

10칸 × 평균 가중치 1.0 = 10.0이 되어야 전체 혼잡도 비율이 유지됩니다.
가중치 합이 10.0보다 크면 모든 칸이 실제보다 혼잡하게 표시되고,
작으면 실제보다 한산하게 표시됩니다.

```
0.8 + 0.9 + 1.3 + 1.4 + 1.1 + 1.0 + 0.9 + 0.8 + 0.8 + 1.0 = 10.0 ✓
```

### 방향별로 다르다

같은 역이라도 방향에 따라 멈추는 위치가 반대입니다.
강남역 내선(시청 방향)과 외선(잠실 방향)은 출구와 가장 가까운 칸이 서로 다릅니다.

```
내선: [0.8, 0.9, 1.3, 1.4, 1.1, 1.0, 0.9, 0.8, 0.8, 1.0]
외선: [0.9, 1.0, 1.2, 1.3, 1.0, 0.9, 0.9, 0.9, 0.9, 1.0]
```

### 2호선은 내선/외선, 나머지는 상행/하행

2호선은 순환선이라서 "내선(시계 방향)"과 "외선(반시계 방향)"으로 구분합니다.
나머지 호선은 "상행(기점 방향)"과 "하행(종점 방향)"으로 구분합니다.

---

## 4. 코드로 어떻게 구현했나

데이터가 흐르는 순서대로 설명합니다.

```
사용자가 역 선택
      ↓
API 호출 → 전체 혼잡도(%) 받기          [subway.ts]
      ↓
가중치 테이블 조회                        [stationWeights.ts]
      ↓
칸별 혼잡도 계산                          [calcCongestion.ts]
      ↓
혼잡도 레벨 판정 (여유/보통/혼잡)         [congestion.ts]
      ↓
화면에 표시                              [SubwayGrid, CarBlock]
```

---

### 4-1. API 호출: 전체 혼잡도 받기 (`src/api/subway.ts`)

공공데이터포털에 역명·호선·요일·방향을 보내면, 시간대별 혼잡도가 담긴 행 하나가 돌아옵니다.

```ts
// 현재 시간이 10:17이라면 → "10:00~ (%)" 키로 값 추출
function getTimeSlotKey(): string {
  const now = new Date()
  const hour = now.getHours()
  const min = now.getMinutes() < 30 ? '00' : '30'
  return `${hour}:${min}~ (%)`
}
```

API에 보낼 때 방향 표기도 변환이 필요합니다.
2호선은 내선/외선 그대로 쓰지만, 나머지 호선은 상선/하선으로 바꿔야 합니다
(API 서버가 그렇게 저장하고 있기 때문입니다).

```ts
function toApiDirection(lineNo: number, direction: '상행' | '하행' | '내선' | '외선'): string {
  if (lineNo === 2) return direction === '내선' ? '내선' : '외선'
  return direction === '상행' ? '상선' : '하선'
}
```

API 키가 없거나 오류가 나면 목업 데이터(68%)로 자동 대체합니다.

```ts
if (!import.meta.env.VITE_CONGESTION_API_KEY) {
  return getMockCongestion(direction)  // { congestion: 68, direction }
}
```

---

### 4-2. 가중치 테이블 (`src/constants/stationWeights.ts`)

역 이름을 키로, 방향별 가중치 배열(10개)을 값으로 가지는 테이블입니다.

```ts
export const STATION_WEIGHTS: Record<string, StationWeightEntry> = {
  강남: {
    내선: [0.8, 0.9, 1.3, 1.4, 1.1, 1.0, 0.9, 0.8, 0.8, 1.0],
    외선: [0.9, 1.0, 1.2, 1.3, 1.0, 0.9, 0.9, 0.9, 0.9, 1.0],
    tips: {
      내선: '강남 사거리 주요 출구(11·12번)가 3~4번 칸 앞에 집중됩니다. 1번·8~9번 칸이 가장 한산합니다.',
      외선: '강남 사거리 주요 출구(11·12번)가 7~8번 칸 앞에 집중됩니다. 1~2번 칸이 가장 한산합니다.',
    },
  },
  // ...
}
```

`tip` vs `tips` 필드의 차이:
- `tip` — 방향과 관계없이 같은 팁을 쓸 때 (예: 잠실역은 내선/외선 모두 4~7번 칸이 붐빔)
- `tips` — 방향마다 다른 팁이 있을 때 (예: 강남역은 방향마다 붐비는 출구가 반대)

가중치가 등록되지 않은 역은 모든 칸을 1.0으로 처리합니다 (균등 분배).

```ts
export function getWeights(
  stationName: string,
  direction: CongestionData['direction'],
): number[] {
  const entry = STATION_WEIGHTS[stationName]
  if (!entry) return Array(10).fill(1.0)  // 미등록 역: 균등 가중치

  return entry[direction] ?? Array(10).fill(1.0)
}
```

---

### 4-3. 칸별 혼잡도 계산 (`src/utils/calcCongestion.ts`)

가장 핵심적인 계산 로직입니다. 딱 세 줄입니다.

```ts
export function calcCarCongestions(
  stationName: string,
  direction: CongestionData['direction'],
  overallPct: number,       // API에서 받은 전체 혼잡도 (예: 68)
): CarCongestionResult[] {
  const weights = getWeights(stationName, direction)
  const pcts = weights.map((w) => Math.round(overallPct * w))  // 칸별 혼잡도 계산
  const min = Math.min(...pcts)                                 // 가장 낮은 값 찾기
  return pcts.map((pct, idx) => ({
    car: idx + 1,
    pct,
    isRecommended: pct === min,  // 가장 한산한 칸에 BEST 뱃지
  }))
}
```

---

### 4-4. 혼잡도 레벨 판정 (`src/utils/congestion.ts`)

숫자(%)를 화면에 보여줄 색상·텍스트로 변환합니다.
숫자를 직접 노출하지 않는 이유는 추정치이기 때문에 "88%"처럼 정확해 보이면 오해를 줄 수 있어서입니다.

```ts
export function getLevel(pct: number): CongestionLevel {
  if (pct <= 30) return 'low'   // 여유 (초록)
  if (pct <= 70) return 'mid'   // 보통 (노랑)
  return 'high'                 // 혼잡 (빨강)
}
```

---

### 4-5. React 훅으로 연결 (`src/hooks/useCongestion.ts`)

위의 함수들을 컴포넌트에서 쓰기 쉽게 묶은 훅입니다.
역 이름·호선·방향이 바뀌면 자동으로 API를 다시 호출합니다.

```ts
export function useCongestion(stationName, lineNo, direction) {
  useEffect(() => {
    fetchCongestion(stationName, lineNo, direction)   // 1. API 호출
      .then((data) => {
        setCars(calcCarCongestions(stationName, direction, data.congestion))  // 2. 계산
      })
  }, [stationName, lineNo, direction, tick])

  return { cars, loading, error, refetch }
}
```

컴포넌트 언마운트 시 응답을 무시하도록 `cancelled` 플래그를 사용합니다.
(역을 빠르게 바꿀 때 이전 요청 결과가 뒤늦게 화면에 표시되는 문제 방지)

---

## 5. 가중치를 새 역에 추가하는 방법

`src/constants/stationWeights.ts`에 역 이름을 키로 추가하면 됩니다.

```ts
// 예: 신촌역 추가
신촌: {
  내선: [0.8, 0.9, 1.1, 1.2, 1.3, 1.1, 0.9, 0.8, 0.9, 1.0],
  외선: [1.0, 0.9, 0.8, 0.9, 1.1, 1.3, 1.2, 1.1, 0.9, 0.8],
  tips: {
    내선: '연세로 방면 출구(1~3번)가 4~5번 칸 앞에 있습니다. 1번 칸이 가장 한산합니다.',
    외선: '연세로 방면 출구(1~3번)가 5~6번 칸 앞에 있습니다. 9~10번 칸이 가장 한산합니다.',
  },
},
```

가중치를 정할 때 체크리스트:
- [ ] 10개 숫자가 있는가
- [ ] 합이 10.0인가 (`0.1 단위로 쉽게 맞출 수 있음`)
- [ ] 붐비는 칸 → 1.0 이상, 한산한 칸 → 1.0 이하로 설정했는가
- [ ] 방향별로 값이 다른가 (같은 역이라도 방향마다 다름)
- [ ] tip 내용이 실제 출구·계단 위치와 일치하는가

---

## 6. 한계와 주의사항

- **추정치입니다.** 실제 측정값이 아니므로 오차가 있을 수 있습니다.
- 가중치는 **평균적인 상황**을 기반으로 합니다. 특별 이벤트·공휴일에는 다를 수 있습니다.
- API 혼잡도 자체가 **30분 단위 통계 평균값**입니다. 실시간 측정이 아닙니다.
- 이 때문에 앱 화면에서는 혼잡도 **% 수치를 직접 표시하지 않고** 색상과 레벨(여유/보통/혼잡)만 보여줍니다.
