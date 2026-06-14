import { useState } from 'react'
import { STATIONS } from '../data/stations'
import type { StationInfo } from '../data/stations'

export const LINE_COLORS: Record<number, string> = {
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

const AVAILABLE_LINES = [1, 2, 3, 4, 5, 6, 7, 8]

interface Props {
  geoLoading: boolean
  onSelect: (s: StationInfo) => void
}

export default function StationSearch({ geoLoading, onSelect }: Props) {
  const [line, setLine] = useState(2)
  const [query, setQuery] = useState('')

  const trimmed = query.trim()

  // 검색 중이면 전체 호선에서 이름 필터, 아니면 선택 호선만
  const stations = trimmed
    ? STATIONS.filter((s) => s.name.includes(trimmed))
    : STATIONS.filter((s) => s.lineNo === line)

  // 검색 결과에서 중복 제거 (같은 이름+호선)
  const seen = new Set<string>()
  const dedupedStations = stations.filter((s) => {
    const key = `${s.name}-${s.lineNo}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  return (
    <div className="flex flex-col gap-8">
      {/* 히어로 */}
      <div className="mt-10 text-center">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">🌬 숨통</h1>
        <p className="mt-2 text-slate-400 text-sm">지금 어느 칸이 가장 숨통 트일까요?</p>
      </div>

      {/* 검색 카드 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* 검색 입력 */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100">
          <span className="text-slate-400 text-base shrink-0">🔍</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="역 이름 검색..."
            className="flex-1 text-sm text-slate-800 placeholder-slate-400 outline-none bg-transparent"
          />
          {trimmed && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 text-sm px-1 active:opacity-60"
            >
              ✕
            </button>
          )}
        </div>

        {/* 호선 탭 — 검색 중이면 숨김 */}
        {!trimmed && (
          <div className="flex gap-1.5 px-3 py-2.5 bg-slate-50 border-b border-slate-100 overflow-x-auto scrollbar-none">
            {AVAILABLE_LINES.map((l) => (
              <button
                key={l}
                onClick={() => setLine(l)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  line === l ? 'text-white' : 'bg-white text-slate-500 border border-slate-200'
                }`}
                style={line === l ? { backgroundColor: LINE_COLORS[l] } : {}}
              >
                {l}호선
              </button>
            ))}
          </div>
        )}

        {/* 역 목록 */}
        <div className="overflow-y-auto" style={{ maxHeight: '340px' }}>
          {dedupedStations.length === 0 ? (
            <p className="text-center text-sm text-slate-400 py-8">검색 결과가 없습니다</p>
          ) : (
            dedupedStations.map((s) => (
              <button
                key={`${s.name}-${s.lineNo}`}
                onClick={() => onSelect(s)}
                className="w-full px-5 py-3.5 text-left border-b border-slate-50 last:border-0 active:bg-slate-50 transition-colors flex items-center justify-between"
              >
                <span className="text-[15px] text-slate-800">{s.name}역</span>
                {trimmed && (
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full text-white shrink-0"
                    style={{ backgroundColor: LINE_COLORS[s.lineNo] ?? '#94a3b8' }}
                  >
                    {s.lineNo}호선
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* GPS 감지 중 */}
      {geoLoading && (
        <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
          <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 border-t-slate-500 animate-spin shrink-0" />
          현재 위치로 자동 감지 중...
        </div>
      )}
    </div>
  )
}
