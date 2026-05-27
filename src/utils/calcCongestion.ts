import { getWeights } from '../constants/stationWeights'
import type { CongestionData } from '../api/subway'

export interface CarCongestionResult {
  car: number      // 1-based
  pct: number      // 전체 혼잡도 × 가중치
  isRecommended: boolean
}

export function calcCarCongestions(
  stationName: string,
  direction: CongestionData['direction'],
  overallPct: number,
): CarCongestionResult[] {
  const weights = getWeights(stationName, direction)
  const pcts = weights.map((w) => Math.round(overallPct * w))
  const min = Math.min(...pcts)
  return pcts.map((pct, idx) => ({
    car: idx + 1,
    pct,
    isRecommended: pct === min,
  }))
}
