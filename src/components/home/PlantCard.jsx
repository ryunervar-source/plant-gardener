import { Link } from 'react-router-dom'
import Badge from '../common/Badge.jsx'
import PlantAvatar from '../common/PlantAvatar.jsx'
import {
  getWateringStatus,
  wateringLevel,
  ddayLabel,
  getCheckStatus,
} from '../../lib/schedule.js'

const WATER_TEXT = {
  overdue: '물 확인 필요',
  today: '오늘 급수',
  soon: '내일 급수',
  ok: '급수 여유',
}

export default function PlantCard({ plant }) {
  const water = getWateringStatus(plant)
  const level = wateringLevel(water)
  const check = getCheckStatus(plant)

  return (
    <Link
      to={`/plant/${plant.id}`}
      className="card flex items-center gap-4 p-3 active:bg-sand-50"
    >
      <PlantAvatar plant={plant} size="md" className="shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-base font-bold text-leaf-900">
            {plant.name}
          </h3>
        </div>
        <p className="truncate text-xs text-sand-400">{plant.latin}</p>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <Badge level={level}>
            💧 {WATER_TEXT[level]}
            {!water.neverWatered && level !== 'overdue' && (
              <span className="opacity-70">· {ddayLabel(water.dday)}</span>
            )}
          </Badge>
          {check.overdue && <Badge level="today">🔍 점검 밀림</Badge>}
        </div>
      </div>
      <div className="shrink-0 text-right">
        <div
          className={`text-lg font-extrabold ${
            level === 'overdue' ? 'text-red-600' : 'text-leaf-700'
          }`}
        >
          {water.neverWatered ? '—' : ddayLabel(water.dday)}
        </div>
        <div className="text-[11px] text-sand-400">다음 급수</div>
      </div>
    </Link>
  )
}
