import { useState, useEffect } from 'react'
import { fetchCongestion } from '../api/subway'
import type { CongestionData } from '../api/subway'
import { calcCarCongestions } from '../utils/calcCongestion'
import type { CarCongestionResult } from '../utils/calcCongestion'

interface UseCongestionResult {
  cars: CarCongestionResult[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useCongestion(
  stationName: string,
  lineNo: number,
  direction: CongestionData['direction'],
): UseCongestionResult {
  const [cars, setCars] = useState<CarCongestionResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (!stationName) return

    let cancelled = false
    setLoading(true)
    setError(null)

    fetchCongestion(stationName, lineNo, direction)
      .then((data) => {
        if (cancelled) return
        setCars(calcCarCongestions(stationName, direction, data.congestion))
      })
      .catch(() => {
        if (cancelled) return
        setError('혼잡도 데이터를 불러오지 못했습니다.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [stationName, lineNo, direction, tick])

  return { cars, loading, error, refetch: () => setTick((t) => t + 1) }
}
