import { getLevelConfig } from '../utils/congestion'
import type { CarCongestionResult } from '../utils/calcCongestion'

interface RecommendBannerProps {
  cars: CarCongestionResult[]
  loading: boolean
}

export default function RecommendBanner({ cars, loading }: RecommendBannerProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
        <div className="h-6 w-52 bg-slate-200 rounded animate-pulse mb-2" />
        <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
      </div>
    )
  }

  const recommended = cars.filter((c) => c.isRecommended)
  if (!recommended.length) return null

  const cfg = getLevelConfig(recommended[0].pct)
  const carNames = recommended.map((c) => `${c.car}번`).join('·')

  return (
    <div className={`rounded-xl p-5 border ${cfg.borderClass} ${cfg.bgDimClass}`}>
      <p className="text-xl font-bold text-slate-900 leading-snug">
        지금은 {carNames} 칸이<br />가장 숨통 트입니다!
      </p>
      <p className={`text-sm mt-2 font-medium ${cfg.textClass}`}>
        {cfg.label} · {cfg.desc}
      </p>
    </div>
  )
}
