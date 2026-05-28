import { useState } from 'react'
import { STATIONS, getDirectionOptions } from '../data/stations'
import type { StationInfo } from '../data/stations'
import type { CongestionData } from '../api/subway'

const LINE_COLORS: Record<number, string> = {
  1: '#0052A4',
  2: '#00A84D',
  3: '#EF7C1C',
  4: '#00A5DE',
  5: '#996CAC',
  6: '#CD7C2F',
  7: '#747F00',
  8: '#E6186C',
  9: '#BDB092',
}

interface StationHeaderProps {
  station: StationInfo | null
  geoLoading: boolean
  direction: CongestionData['direction']
  onStationChange: (s: StationInfo) => void
  onDirectionChange: (d: CongestionData['direction']) => void
}

export default function StationHeader({
  station,
  geoLoading,
  direction,
  onStationChange,
  onDirectionChange,
}: StationHeaderProps) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const directionOptions = station ? getDirectionOptions(station.directionType) : []
  const lineColor = station ? (LINE_COLORS[station.lineNo] ?? '#94a3b8') : '#94a3b8'

  return (
    <>
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-[#f1f5f9]">🌬 숨통</span>

        <button
          onClick={() => setPickerOpen(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1e2030] border border-[#2e3248] active:opacity-70 transition-opacity min-h-[44px]"
        >
          {geoLoading ? (
            <span className="text-sm text-[#94a3b8] flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 border-2 border-slate-600 border-t-slate-300 rounded-full animate-spin" />
              위치 확인 중...
            </span>
          ) : station ? (
            <>
              <span className="text-sm font-semibold text-[#f1f5f9]">{station.name}역</span>
              <span
                className="text-xs font-bold px-1.5 py-0.5 rounded-full text-white leading-4"
                style={{ backgroundColor: lineColor }}
              >
                {station.lineNo}호선
              </span>
              <span className="text-[#94a3b8] text-xs">▼</span>
            </>
          ) : (
            <span className="text-sm text-[#94a3b8]">역 선택 ▼</span>
          )}
        </button>
      </div>

      {/* 방향 토글 */}
      {station && directionOptions.length > 0 && (
        <div className="flex justify-end gap-2">
          {directionOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => onDirectionChange(opt)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors min-h-[36px] ${
                direction === opt
                  ? 'bg-[#f1f5f9] text-[#0a0e1a]'
                  : 'bg-[#1e2030] text-[#94a3b8] border border-[#2e3248]'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {/* 역 선택 모달 */}
      {pickerOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-end justify-center"
          onClick={() => setPickerOpen(false)}
        >
          <div
            className="w-full max-w-[430px] bg-[#1e2030] rounded-t-2xl p-4 max-h-[70vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-[#2e3248] rounded-full mx-auto mb-4" />
            <p className="text-base font-semibold text-[#f1f5f9] mb-3 px-1">역 선택</p>
            <div className="flex flex-col gap-0.5">
              {STATIONS.map((s) => {
                const isSelected = station?.name === s.name && station?.lineNo === s.lineNo
                return (
                  <button
                    key={`${s.name}-${s.lineNo}`}
                    onClick={() => {
                      onStationChange(s)
                      setPickerOpen(false)
                    }}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors min-h-[44px] ${
                      isSelected ? 'bg-[#2e3248]' : 'active:bg-[#2e3248]'
                    }`}
                  >
                    <span className="text-sm text-[#f1f5f9]">{s.name}역</span>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: LINE_COLORS[s.lineNo] ?? '#94a3b8' }}
                    >
                      {s.lineNo}호선
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
