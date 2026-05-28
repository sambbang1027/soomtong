import CarBlock from './CarBlock'
import type { CarCongestionResult } from '../utils/calcCongestion'

interface SubwayGridProps {
  cars: CarCongestionResult[]
  loading: boolean
  direction: string
}

export default function SubwayGrid({ cars, loading, direction }: SubwayGridProps) {
  return (
    <div className="bg-[#1e2030] rounded-xl p-4 border border-[#2e3248]">
      <p className="text-xs text-[#94a3b8] mb-4">← {direction} 진행 방향</p>
      <div className="flex gap-1.5 overflow-x-auto pb-1 pt-3 [scrollbar-width:none] [-webkit-overflow-scrolling:touch]">
        {loading
          ? Array.from({ length: 10 }, (_, i) => (
              <div key={i} className="w-9 min-w-[36px] h-16 rounded-lg bg-slate-700/60 animate-pulse" />
            ))
          : cars.map(({ car, pct, isRecommended }) => (
              <CarBlock key={car} carNumber={car} pct={pct} isRecommended={isRecommended} />
            ))}
      </div>
    </div>
  )
}
