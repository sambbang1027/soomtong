import type { CongestionData } from '../api/subway'

export interface StationInfo {
  name: string
  lineNo: number
  lat: number
  lng: number
  directionType: 'circular' | 'linear' // circular = 내선/외선, linear = 상행/하행
}

export const STATIONS: StationInfo[] = [
  // 2호선 (순환선)
  { name: '강남', lineNo: 2, lat: 37.4979, lng: 127.0276, directionType: 'circular' },
  { name: '선릉', lineNo: 2, lat: 37.5045, lng: 127.0494, directionType: 'circular' },
  { name: '삼성', lineNo: 2, lat: 37.5088, lng: 127.0632, directionType: 'circular' },
  { name: '잠실', lineNo: 2, lat: 37.5133, lng: 127.1001, directionType: 'circular' },
  { name: '홍대입구', lineNo: 2, lat: 37.5572, lng: 126.9245, directionType: 'circular' },
  { name: '신림', lineNo: 2, lat: 37.4845, lng: 126.9294, directionType: 'circular' },
  { name: '사당', lineNo: 2, lat: 37.4762, lng: 126.9817, directionType: 'circular' },
  { name: '신도림', lineNo: 2, lat: 37.5086, lng: 126.8911, directionType: 'circular' },
  { name: '교대', lineNo: 2, lat: 37.4929, lng: 127.0138, directionType: 'circular' },
  { name: '왕십리', lineNo: 2, lat: 37.5613, lng: 127.0374, directionType: 'circular' },
  { name: '합정', lineNo: 2, lat: 37.5499, lng: 126.9135, directionType: 'circular' },
  // 1호선
  { name: '서울역', lineNo: 1, lat: 37.5546, lng: 126.9707, directionType: 'linear' },
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
