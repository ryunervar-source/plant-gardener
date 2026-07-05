// 계절 판별 및 일정(급수·비료·분갈이·점검 등) 계산 유틸.
// 모든 날짜는 로컬 자정 기준으로 정규화해 "며칠 남았는지"를 정수 일수로 다룬다.
import { getActivity } from '../data/activities.js'

export const CHECK_INTERVAL_DAYS = 7

/** 문자열/Date를 받아 로컬 자정 Date로 정규화 */
export function startOfDay(input) {
  const d = input ? new Date(input) : new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

/** 두 날짜 사이의 정수 일수 차 (b - a), 자정 기준 */
export function daysBetween(a, b) {
  const ms = startOfDay(b).getTime() - startOfDay(a).getTime()
  return Math.round(ms / 86400000)
}

/**
 * 현재 월 기준 계절 반환. 봄여름: 3~9월, 가을겨울: 10~2월
 */
export function getSeason(date = new Date()) {
  const m = date.getMonth() + 1
  return m >= 3 && m <= 9 ? 'summer' : 'winter'
}

export function seasonLabel(season) {
  return season === 'summer' ? '봄·여름' : '가을·겨울'
}

/** 계절에 맞는 물주기(일) 반환 */
export function currentWaterInterval(plant, date = new Date()) {
  const season = getSeason(date)
  return season === 'summer'
    ? Number(plant.water_summer_days)
    : Number(plant.water_winter_days)
}

/** 로그 항목 배열({date,...})에서 가장 최근 항목 반환 (없으면 null) */
export function lastEntry(log) {
  if (!log || log.length === 0) return null
  return log.reduce((a, b) => (new Date(b.date) > new Date(a.date) ? b : a))
}

/** 로그 항목 배열에서 가장 최근 날짜(ISO) 반환 (없으면 null) */
export function lastLogDate(log) {
  const e = lastEntry(log)
  return e ? e.date : null
}

/**
 * 특정 활동의 일정 상태 계산.
 * interval이 있으면 (마지막 기록일 + 주기) 기준 D-day 산출.
 * interval이 null이면 정기 알림 없는 이벤트 활동으로 hasSchedule=false.
 */
export function getActivityStatus(plant, key, today = new Date()) {
  const act = getActivity(key)
  const log = plant.logs?.[key] ?? []
  const last = lastEntry(log)

  let interval
  if (act.interval === 'seasonal') interval = currentWaterInterval(plant, today)
  else interval = plant.intervals?.[key] ?? act.interval

  const hasSchedule = interval != null

  if (!last) {
    return {
      key,
      act,
      interval,
      hasSchedule,
      neverDone: true,
      dday: null,
      dueDate: null,
      overdue: false,
      last: null,
      count: 0,
    }
  }
  if (!hasSchedule) {
    return {
      key, act, interval: null, hasSchedule: false, neverDone: false,
      dday: null, dueDate: null, overdue: false, last, count: log.length,
    }
  }
  const dueDate = startOfDay(last.date)
  dueDate.setDate(dueDate.getDate() + interval)
  const dday = daysBetween(today, dueDate)
  return {
    key, act, interval, hasSchedule: true, neverDone: false,
    dday, dueDate, overdue: dday < 0, last, count: log.length,
  }
}

/**
 * 급수 상태 (홈 카드·요약에서 사용). 급수는 기록이 없으면 '오늘 필요'로 간주.
 */
export function getWateringStatus(plant, today = new Date()) {
  const interval = currentWaterInterval(plant, today)
  const last = lastEntry(plant.logs?.water)
  if (!last) {
    return { dday: 0, dueDate: startOfDay(today), overdue: false, neverWatered: true, interval }
  }
  const dueDate = startOfDay(last.date)
  dueDate.setDate(dueDate.getDate() + interval)
  const dday = daysBetween(today, dueDate)
  return { dday, dueDate, overdue: dday < 0, neverWatered: false, interval }
}

/** 급수 상태 뱃지 레벨: 'overdue' | 'today' | 'soon' | 'ok' */
export function wateringLevel(status) {
  if (status.neverWatered || status.overdue) return 'overdue'
  if (status.dday === 0) return 'today'
  if (status.dday === 1) return 'soon'
  return 'ok'
}

/** 일반 활동 상태의 뱃지 레벨 */
export function activityLevel(status) {
  if (status.neverDone || !status.hasSchedule) return 'neutral'
  if (status.overdue) return 'overdue'
  if (status.dday === 0) return 'today'
  if (status.dday <= 2) return 'soon'
  return 'ok'
}

/**
 * 다음 점검 상태 계산. 마지막 점검 + 7일 지나면 밀림. 기록 없으면 밀림 간주.
 */
export function getCheckStatus(plant, today = new Date()) {
  const log = plant.checkLog ?? []
  if (log.length === 0) {
    return { dday: 0, nextDate: startOfDay(today), overdue: true, neverChecked: true }
  }
  const last = lastLogDate(log)
  const nextDate = startOfDay(last)
  nextDate.setDate(nextDate.getDate() + CHECK_INTERVAL_DAYS)
  const dday = daysBetween(today, nextDate)
  return { dday, nextDate, overdue: dday < 0, neverChecked: false }
}

/** D-day 숫자를 한국어 라벨로 */
export function ddayLabel(dday) {
  if (dday === 0) return '오늘'
  if (dday > 0) return `D-${dday}`
  return `${Math.abs(dday)}일 지남`
}

/** 장기 주기(분갈이 등)는 개월 단위로도 표기 */
export function ddayLabelSmart(dday, longTerm = false) {
  if (dday === 0) return '오늘'
  if (longTerm && Math.abs(dday) >= 45) {
    const months = Math.round(Math.abs(dday) / 30)
    return dday > 0 ? `약 ${months}개월 남음` : `약 ${months}개월 지남`
  }
  return ddayLabel(dday)
}

/** ISO 날짜를 'M월 D일 (요일)' 형태로 */
export function formatDate(iso) {
  const d = new Date(iso)
  const weekday = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()]
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${weekday})`
}

/** ISO 날짜를 'M/D HH:mm' 형태로 (타임라인용) */
export function formatDateTime(iso) {
  const d = new Date(iso)
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${d.getMonth() + 1}/${d.getDate()} ${hh}:${mm}`
}

/** ISO → <input type="date"> 값(YYYY-MM-DD, 로컬 기준) */
export function toDateInput(iso) {
  const d = iso ? new Date(iso) : new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

/**
 * <input type="date"> 값 → ISO. 같은 날짜면 원래 시각을 보존하고,
 * 날짜가 바뀌면 정오(12:00)로 설정해 시간대 경계 문제를 피한다.
 */
export function fromDateInput(str, prevIso) {
  const [y, m, d] = str.split('-').map(Number)
  const base = prevIso ? new Date(prevIso) : new Date()
  if (
    prevIso &&
    base.getFullYear() === y &&
    base.getMonth() === m - 1 &&
    base.getDate() === d
  ) {
    return base.toISOString()
  }
  const next = new Date(y, m - 1, d, 12, 0, 0, 0)
  return next.toISOString()
}
