import { Link } from 'react-router-dom'
import { getWateringStatus, getCheckStatus, getSeason, seasonLabel } from '../../lib/schedule.js'

export default function TodaySummary({ plants }) {
  const needWater = plants.filter((p) => {
    const w = getWateringStatus(p)
    return w.neverWatered || w.dday <= 0
  })
  const needCheck = plants.filter((p) => getCheckStatus(p).overdue)

  const season = seasonLabel(getSeason())
  const nothing = needWater.length === 0 && needCheck.length === 0

  return (
    <section className="card overflow-hidden">
      <div className="flex items-center justify-between bg-leaf-600 px-4 py-3 text-white">
        <h2 className="text-base font-bold">오늘 할 일</h2>
        <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold">
          {season} 기준
        </span>
      </div>
      <div className="divide-y divide-sand-100">
        {nothing ? (
          <p className="px-4 py-4 text-sm text-sand-500">
            🎉 오늘은 급한 일이 없어요. 모든 식물이 여유로워요.
          </p>
        ) : (
          <>
            <SummaryRow
              icon="💧"
              label="오늘 물 줄 식물"
              items={needWater}
              tone="water"
            />
            <SummaryRow
              icon="🔍"
              label="점검 밀린 식물"
              items={needCheck}
              tone="check"
            />
          </>
        )}
      </div>
    </section>
  )
}

function SummaryRow({ icon, label, items, tone }) {
  if (items.length === 0) return null
  return (
    <div className="px-4 py-3">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-leaf-800">
        <span>{icon}</span>
        <span>{label}</span>
        <span
          className={`ml-auto rounded-full px-2 py-0.5 text-xs ${
            tone === 'water'
              ? 'bg-red-100 text-red-700'
              : 'bg-amber-100 text-amber-800'
          }`}
        >
          {items.length}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((p) => (
          <Link
            key={p.id}
            to={`/plant/${p.id}`}
            className="rounded-full bg-sand-100 px-3 py-1 text-sm font-medium text-leaf-800 hover:bg-sand-200"
          >
            {p.name}
          </Link>
        ))}
      </div>
    </div>
  )
}
