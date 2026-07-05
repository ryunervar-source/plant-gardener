// 관리 활동 정의 (급수/비료/분갈이 + 추가 항목).
//  kind: 'amount' → 양 입력(급수·비료), 'note' → 메모 입력(그 외)
//  interval: 기본 주기(일). 'seasonal'은 급수 특수 처리(식물별 계절 필드 사용),
//            null은 정기 알림 없이 이벤트만 기록(개화·성장·수확 등).
//  core: 항상 켜지는 핵심 활동. longTerm: D-day를 개월 단위로도 표기(분갈이).

export const ACTIVITIES = [
  { key: 'water', label: '급수', emoji: '💧', kind: 'amount', interval: 'seasonal', core: true },
  { key: 'fertilizer', label: '비료', emoji: '🌾', kind: 'amount', interval: 14, core: true },
  { key: 'repot', label: '분갈이', emoji: '🪴', kind: 'note', interval: 365, core: true, longTerm: true },
  { key: 'rotate', label: '화분 돌리기', emoji: '🔄', kind: 'note', interval: 7 },
  { key: 'mist', label: '분무', emoji: '💦', kind: 'note', interval: 3 },
  { key: 'prune', label: '가지치기', emoji: '✂️', kind: 'note', interval: 60 },
  { key: 'pest', label: '병충해 방제', emoji: '🛡️', kind: 'note', interval: 14 },
  { key: 'bloom', label: '개화·열매', emoji: '🌸', kind: 'note', interval: null },
  { key: 'growth', label: '성장 측정', emoji: '📏', kind: 'note', interval: null },
  { key: 'harvest', label: '수확', emoji: '🌿', kind: 'note', interval: null },
  { key: 'tonic', label: '영양제', emoji: '💊', kind: 'note', interval: 30 },
]

export const ACTIVITY_MAP = Object.fromEntries(ACTIVITIES.map((a) => [a.key, a]))

// 항상 켜지는 핵심 활동
export const CORE_ACTIVITY_KEYS = ACTIVITIES.filter((a) => a.core).map((a) => a.key)
// 사용자가 켜고 끌 수 있는 선택 활동
export const OPTIONAL_ACTIVITIES = ACTIVITIES.filter((a) => !a.core)

export function getActivity(key) {
  return (
    ACTIVITY_MAP[key] ?? { key, label: key, emoji: '📝', kind: 'note', interval: null }
  )
}

// 활동 값 입력의 라벨/플레이스홀더
export function valueFieldMeta(activity) {
  if (activity.kind === 'amount') {
    return { label: '양', placeholder: '예: 1.2L' }
  }
  return { label: '메모', placeholder: '예: 상태·특이사항 (선택)' }
}
