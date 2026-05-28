import CarBlock from './CarBlock'
import type { CarCongestionResult } from '../utils/calcCongestion'

interface SubwayGridProps {
  cars: CarCongestionResult[]
  loading: boolean
  directionLabel: string
}

export default function SubwayGrid({ cars, loading, directionLabel }: SubwayGridProps) {
  return (
    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
      <p className="text-xs text-slate-400 mb-4">← {directionLabel} 진행 방향</p>
      <div className="flex gap-1.5 overflow-x-auto pb-1 pt-3 [scrollbar-width:none] [-webkit-overflow-scrolling:touch]">
        {loading
          ? Array.from({ length: 10 }, (_, i) => (
              <div key={i} className="w-9 min-w-[36px] h-16 rounded-lg bg-slate-200 animate-pulse" />
            ))
          : cars.map(({ car, pct, isRecommended }) => (
              <CarBlock key={car} carNumber={car} pct={pct} isRecommended={isRecommended} />
            ))}
      </div>
    </div>
  )
}
