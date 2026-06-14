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

// 이 거리 초과 시 자동 선택 안 함
const MAX_AUTO_KM = 1.0
// 같은 역명이 이 거리 내에 여러 호선으로 있으면 호선 선택을 유도
const SAME_STATION_KM = 0.1

export interface UseGeolocationResult {
  nearestStation: StationInfo | null   // 단일 확정 역 (자동 선택용)
  nearbyStations: StationInfo[]        // 동명 다호선 후보 (사용자가 호선 선택)
  loading: boolean
  error: string | null
}

export function useGeolocation(): UseGeolocationResult {
  const [nearestStation, setNearestStation] = useState<StationInfo | null>(null)
  const [nearbyStations, setNearbyStations] = useState<StationInfo[]>([])
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
          if (d < minDist) { minDist = d; nearest = s }
        }

        if (minDist > MAX_AUTO_KM) {
          // 1km 초과 — 근처에 역 없음
          setNearestStation(null)
          setNearbyStations([])
          setLoading(false)
          return
        }

        // 같은 이름의 역이 근처에 여러 호선으로 있는지 확인
        const sameNameCandidates = STATIONS.filter(
          (s) =>
            s.name === nearest.name &&
            haversineKm(latitude, longitude, s.lat, s.lng) <= minDist + SAME_STATION_KM,
        )

        if (sameNameCandidates.length > 1) {
          // 환승역 — 호선 선택을 유도
          setNearestStation(null)
          setNearbyStations(sameNameCandidates)
        } else {
          // 단일 역 — 자동 선택
          setNearestStation(nearest)
          setNearbyStations([])
        }

        setLoading(false)
      },
      (err) => {
        setError(err.code === 1 ? '위치 권한이 거부되었습니다.' : '위치를 가져올 수 없습니다.')
        setLoading(false)
      },
      { timeout: 8000 },
    )
  }, [])

  return { nearestStation, nearbyStations, loading, error }
}
