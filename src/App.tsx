import { useState } from 'react'
import { useCongestion } from './hooks/useCongestion'
import type { CongestionData } from './api/subway'
import { getLevel, LEVEL_CONFIG } from './utils/congestion'

const STATIONS = ['강남', '선릉', '홍대입구', '신도림', '서울역']
type Direction = CongestionData['direction']

function App() {
  const [station, setStation] = useState('강남')
  const [direction, setDirection] = useState<Direction>('내선')
  const lineNo = station === '서울역' ? 1 : 2

  const { cars, loading, error, refetch } = useCongestion(station, lineNo, direction)

  return (
    <div style={{ padding: 24, fontFamily: 'monospace', background: '#111', color: '#eee', minHeight: '100vh' }}>
      <h2>숨통 — 테스트 화면</h2>

      <div style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {STATIONS.map((s) => (
          <button key={s} onClick={() => setStation(s)}
            style={{ padding: '6px 12px', background: station === s ? '#6366f1' : '#333', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
            {s}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
        {(['내선', '외선', '상행', '하행'] as Direction[]).map((d) => (
          <button key={d} onClick={() => setDirection(d)}
            style={{ padding: '6px 12px', background: direction === d ? '#0ea5e9' : '#333', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
            {d}
          </button>
        ))}
        <button onClick={refetch}
          style={{ padding: '6px 12px', background: '#333', color: '#aaa', border: '1px solid #555', borderRadius: 6, cursor: 'pointer' }}>
          새로고침
        </button>
      </div>

      {loading && <p>불러오는 중...</p>}
      {error && <p style={{ color: '#f87171' }}>{error}</p>}

      {!loading && cars.length > 0 && (
        <>
          <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
            {cars.map(({ car, pct, isRecommended }) => {
              const cfg = LEVEL_CONFIG[getLevel(pct)]
              return (
                <div key={car} style={{
                  width: 56, padding: '10px 0', textAlign: 'center', borderRadius: 8,
                  background: cfg.hex + (isRecommended ? 'ff' : '55'),
                  border: isRecommended ? `2px solid ${cfg.hex}` : '2px solid transparent',
                  fontWeight: isRecommended ? 'bold' : 'normal',
                }}>
                  <div style={{ fontSize: 12 }}>{car}번</div>
                  <div style={{ fontSize: 11, marginTop: 4 }}>{cfg.label}</div>
                  {isRecommended && <div style={{ fontSize: 10, marginTop: 2 }}>★</div>}
                </div>
              )
            })}
          </div>
          <p>추천 칸: {cars.filter((c) => c.isRecommended).map((c) => `${c.car}번`).join(', ')}</p>
        </>
      )}
    </div>
  )
}

export default App
