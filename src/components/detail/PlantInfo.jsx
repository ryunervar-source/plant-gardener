import {
  currentWaterInterval,
  getSeason,
  seasonLabel,
} from '../../lib/schedule.js'

function Row({ label, children }) {
  if (!children) return null
  return (
    <div className="flex gap-3 px-4 py-3">
      <dt className="w-24 shrink-0 text-sm font-semibold text-sand-500">{label}</dt>
      <dd className="flex-1 text-sm text-leaf-900 whitespace-pre-wrap">{children}</dd>
    </div>
  )
}

export default function PlantInfo({ plant }) {
  const season = getSeason()
  const interval = currentWaterInterval(plant)

  return (
    <section className="card overflow-hidden">
      <dl className="divide-y divide-sand-100">
        <Row label="학명">{plant.latin}</Row>
        <Row label="화분 크기">{plant.pot}</Row>
        <div className="flex gap-3 bg-leaf-50 px-4 py-3">
          <dt className="w-24 shrink-0 text-sm font-semibold text-leaf-700">
            물 주기
          </dt>
          <dd className="flex-1 text-sm text-leaf-900">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-leaf-600 px-2 py-0.5 text-xs font-bold text-white">
                {seasonLabel(season)} · {interval}일마다
              </span>
            </div>
            <p className="mt-1.5 text-xs text-sand-500">
              봄·여름 {plant.water_summer_days}일 / 가을·겨울{' '}
              {plant.water_winter_days}일 (현재 월 기준 자동 적용)
            </p>
          </dd>
        </div>
        <Row label="1회 물 양">{plant.water_amount}</Row>
        <Row label="빛 요구량">{plant.light}</Row>
        <Row label="비료">{plant.fertilizer}</Row>
        <Row label="주의사항">{plant.cautions}</Row>
      </dl>
    </section>
  )
}
