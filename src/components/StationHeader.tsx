import { useState } from 'react'
import { STATIONS, getDirectionOptions, getDirectionLabel } from '../data/stations'
import type { StationInfo } from '../data/stations'
import type { CongestionData } from '../api/subway'
import { LINE_COLORS } from '../constants/lineColors'

interface StationHeaderProps {
  station: StationInfo
  direction: CongestionData['direction']
  onBack: () => void
  onDirectionChange: (d: CongestionData['direction']) => void
  onStationChange: (s: StationInfo) => void
}

export default function StationHeader({
  station,
  direction,
  onBack,
  onDirectionChange,
  onStationChange,
}: StationHeaderProps) {
  const [isSearching, setIsSearching] = useState(false)
  const [query, setQuery] = useState('')

  const trimmed = query.trim()

  const results = (() => {
    if (!trimmed) return []
    const seen = new Set<string>()
    return STATIONS.filter((s) => {
      if (!s.name.includes(trimmed)) return false
      const key = `${s.name}-${s.lineNo}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    }).slice(0, 8)
  })()

  const handleSelect = (s: StationInfo) => {
    onStationChange(s)
    setIsSearching(false)
    setQuery('')
  }

  const handleCancel = () => {
    setIsSearching(false)
    setQuery('')
  }

  const lineColor = LINE_COLORS[station.lineNo] ?? '#94a3b8'
  const directionOptions = getDirectionOptions(station.directionType)

  return (
    <>
      {isSearching ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3">
            <span className="text-slate-400 shrink-0">🔍</span>
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="역 이름 검색..."
              className="flex-1 text-sm text-slate-800 placeholder-slate-400 outline-none bg-transparent"
            />
            <button onClick={handleCancel} className="text-slate-400 text-sm px-1 active:opacity-60">
              ✕
            </button>
          </div>

          {trimmed && (
            <div className="border-t border-slate-100 overflow-y-auto" style={{ maxHeight: '240px' }}>
              {results.length === 0 ? (
                <p className="text-center text-sm text-slate-400 py-4">검색 결과가 없습니다</p>
              ) : (
                results.map((s) => (
                  <button
                    key={`${s.name}-${s.lineNo}`}
                    onClick={() => handleSelect(s)}
                    className="w-full px-5 py-3.5 text-left border-b border-slate-50 last:border-0 active:bg-slate-50 transition-colors flex items-center justify-between"
                  >
                    <span className="text-[15px] text-slate-800">{s.name}역</span>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full text-white shrink-0"
                      style={{ backgroundColor: LINE_COLORS[s.lineNo] ?? '#94a3b8' }}
                    >
                      {s.lineNo}호선
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-sm text-slate-400 active:opacity-60 transition-opacity flex items-center gap-1"
          >
            ← 전체 목록
          </button>

          <button
            onClick={() => setIsSearching(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm active:opacity-70 transition-opacity"
          >
            <span className="text-sm font-semibold text-slate-900">{station.name}역</span>
            <span
              className="text-xs font-bold px-1.5 py-0.5 rounded-full text-white leading-4"
              style={{ backgroundColor: lineColor }}
            >
              {station.lineNo}호선
            </span>
            <span className="text-slate-300 text-xs">▾</span>
          </button>
        </div>
      )}

      {!isSearching && directionOptions.length > 0 && (
        <div className="flex justify-end gap-2">
          {directionOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => onDirectionChange(opt)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors min-h-[36px] ${
                direction === opt
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-500 border border-slate-200'
              }`}
            >
              {getDirectionLabel(station.lineNo, opt)}
            </button>
          ))}
        </div>
      )}
    </>
  )
}
