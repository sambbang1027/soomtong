import { useState, useEffect } from 'react'
import { useGeolocation } from './hooks/useGeolocation'
import { useCongestion } from './hooks/useCongestion'
import { getDefaultDirection } from './data/stations'
import { STATION_WEIGHTS } from './constants/stationWeights'
import type { StationInfo } from './data/stations'
import type { CongestionData } from './api/subway'
import StationHeader from './components/StationHeader'
import RecommendBanner from './components/RecommendBanner'
import ArrivalInfo from './components/ArrivalInfo'
import SubwayGrid from './components/SubwayGrid'

export default function App() {
  const { nearestStation, loading: geoLoading } = useGeolocation()
  const [station, setStation] = useState<StationInfo | null>(null)
  const [direction, setDirection] = useState<CongestionData['direction']>('내선')

  useEffect(() => {
    if (nearestStation && !station) {
      setStation(nearestStation)
      setDirection(getDefaultDirection(nearestStation.directionType))
    }
  }, [nearestStation, station])

  const handleStationChange = (s: StationInfo) => {
    setStation(s)
    setDirection(getDefaultDirection(s.directionType))
  }

  const { cars, loading, error, refetch } = useCongestion(
    station?.name ?? '',
    station?.lineNo ?? 2,
    direction,
  )

  const tip = station ? STATION_WEIGHTS[station.name]?.tip : undefined

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <div
        className="mx-auto max-w-[430px] px-4 flex flex-col gap-4"
        style={{
          paddingTop: 'max(40px, env(safe-area-inset-top, 40px))',
          paddingBottom: 'max(40px, env(safe-area-inset-bottom, 40px))',
        }}
      >
        <StationHeader
          station={station}
          geoLoading={geoLoading && !station}
          direction={direction}
          onStationChange={handleStationChange}
          onDirectionChange={setDirection}
        />

        {error && (
          <p className="text-center text-sm text-red-400 py-2">{error}</p>
        )}

        {station ? (
          <>
            <RecommendBanner cars={cars} loading={loading} />
            <ArrivalInfo stationName={station.name} />
            <SubwayGrid cars={cars} loading={loading} direction={direction} />

            {tip && !loading && (
              <div className="bg-[#1e2030] rounded-xl p-4 border border-[#2e3248] flex gap-3 items-start">
                <span className="text-base shrink-0">💡</span>
                <p className="text-sm text-[#94a3b8] leading-relaxed">{tip}</p>
              </div>
            )}

            <button
              onClick={refetch}
              className="text-xs text-[#94a3b8] text-center py-2 active:opacity-50 transition-opacity"
            >
              새로고침
            </button>
          </>
        ) : (
          !geoLoading && (
            <div className="text-center text-[#94a3b8] mt-12">
              <p className="text-base">위의 버튼에서 역을 선택해주세요</p>
            </div>
          )
        )}
      </div>
    </div>
  )
}
