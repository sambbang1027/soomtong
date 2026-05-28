import { getLevelConfig } from '../utils/congestion'

interface CarBlockProps {
  carNumber: number
  pct: number
  isRecommended: boolean
}

export default function CarBlock({ carNumber, pct, isRecommended }: CarBlockProps) {
  const cfg = getLevelConfig(pct)
  return (
    <div
      className={`relative flex flex-col items-center justify-center w-9 min-w-[36px] h-16 rounded-lg transition-colors duration-500 ${cfg.bgClass} ${isRecommended ? 'scale-105 ring-2 ring-white' : 'opacity-80'}`}
    >
      {isRecommended && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] font-bold bg-white text-gray-900 rounded-full px-1.5 leading-4 whitespace-nowrap">
          BEST
        </span>
      )}
      <span className="text-xs font-bold text-white leading-none">{cfg.label}</span>
      <span className="text-[10px] text-white/70 mt-1 leading-none">{carNumber}번</span>
    </div>
  )
}
