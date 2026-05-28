export type CongestionLevel = 'low' | 'mid' | 'high'

export interface LevelConfig {
  label: string
  desc: string
  bgClass: string
  bgDimClass: string
  textClass: string
  borderClass: string
  hex: string
}

export const LEVELS = {
  LOW: 'low' as CongestionLevel,
  MID: 'mid' as CongestionLevel,
  HIGH: 'high' as CongestionLevel,
}

export function getLevel(pct: number): CongestionLevel {
  if (pct <= 30) return LEVELS.LOW
  if (pct <= 70) return LEVELS.MID
  return LEVELS.HIGH
}

export const LEVEL_CONFIG: Record<CongestionLevel, LevelConfig> = {
  low: {
    label: '여유',
    desc: '서서 가도 옆 사람과 닿지 않아요',
    bgClass: 'bg-emerald-500',
    bgDimClass: 'bg-emerald-50',
    textClass: 'text-emerald-600',
    borderClass: 'border-emerald-400',
    hex: '#10b981',
  },
  mid: {
    label: '보통',
    desc: '조금 서서 갈 만한 수준입니다',
    bgClass: 'bg-amber-400',
    bgDimClass: 'bg-amber-50',
    textClass: 'text-amber-600',
    borderClass: 'border-amber-400',
    hex: '#f59e0b',
  },
  high: {
    label: '혼잡',
    desc: '지옥철입니다. 영혼 탈탈 탈수기',
    bgClass: 'bg-red-500',
    bgDimClass: 'bg-red-50',
    textClass: 'text-red-600',
    borderClass: 'border-red-400',
    hex: '#ef4444',
  },
}

export function getLevelConfig(pct: number): LevelConfig {
  return LEVEL_CONFIG[getLevel(pct)]
}

export interface CarCongestion {
  car: number
  pct: number
}

// 가장 한산한 칸(들)의 번호 배열 반환 (1-based)
export function getBestCars(congestionArray: number[]): CarCongestion[] {
  if (!congestionArray.length) return []
  const min = Math.min(...congestionArray)
  return congestionArray
    .map((pct, idx) => ({ car: idx + 1, pct }))
    .filter(({ pct }) => pct === min)
}

// SK API 응답에서 칸별 혼잡도 파싱 (구분자: ',' 또는 '|')
export function parseCongestionCars(raw: string): number[] {
  return raw.split(/[,|]/).map((v) => parseInt(v, 10))
}
