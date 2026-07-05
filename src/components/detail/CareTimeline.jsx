import { useMemo } from 'react'
import { usePlants } from '../../hooks/usePlants.jsx'
import { formatDateTime } from '../../lib/schedule.js'

// 급수/비료 이력을 하나의 타임라인으로 병합해 최근 20건 표시
export default function CareTimeline({ plant }) {
  const { removeWatering, removeFertilizer } = usePlants()

  const events = useMemo(() => {
    const w = plant.wateringLog.map((d) => ({ type: 'water', date: d }))
    const f = plant.fertilizerLog.map((d) => ({ type: 'fertilizer', date: d }))
    return [...w, ...f]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 20)
  }, [plant.wateringLog, plant.fertilizerLog])

  return (
    <section className="card p-4">
      <h3 className="mb-3 text-sm font-bold text-leaf-900">
        관리 이력 <span className="text-sand-400">(최근 20건)</span>
      </h3>
      {events.length === 0 ? (
        <p className="py-4 text-center text-sm text-sand-400">
          아직 기록이 없어요. 위 버튼으로 첫 기록을 남겨보세요.
        </p>
      ) : (
        <ul className="space-y-2">
          {events.map((e) => (
            <li
              key={e.type + e.date}
              className="flex items-center gap-3 rounded-xl bg-sand-50 px-3 py-2"
            >
              <span className="text-lg">{e.type === 'water' ? '💧' : '🌾'}</span>
              <span className="flex-1 text-sm font-medium text-leaf-900">
                {e.type === 'water' ? '급수' : '비료'}
              </span>
              <span className="text-xs text-sand-500">{formatDateTime(e.date)}</span>
              <button
                onClick={() =>
                  e.type === 'water'
                    ? removeWatering(plant.id, e.date)
                    : removeFertilizer(plant.id, e.date)
                }
                className="text-sand-400 hover:text-red-500"
                aria-label="기록 삭제"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
