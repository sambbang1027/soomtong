import { useState, useEffect } from 'react'
import { fetchArrival } from '../api/subway'
import type { ArrivalData } from '../api/subway'

interface ArrivalInfoProps {
  stationName: string
  refreshTick: number
}

export default function ArrivalInfo({ stationName, refreshTick }: ArrivalInfoProps) {
  const [arrival, setArrival] = useState<ArrivalData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!stationName) return

    let cancelled = false

    const fetch = () => {
      setLoading(true)
      setError(false)
      fetchArrival(stationName)
        .then((data) => {
          if (!cancelled) {
            setArrival(data)
            setLoading(false)
          }
        })
        .catch(() => {
          if (!cancelled) {
            setError(true)
            setLoading(false)
          }
        })
    }

    fetch()
    const timer = setInterval(fetch, 30_000)

    return () => {
      cancelled = true
      clearInterval(timer)
    }
  }, [stationName, refreshTick])

  if (loading && !arrival) {
    return (
      <div className="flex justify-center">
        <div className="h-4 w-28 bg-slate-200 rounded animate-pulse" />
      </div>
    )
  }

  if (error) {
    return (
      <p className="text-center text-sm text-slate-400">도착 정보를 불러올 수 없습니다</p>
    )
  }

  if (!arrival) return null

  return (
    <div className="text-center">
      <span className="text-sm text-slate-500">다음 열차 </span>
      <span className="text-sm font-semibold text-slate-900">{arrival.message}</span>
    </div>
  )
}
