// 계절 판별 및 물주기/점검 일정 계산 유틸.
// 모든 날짜는 로컬 자정 기준으로 정규화해 "며칠 남았는지"를 정수 일수로 다룬다.

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
 * 현재 월 기준 계절 반환.
 * 봄여름: 3~9월, 가을겨울: 10~2월
 */
export function getSeason(date = new Date()) {
  const m = date.getMonth() + 1 // 1~12
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

/** 로그 배열에서 가장 최근 날짜 반환 (없으면 null) */
export function lastLogDate(log) {
  if (!log || log.length === 0) return null
  return log.reduce((latest, cur) =>
    new Date(cur) > new Date(latest) ? cur : latest,
  )
}

/**
 * 다음 급수 예정일과 D-day 계산.
 * D-day = (마지막 급수일 + 계절 주기) - 오늘.  값이 음수면 지남.
 * 급수 기록이 없으면 오늘 당장 필요한 것으로 간주(due: true).
 */
export function getWateringStatus(plant, today = new Date()) {
  const interval = currentWaterInterval(plant, today)
  const last = lastLogDate(plant.wateringLog)

  if (!last) {
    return { dday: 0, dueDate: startOfDay(today), overdue: false, neverWatered: true, interval }
  }

  const dueDate = startOfDay(last)
  dueDate.setDate(dueDate.getDate() + interval)
  const dday = daysBetween(today, dueDate) // 남은 일수
  return {
    dday,
    dueDate,
    overdue: dday < 0,
    neverWatered: false,
    interval,
  }
}

/** 급수 상태 뱃지 레벨 반환: 'overdue' | 'today' | 'soon' | 'ok' */
export function wateringLevel(status) {
  if (status.neverWatered || status.overdue) return 'overdue'
  if (status.dday === 0) return 'today'
  if (status.dday === 1) return 'soon'
  return 'ok'
}

/**
 * 다음 점검 상태 계산.
 * 마지막 점검일 + 7일이 지났으면 밀림(overdue).
 * 점검 기록이 없으면 밀린 것으로 간주.
 */
export function getCheckStatus(plant, today = new Date()) {
  const log = plant.checkLog ?? []
  if (log.length === 0) {
    return { dday: 0, nextDate: startOfDay(today), overdue: true, neverChecked: true }
  }
  const last = lastLogDate(log.map((c) => c.date))
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

/** ISO 날짜 문자열을 'M월 D일 (요일)' 형태로 */
export function formatDate(iso) {
  const d = new Date(iso)
  const weekday = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()]
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${weekday})`
}

/** ISO 날짜 문자열을 'M/D HH:mm' 형태로 (타임라인용) */
export function formatDateTime(iso) {
  const d = new Date(iso)
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${d.getMonth() + 1}/${d.getDate()} ${hh}:${mm}`
}
