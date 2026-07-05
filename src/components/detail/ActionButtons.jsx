import { usePlants } from '../../hooks/usePlants.jsx'
import {
  getWateringStatus,
  wateringLevel,
  ddayLabel,
  lastLogDate,
  formatDate,
} from '../../lib/schedule.js'

export default function ActionButtons({ plant }) {
  const { logWatering, logFertilizer } = usePlants()
  const water = getWateringStatus(plant)
  const level = wateringLevel(water)
  const lastWater = lastLogDate(plant.wateringLog)
  const lastFert = lastLogDate(plant.fertilizerLog)

  return (
    <section className="card p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-sand-500">다음 급수</p>
          <p
            className={`text-2xl font-extrabold ${
              level === 'overdue' ? 'text-red-600' : 'text-leaf-700'
            }`}
          >
            {water.neverWatered ? '기록 없음' : ddayLabel(water.dday)}
          </p>
        </div>
        {level === 'overdue' && !water.neverWatered && (
          <span className="rounded-full bg-red-100 px-3 py-1.5 text-sm font-bold text-red-700">
            💧 물 확인 필요
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button className="btn-primary" onClick={() => logWatering(plant.id)}>
          💧 물 줬어요
        </button>
        <button className="btn-secondary" onClick={() => logFertilizer(plant.id)}>
          🌾 비료 줬어요
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 text-center text-xs text-sand-500">
        <p>
          마지막 급수
          <br />
          <span className="font-semibold text-leaf-800">
            {lastWater ? formatDate(lastWater) : '없음'}
          </span>
        </p>
        <p>
          마지막 비료
          <br />
          <span className="font-semibold text-leaf-800">
            {lastFert ? formatDate(lastFert) : '없음'}
          </span>
        </p>
      </div>
    </section>
  )
}
