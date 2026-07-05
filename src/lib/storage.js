// localStorage 저장소 래퍼. 스키마 버전 필드를 두어 추후 마이그레이션에 대비한다.

export const STORAGE_KEY = 'plant-gardener'
export const SCHEMA_VERSION = 1

function emptyState() {
  return {
    version: SCHEMA_VERSION,
    plants: [],
    settings: {},
  }
}

/**
 * 저장된 상태를 읽어온다.
 * - 없으면 null 반환 (usePlants 에서 시드 데이터로 초기화)
 * - 구버전이면 migrate 를 거친다.
 */
export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return migrate(parsed)
  } catch (err) {
    console.error('저장소 로드 실패:', err)
    return null
  }
}

export function saveState(state) {
  try {
    const toSave = { ...state, version: SCHEMA_VERSION }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
    return true
  } catch (err) {
    console.error('저장소 저장 실패:', err)
    // 용량 초과(주로 사진 base64) 시 사용자에게 알림
    if (err && err.name === 'QuotaExceededError') {
      alert(
        '저장 공간이 부족합니다. 사진 용량이 큰 식물이 있는지 확인하거나 일부 데이터를 정리해 주세요.',
      )
    }
    return false
  }
}

/**
 * 버전 마이그레이션 지점.
 * 현재는 v1 뿐이라 필드 보정만 수행. 이후 버전이 생기면
 * if (state.version < 2) { ... } 형태로 단계적으로 올린다.
 */
export function migrate(state) {
  if (!state || typeof state !== 'object') return emptyState()

  let s = { ...emptyState(), ...state }

  // 각 식물의 필수 로그 필드 보정
  s.plants = (s.plants ?? []).map((p) => ({
    photo: null,
    special_checks: [],
    wateringLog: [],
    fertilizerLog: [],
    checkLog: [],
    ...p,
  }))

  s.version = SCHEMA_VERSION
  return s
}

export { emptyState }
