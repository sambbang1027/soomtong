import { useState, useEffect, useRef, useCallback } from 'react'
import { useGeolocation } from './hooks/useGeolocation'
import { useCongestion } from './hooks/useCongestion'
import { getDefaultDirection, getDirectionLabel } from './data/stations'
import { getTip } from './constants/stationWeights'
import type { StationInfo } from './data/stations'
import type { CongestionData } from './api/subway'
import StationSearch from './components/StationSearch'
import StationHeader from './components/StationHeader'
import RecommendBanner from './components/RecommendBanner'
import ArrivalInfo from './components/ArrivalInfo'
import SubwayGrid from './components/SubwayGrid'

export default function App() {
  const { nearestStation, nearbyStations, loading: geoLoading } = useGeolocation()
  const [station, setStation] = useState<StationInfo | null>(null)
  const [direction, setDirection] = useState<CongestionData['direction']>('내선')
  const geoAutoSelected = useRef(false)

  useEffect(() => {
    if (nearestStation && !geoAutoSelected.current) {
      geoAutoSelected.current = true
      setStation(nearestStation)
      setDirection(getDefaultDirection(nearestStation.directionType))
    }
  }, [nearestStation])

  const handleStationChange = (s: StationInfo) => {
    setStation(s)
    setDirection(getDefaultDirection(s.directionType))
  }

  const [refreshTick, setRefreshTick] = useState(0)
  const handleRefresh = useCallback(() => setRefreshTick((t) => t + 1), [])

  const { cars, loading, error, refetch } = useCongestion(
    station?.name ?? '',
    station?.lineNo ?? 2,
    direction,
  )

  const handleRefetchAll = useCallback(() => {
    refetch()
    handleRefresh()
  }, [refetch, handleRefresh])

  const tip = station ? getTip(station.name, direction) : undefined
  const directionLabel = station ? getDirectionLabel(station.lineNo, direction) : direction

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div
        className="mx-auto max-w-[430px] px-4 flex flex-col gap-4"
        style={{
          paddingTop: 'max(40px, env(safe-area-inset-top, 40px))',
          paddingBottom: 'max(40px, env(safe-area-inset-bottom, 40px))',
        }}
      >
        {!station ? (
          <StationSearch
            geoLoading={geoLoading}
            nearbyStations={nearbyStations}
            onSelect={handleStationChange}
          />
        ) : (
          <>
            <StationHeader
              station={station}
              direction={direction}
              onBack={() => setStation(null)}
              onDirectionChange={setDirection}
              onStationChange={handleStationChange}
            />

            {error && (
              <p className="text-center text-sm text-red-500 py-2">{error}</p>
            )}

            <RecommendBanner cars={cars} loading={loading} />
            <ArrivalInfo stationName={station.name} refreshTick={refreshTick} />
            <SubwayGrid cars={cars} loading={loading} directionLabel={directionLabel} />

            {tip && !loading && (
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex gap-3 items-start">
                <span className="text-base shrink-0">💡</span>
                <p className="text-sm text-slate-500 leading-relaxed">{tip}</p>
              </div>
            )}

            <button
              onClick={handleRefetchAll}
              className="text-xs text-slate-400 text-center py-2 active:opacity-50 transition-opacity"
            >
              새로고침
            </button>
          </>
        )}
      </div>
    </div>
  )
}
