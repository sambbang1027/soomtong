export interface CongestionData {
  congestion: number
  direction: '상행' | '하행' | '내선' | '외선'
}

export interface ArrivalData {
  message: string
  seconds: number
}

const CONGESTION_ENDPOINT =
  '/api/congestion/api/15071311/v1/uddi:a5158b81-27c7-4151-ba6c-b912a6f13d39'

function getTimeSlotKey(): string {
  const now = new Date()
  const hour = now.getHours()
  const min = now.getMinutes() < 30 ? '00' : '30'
  return `${hour}시${min}분`
}

function getDayType(): '평일' | '토요일' | '일요일' {
  const day = new Date().getDay()
  if (day === 0) return '일요일'
  if (day === 6) return '토요일'
  return '평일'
}

// 2호선은 내선/외선, 나머지는 상선/하선
function toApiDirection(
  lineNo: number,
  direction: '상행' | '하행' | '내선' | '외선',
): string {
  if (lineNo === 2) return direction === '내선' ? '내선' : '외선'
  return direction === '상행' ? '상행' : '하행'
}

function getMockCongestion(
  direction: CongestionData['direction'],
): CongestionData {
  console.warn('[숨통] 목업 데이터 사용 중 (혼잡도)')
  return { congestion: 68, direction }
}

function getMockArrival(): ArrivalData {
  console.warn('[숨통] 목업 데이터 사용 중 (도착 정보)')
  return { message: '2분 후 도착', seconds: 120 }
}

export async function fetchCongestion(
  stationName: string,
  lineNo: number,
  direction: CongestionData['direction'],
): Promise<CongestionData> {
  if (!import.meta.env.VITE_CONGESTION_API_KEY) {
    return getMockCongestion(direction)
  }

  try {
    const params = new URLSearchParams({
      serviceKey: import.meta.env.VITE_CONGESTION_API_KEY,
      page: '1',
      perPage: '1',
      'cond[역명::EQ]': stationName,
      'cond[호선::EQ]': String(lineNo),
      'cond[요일::EQ]': getDayType(),
      'cond[방향::EQ]': toApiDirection(lineNo, direction),
    })

    const res = await fetch(`${CONGESTION_ENDPOINT}?${params}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()

    const row = json?.data?.[0]
    if (!row) throw new Error('혼잡도 데이터 없음')

    const key = getTimeSlotKey()
    const value = parseFloat(row[key])
    if (isNaN(value)) throw new Error(`시간대 키 없음: ${key}`)

    return { congestion: value, direction }
  } catch (e) {
    console.warn('[숨통] 혼잡도 API 오류, 목업 폴백:', e)
    return getMockCongestion(direction)
  }
}

export async function fetchArrival(stationName: string): Promise<ArrivalData> {
  if (!import.meta.env.VITE_ARRIVAL_API_KEY) {
    return getMockArrival()
  }

  try {
    const encoded = encodeURIComponent(stationName)
    const res = await fetch(
      `/api/arrival/api/subway/${import.meta.env.VITE_ARRIVAL_API_KEY}/json/realtimeStationArrival/0/5/${encoded}`,
    )
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()

    const item = json?.realtimeArrivalList?.[0]
    if (!item) throw new Error('도착 정보 없음')

    const seconds = Number(item.barvlDt)
    const minutes = Math.ceil(seconds / 60)
    const message = seconds <= 60 ? '곧 도착' : `${minutes}분 후 도착`

    return { message, seconds }
  } catch (e) {
    console.warn('[숨통] 도착 정보 API 오류, 목업 폴백:', e)
    return getMockArrival()
  }
}
