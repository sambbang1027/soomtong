import type { CongestionData } from '../api/subway'

export interface StationInfo {
  name: string
  lineNo: number
  lat: number
  lng: number
  directionType: 'circular' | 'linear' // circular = 내선/외선, linear = 상행/하행
}

export const STATIONS: StationInfo[] = [
  // ── 1호선 ──────────────────────────────────────────────────────────────
  { name: '종각', lineNo: 1, lat: 37.5697, lng: 126.9823, directionType: 'linear' },
  { name: '종로3가', lineNo: 1, lat: 37.5707, lng: 126.9917, directionType: 'linear' },
  { name: '동대문', lineNo: 1, lat: 37.5714, lng: 127.0097, directionType: 'linear' },
  { name: '서울역', lineNo: 1, lat: 37.5546, lng: 126.9707, directionType: 'linear' },
  { name: '용산', lineNo: 1, lat: 37.5296, lng: 126.9644, directionType: 'linear' },
  { name: '노량진', lineNo: 1, lat: 37.5134, lng: 126.9428, directionType: 'linear' },
  { name: '영등포', lineNo: 1, lat: 37.5158, lng: 126.9067, directionType: 'linear' },
  { name: '구로', lineNo: 1, lat: 37.4993, lng: 126.8899, directionType: 'linear' },

  // ── 2호선 순환선 ────────────────────────────────────────────────────────
  // 시청 → 을지로 → 왕십리 → (동부 간선) → 천호 → 잠실 → 강남 → 사당 → 신도림 → 홍대입구 → 시청
  { name: '시청', lineNo: 2, lat: 37.5645, lng: 126.9771, directionType: 'circular' },
  { name: '을지로입구', lineNo: 2, lat: 37.5660, lng: 126.9822, directionType: 'circular' },
  { name: '을지로3가', lineNo: 2, lat: 37.5668, lng: 126.9921, directionType: 'circular' },
  { name: '을지로4가', lineNo: 2, lat: 37.5668, lng: 127.0005, directionType: 'circular' },
  { name: '동대문역사문화공원', lineNo: 2, lat: 37.5649, lng: 127.0093, directionType: 'circular' },
  { name: '신당', lineNo: 2, lat: 37.5630, lng: 127.0197, directionType: 'circular' },
  { name: '상왕십리', lineNo: 2, lat: 37.5625, lng: 127.0291, directionType: 'circular' },
  { name: '왕십리', lineNo: 2, lat: 37.5613, lng: 127.0374, directionType: 'circular' },
  { name: '마장', lineNo: 2, lat: 37.5601, lng: 127.0451, directionType: 'circular' },
  { name: '답십리', lineNo: 2, lat: 37.5609, lng: 127.0566, directionType: 'circular' },
  { name: '장한평', lineNo: 2, lat: 37.5597, lng: 127.0682, directionType: 'circular' },
  { name: '군자', lineNo: 2, lat: 37.5586, lng: 127.0796, directionType: 'circular' },
  { name: '아차산', lineNo: 2, lat: 37.5543, lng: 127.0921, directionType: 'circular' },
  { name: '광나루', lineNo: 2, lat: 37.5456, lng: 127.0988, directionType: 'circular' },
  { name: '천호', lineNo: 2, lat: 37.5384, lng: 127.1237, directionType: 'circular' },
  { name: '잠실', lineNo: 2, lat: 37.5133, lng: 127.1001, directionType: 'circular' },
  { name: '종합운동장', lineNo: 2, lat: 37.5108, lng: 127.0734, directionType: 'circular' },
  { name: '삼성', lineNo: 2, lat: 37.5088, lng: 127.0632, directionType: 'circular' },
  { name: '선릉', lineNo: 2, lat: 37.5045, lng: 127.0494, directionType: 'circular' },
  { name: '역삼', lineNo: 2, lat: 37.5007, lng: 127.0364, directionType: 'circular' },
  { name: '강남', lineNo: 2, lat: 37.4979, lng: 127.0276, directionType: 'circular' },
  { name: '교대', lineNo: 2, lat: 37.4929, lng: 127.0138, directionType: 'circular' },
  { name: '서초', lineNo: 2, lat: 37.4838, lng: 127.0116, directionType: 'circular' },
  { name: '방배', lineNo: 2, lat: 37.4813, lng: 126.9998, directionType: 'circular' },
  { name: '사당', lineNo: 2, lat: 37.4762, lng: 126.9817, directionType: 'circular' },
  { name: '낙성대', lineNo: 2, lat: 37.4784, lng: 126.9630, directionType: 'circular' },
  { name: '서울대입구', lineNo: 2, lat: 37.4815, lng: 126.9527, directionType: 'circular' },
  { name: '봉천', lineNo: 2, lat: 37.4806, lng: 126.9400, directionType: 'circular' },
  { name: '신림', lineNo: 2, lat: 37.4845, lng: 126.9294, directionType: 'circular' },
  { name: '신대방', lineNo: 2, lat: 37.4871, lng: 126.9134, directionType: 'circular' },
  { name: '구로디지털단지', lineNo: 2, lat: 37.4855, lng: 126.9012, directionType: 'circular' },
  { name: '대림', lineNo: 2, lat: 37.4935, lng: 126.8958, directionType: 'circular' },
  { name: '신도림', lineNo: 2, lat: 37.5086, lng: 126.8911, directionType: 'circular' },
  { name: '문래', lineNo: 2, lat: 37.5187, lng: 126.8960, directionType: 'circular' },
  { name: '영등포구청', lineNo: 2, lat: 37.5260, lng: 126.8964, directionType: 'circular' },
  { name: '당산', lineNo: 2, lat: 37.5344, lng: 126.9009, directionType: 'circular' },
  { name: '합정', lineNo: 2, lat: 37.5499, lng: 126.9135, directionType: 'circular' },
  { name: '홍대입구', lineNo: 2, lat: 37.5572, lng: 126.9245, directionType: 'circular' },
  { name: '신촌', lineNo: 2, lat: 37.5553, lng: 126.9369, directionType: 'circular' },
  { name: '이대', lineNo: 2, lat: 37.5563, lng: 126.9464, directionType: 'circular' },
  { name: '아현', lineNo: 2, lat: 37.5560, lng: 126.9569, directionType: 'circular' },
  { name: '충정로', lineNo: 2, lat: 37.5592, lng: 126.9647, directionType: 'circular' },
  // 2호선 성수지선 (왕십리↔잠실 북측 경로)
  { name: '한양대', lineNo: 2, lat: 37.5556, lng: 127.0451, directionType: 'circular' },
  { name: '뚝섬', lineNo: 2, lat: 37.5474, lng: 127.0478, directionType: 'circular' },
  { name: '성수', lineNo: 2, lat: 37.5444, lng: 127.0569, directionType: 'circular' },
  { name: '건대입구', lineNo: 2, lat: 37.5403, lng: 127.0706, directionType: 'circular' },
  { name: '구의', lineNo: 2, lat: 37.5440, lng: 127.0942, directionType: 'circular' },
  { name: '강변', lineNo: 2, lat: 37.5341, lng: 127.0944, directionType: 'circular' },
  { name: '잠실나루', lineNo: 2, lat: 37.5189, lng: 127.0932, directionType: 'circular' },

  // ── 3호선 ──────────────────────────────────────────────────────────────
  { name: '경복궁', lineNo: 3, lat: 37.5760, lng: 126.9746, directionType: 'linear' },
  { name: '안국', lineNo: 3, lat: 37.5766, lng: 126.9850, directionType: 'linear' },
  { name: '종로3가', lineNo: 3, lat: 37.5707, lng: 126.9917, directionType: 'linear' },
  { name: '을지로3가', lineNo: 3, lat: 37.5668, lng: 126.9921, directionType: 'linear' },
  { name: '충무로', lineNo: 3, lat: 37.5606, lng: 127.0059, directionType: 'linear' },
  { name: '동대입구', lineNo: 3, lat: 37.5533, lng: 127.0071, directionType: 'linear' },
  { name: '약수', lineNo: 3, lat: 37.5491, lng: 127.0145, directionType: 'linear' },
  { name: '금호', lineNo: 3, lat: 37.5467, lng: 127.0222, directionType: 'linear' },
  { name: '옥수', lineNo: 3, lat: 37.5408, lng: 127.0179, directionType: 'linear' },
  { name: '압구정', lineNo: 3, lat: 37.5269, lng: 127.0289, directionType: 'linear' },
  { name: '신사', lineNo: 3, lat: 37.5166, lng: 127.0204, directionType: 'linear' },
  { name: '잠원', lineNo: 3, lat: 37.5126, lng: 127.0145, directionType: 'linear' },
  { name: '고속터미널', lineNo: 3, lat: 37.5049, lng: 127.0048, directionType: 'linear' },
  { name: '교대', lineNo: 3, lat: 37.4929, lng: 127.0138, directionType: 'linear' },
  { name: '남부터미널', lineNo: 3, lat: 37.4859, lng: 127.0148, directionType: 'linear' },
  { name: '양재', lineNo: 3, lat: 37.4840, lng: 127.0347, directionType: 'linear' },

  // ── 4호선 ──────────────────────────────────────────────────────────────
  { name: '혜화', lineNo: 4, lat: 37.5822, lng: 127.0017, directionType: 'linear' },
  { name: '동대문', lineNo: 4, lat: 37.5714, lng: 127.0097, directionType: 'linear' },
  { name: '동대문역사문화공원', lineNo: 4, lat: 37.5649, lng: 127.0093, directionType: 'linear' },
  { name: '충무로', lineNo: 4, lat: 37.5606, lng: 127.0059, directionType: 'linear' },
  { name: '명동', lineNo: 4, lat: 37.5606, lng: 126.9855, directionType: 'linear' },
  { name: '회현', lineNo: 4, lat: 37.5582, lng: 126.9782, directionType: 'linear' },
  { name: '서울역', lineNo: 4, lat: 37.5546, lng: 126.9707, directionType: 'linear' },
  { name: '숙대입구', lineNo: 4, lat: 37.5457, lng: 126.9730, directionType: 'linear' },
  { name: '삼각지', lineNo: 4, lat: 37.5368, lng: 126.9711, directionType: 'linear' },
  { name: '신용산', lineNo: 4, lat: 37.5296, lng: 126.9611, directionType: 'linear' },
  { name: '이촌', lineNo: 4, lat: 37.5160, lng: 126.9627, directionType: 'linear' },
  { name: '동작', lineNo: 4, lat: 37.5000, lng: 126.9803, directionType: 'linear' },
  { name: '이수', lineNo: 4, lat: 37.4869, lng: 126.9813, directionType: 'linear' },
  { name: '사당', lineNo: 4, lat: 37.4762, lng: 126.9817, directionType: 'linear' },
]

export function getDefaultDirection(
  directionType: StationInfo['directionType'],
): CongestionData['direction'] {
  return directionType === 'circular' ? '내선' : '상행'
}

export function getDirectionOptions(
  directionType: StationInfo['directionType'],
): CongestionData['direction'][] {
  return directionType === 'circular' ? ['내선', '외선'] : ['상행', '하행']
}

// 방향 버튼에 표시할 행선지 (종점역 기준)
const LINE_DIRECTION_LABEL: Record<number, Partial<Record<CongestionData['direction'], string>>> = {
  1: { 상행: '소요산행', 하행: '신창행' },
  2: { 내선: '내선 ↺', 외선: '외선 ↻' },
  3: { 상행: '대화행', 하행: '오금행' },
  4: { 상행: '당고개행', 하행: '오이도행' },
}

export function getDirectionLabel(lineNo: number, direction: CongestionData['direction']): string {
  return LINE_DIRECTION_LABEL[lineNo]?.[direction] ?? direction
}
