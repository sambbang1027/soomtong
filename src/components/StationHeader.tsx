import { getDirectionOptions, getDirectionLabel } from '../data/stations'
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
  station: StationInfo
  direction: CongestionData['direction']
  onBack: () => void
  onDirectionChange: (d: CongestionData['direction']) => void
}

export default function StationHeader({
  station,
  direction,
  onBack,
  onDirectionChange,
}: StationHeaderProps) {
  const directionOptions = getDirectionOptions(station.directionType)
  const lineColor = LINE_COLORS[station.lineNo] ?? '#94a3b8'

  return (
    <>
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-sm text-slate-400 active:opacity-60 transition-opacity flex items-center gap-1"
        >
          ← 역 변경
        </button>

        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm"
        >
          <span className="text-sm font-semibold text-slate-900">{station.name}역</span>
          <span
            className="text-xs font-bold px-1.5 py-0.5 rounded-full text-white leading-4"
            style={{ backgroundColor: lineColor }}
          >
            {station.lineNo}호선
          </span>
        </div>
      </div>

      {/* 방향 토글 */}
      {directionOptions.length > 0 && (
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
