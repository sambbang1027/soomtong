import { useState, useEffect } from 'react'
import { fetchArrival } from '../api/subway'
import type { ArrivalData } from '../api/subway'

interface ArrivalInfoProps {
  stationName: string
}

export default function ArrivalInfo({ stationName }: ArrivalInfoProps) {
  const [arrival, setArrival] = useState<ArrivalData | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!stationName) return
    let cancelled = false
    setLoading(true)
    fetchArrival(stationName)
      .then((data) => {
        if (!cancelled) setArrival(data)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [stationName])

  if (loading) {
    return (
      <div className="flex justify-center">
        <div className="h-4 w-28 bg-slate-700/60 rounded animate-pulse" />
      </div>
    )
  }
  if (!arrival) return null

  return (
    <div className="text-center">
      <span className="text-sm text-[#94a3b8]">다음 열차 </span>
      <span className="text-sm font-semibold text-[#f1f5f9]">{arrival.message}</span>
    </div>
  )
}
