import { useState } from 'react'
import { usePlants } from '../../hooks/usePlants.jsx'
import { getActivity } from '../../data/activities.js'
import LogEntryModal from './LogEntryModal.jsx'
import {
  getActivityStatus,
  activityLevel,
  ddayLabelSmart,
  formatDate,
  lastEntry,
} from '../../lib/schedule.js'

const LEVEL_TEXT = {
  overdue: 'text-red-600',
  today: 'text-amber-600',
  soon: 'text-yellow-600',
  ok: 'text-leaf-700',
  neutral: 'text-sand-400',
}
const LEVEL_TILE = {
  overdue: 'bg-red-50 ring-red-200',
  today: 'bg-amber-50 ring-amber-200',
  soon: 'bg-yellow-50 ring-yellow-200',
  ok: 'bg-leaf-50 ring-leaf-100',
  neutral: 'bg-sand-50 ring-sand-200',
}

export default function ActionButtons({ plant }) {
  const { logActivity } = usePlants()
  const [modalKey, setModalKey] = useState(null) // 기록 모달을 띄운 활동 key

  const enabled = (plant.activities ?? []).map((k) => getActivity(k))
  const scheduled = enabled
    .map((act) => ({ act, status: getActivityStatus(plant, act.key) }))
    .filter(({ status }) => status.hasSchedule || status.act.core)

  const openActivity = modalKey ? getActivity(modalKey) : null
  const defaultValue =
    modalKey === 'water'
      ? plant.water_amount ?? ''
      : lastEntry(plant.logs?.[modalKey])?.value ?? ''

  const handleSave = ({ date, value }) => {
    logActivity(plant.id, modalKey, { date, value })
    setModalKey(null)
  }

  return (
    <section className="card p-4">
      {/* 다음 일정 D-day 요약 */}
      <h3 className="mb-2 text-sm font-bold text-leaf-900">다음 일정</h3>
      <div className="grid grid-cols-3 gap-2">
        {scheduled.map(({ act, status }) => {
          const level = activityLevel(status)
          const label = status.neverDone
            ? '기록 없음'
            : ddayLabelSmart(status.dday, act.longTerm)
          return (
            <div
              key={act.key}
              className={`rounded-xl px-2 py-2.5 text-center ring-1 ${LEVEL_TILE[level]}`}
            >
              <div className="text-lg leading-none">{act.emoji}</div>
              <div className="mt-1 text-[11px] font-medium text-sand-500">
                {act.label}
              </div>
              <div className={`text-sm font-extrabold ${LEVEL_TEXT[level]}`}>
                {label}
              </div>
            </div>
          )
        })}
      </div>

      {/* 기록 버튼 */}
      <h3 className="mb-2 mt-4 text-sm font-bold text-leaf-900">기록하기</h3>
      <div className="flex flex-wrap gap-2">
        {enabled.map((act) => {
          const last = lastEntry(plant.logs?.[act.key])
          return (
            <button
              key={act.key}
              onClick={() => setModalKey(act.key)}
              className="btn-secondary flex-1 basis-[30%] flex-col !gap-0.5 !py-2.5"
            >
              <span className="whitespace-nowrap text-sm">
                {act.emoji} {act.label}
              </span>
              <span className="text-[10px] font-normal text-leaf-600/70">
                {last ? formatDate(last.date) : '기록 없음'}
              </span>
            </button>
          )
        })}
      </div>

      {openActivity && (
        <LogEntryModal
          open
          activity={openActivity}
          defaultValue={defaultValue}
          onSave={handleSave}
          onCancel={() => setModalKey(null)}
        />
      )}
    </section>
  )
}
