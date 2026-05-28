import { useState, useEffect } from 'react'
import { STATIONS } from '../data/stations'
import type { StationInfo } from '../data/stations'

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export interface UseGeolocationResult {
  nearestStation: StationInfo | null
  loading: boolean
  error: string | null
}

export function useGeolocation(): UseGeolocationResult {
  const [nearestStation, setNearestStation] = useState<StationInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('위치 서비스 미지원')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude, longitude } = coords
        let nearest = STATIONS[0]
        let minDist = haversineKm(latitude, longitude, nearest.lat, nearest.lng)
        for (const s of STATIONS) {
          const d = haversineKm(latitude, longitude, s.lat, s.lng)
          if (d < minDist) {
            minDist = d
            nearest = s
          }
        }
        setNearestStation(nearest)
        setLoading(false)
      },
      (err) => {
        setError(err.code === 1 ? '위치 권한이 거부되었습니다.' : '위치를 가져올 수 없습니다.')
        setLoading(false)
      },
      { timeout: 8000 },
    )
  }, [])

  return { nearestStation, loading, error }
}
