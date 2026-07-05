import { Link } from 'react-router-dom'
import { usePlants } from '../hooks/usePlants.jsx'
import TodaySummary from '../components/home/TodaySummary.jsx'
import PlantCard from '../components/home/PlantCard.jsx'
import EmptyState from '../components/home/EmptyState.jsx'
import { getWateringStatus, wateringLevel } from '../lib/schedule.js'

// 급수 급한 순으로 정렬 (지난 것 → 오늘 → 여유)
function sortByUrgency(plants) {
  const rank = { overdue: 0, today: 1, soon: 2, ok: 3 }
  return [...plants].sort((a, b) => {
    const la = wateringLevel(getWateringStatus(a))
    const lb = wateringLevel(getWateringStatus(b))
    if (rank[la] !== rank[lb]) return rank[la] - rank[lb]
    return getWateringStatus(a).dday - getWateringStatus(b).dday
  })
}

export default function HomePage() {
  const { plants } = usePlants()

  if (plants.length === 0) return <EmptyState />

  const sorted = sortByUrgency(plants)

  return (
    <div className="space-y-4">
      <TodaySummary plants={plants} />

      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-semibold text-sand-500">
          내 식물 {plants.length}
        </h2>
        <Link to="/plant/new" className="text-sm font-semibold text-leaf-600">
          + 식물 추가
        </Link>
      </div>

      <div className="space-y-3">
        {sorted.map((p) => (
          <PlantCard key={p.id} plant={p} />
        ))}
      </div>
    </div>
  )
}
