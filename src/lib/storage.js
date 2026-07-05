// localStorage 저장소 래퍼. 스키마 버전 필드로 마이그레이션에 대비한다.
import { CORE_ACTIVITY_KEYS, ACTIVITY_MAP } from '../data/activities.js'

export const STORAGE_KEY = 'plant-gardener'
export const SCHEMA_VERSION = 2

/** 고유 id 생성 (crypto.randomUUID 우선) */
export function makeId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return 'p_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

function emptyState() {
  return {
    version: SCHEMA_VERSION,
    plants: [],
    settings: {},
  }
}

// 활동별 기본 주기(일). 식물에 intervals 오버라이드가 없을 때 활동 정의값 사용.
function defaultIntervals(activityKeys) {
  const out = {}
  for (const key of activityKeys) {
    const act = ACTIVITY_MAP[key]
    if (act && typeof act.interval === 'number') out[key] = act.interval
  }
  return out
}

// v1 로그(문자열 배열) 또는 v2 로그(객체 배열)를 표준 항목 배열로 변환
function normalizeLog(arr) {
  return (arr ?? []).map((e) => {
    if (typeof e === 'string') return { id: makeId(), date: e, value: '' }
    return {
      id: e.id ?? makeId(),
      date: e.date ?? e.when ?? new Date().toISOString(),
      value: e.value ?? e.amount ?? e.note ?? '',
    }
  })
}

/**
 * 식물 하나를 최신 스키마(v2)로 표준화.
 * 신규 등록(hydratePlant)과 마이그레이션에서 공통으로 사용한다.
 */
export function normalizePlant(p) {
  const activities =
    Array.isArray(p.activities) && p.activities.length
      ? Array.from(new Set([...CORE_ACTIVITY_KEYS, ...p.activities]))
      : [...CORE_ACTIVITY_KEYS]

  // logs: v2의 logs 객체가 있으면 정규화, 없으면 v1 배열에서 이관
  let logs
  if (p.logs && typeof p.logs === 'object') {
    logs = Object.fromEntries(
      Object.entries(p.logs).map(([k, v]) => [k, normalizeLog(v)]),
    )
  } else {
    logs = {
      water: normalizeLog(p.wateringLog),
      fertilizer: normalizeLog(p.fertilizerLog),
      repot: normalizeLog(p.repotLog),
    }
  }
  // 활성 활동의 로그 키는 항상 존재하도록 보정
  for (const key of activities) if (!logs[key]) logs[key] = []

  const checkLog = (p.checkLog ?? []).map((c) => ({
    id: c.id ?? makeId(),
    date: c.date ?? new Date().toISOString(),
    items: c.items ?? {},
    note: c.note ?? '',
  }))

  const intervals = { ...defaultIntervals(activities), ...(p.intervals ?? {}) }

  // 구버전 잔여 필드 제거
  const { wateringLog, fertilizerLog, repotLog, ...rest } = p

  return {
    photo: null,
    special_checks: [],
    ...rest,
    activities,
    intervals,
    logs,
    checkLog,
  }
}

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
    if (err && err.name === 'QuotaExceededError') {
      alert(
        '저장 공간이 부족합니다. 사진 용량이 큰 식물이 있는지 확인하거나 일부 데이터를 정리해 주세요.',
      )
    }
    return false
  }
}

/**
 * 버전 마이그레이션.
 * v1(급수/비료 문자열 배열) → v2(활동별 logs 객체 + intervals + activities).
 * 기존 사용자의 급수·비료·점검 기록은 모두 보존된다.
 */
export function migrate(state) {
  if (!state || typeof state !== 'object') return emptyState()
  const s = { ...emptyState(), ...state }
  s.plants = (s.plants ?? []).map(normalizePlant)
  s.version = SCHEMA_VERSION
  return s
}

export { emptyState }
