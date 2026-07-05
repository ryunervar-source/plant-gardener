import { useState } from 'react'
import { usePlants } from '../../hooks/usePlants.jsx'
import ChecklistForm from './ChecklistForm.jsx'
import Badge from '../common/Badge.jsx'
import {
  getCheckStatus,
  ddayLabel,
  formatDate,
  lastLogDate,
  CHECK_INTERVAL_DAYS,
} from '../../lib/schedule.js'

export default function ChecklistCard({ plant }) {
  const { logCheck, editCheck, removeCheck } = usePlants()
  const [formKey, setFormKey] = useState(0) // 저장 후 새 폼으로 리셋
  const [editing, setEditing] = useState(null) // 수정 중인 이력 항목

  const status = getCheckStatus(plant)
  const lastCheck = lastLogDate(plant.checkLog ?? [])

  const handleNew = (entry) => {
    logCheck(plant.id, entry)
    setFormKey((k) => k + 1)
  }
  const handleEditSave = (entry) => {
    editCheck(plant.id, editing.id, entry)
    setEditing(null)
  }
  const handleEditDelete = () => {
    removeCheck(plant.id, editing.id)
    setEditing(null)
  }

  return (
    <section className="card p-4">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-sm font-bold text-leaf-900">주간 점검 체크리스트</h3>
        {status.overdue ? (
          <Badge level="overdue">점검 필요</Badge>
        ) : (
          <Badge level="ok">다음 {ddayLabel(status.dday)}</Badge>
        )}
      </div>
      <p className="mb-3 text-xs text-sand-400">
        {lastCheck ? `마지막 점검: ${formatDate(lastCheck)}` : '아직 점검 기록이 없어요'}
        {' · '}완료 시 {CHECK_INTERVAL_DAYS}일 후 자동 예약
      </p>

      <ChecklistForm
        key={formKey}
        plant={plant}
        submitLabel="점검 완료 저장"
        onSubmit={handleNew}
      />

      {(plant.checkLog ?? []).length > 0 && (
        <details className="mt-4" open>
          <summary className="cursor-pointer text-sm font-semibold text-leaf-700">
            점검 이력 ({plant.checkLog.length})
          </summary>
          <ul className="mt-2 space-y-2">
            {plant.checkLog.slice(0, 30).map((c) => {
              const done = Object.values(c.items).filter(Boolean).length
              const total = Object.keys(c.items).length
              return (
                <li key={c.id} className="rounded-xl bg-sand-50 px-3 py-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-leaf-800">
                      {formatDate(c.date)}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sand-500">
                        {done}/{total} 항목
                      </span>
                      <button
                        onClick={() => setEditing(c)}
                        className="text-leaf-600 hover:text-leaf-800"
                        aria-label="점검 이력 수정"
                      >
                        ✏️
                      </button>
                    </div>
                  </div>
                  {c.note && (
                    <p className="mt-1 text-xs text-sand-600 whitespace-pre-wrap">
                      {c.note}
                    </p>
                  )}
                </li>
              )
            })}
          </ul>
        </details>
      )}

      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4"
          onClick={() => setEditing(null)}
        >
          <div
            className="card w-full max-w-sm p-5 safe-bottom max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-3 text-lg font-bold text-leaf-900">점검 이력 수정</h3>
            <ChecklistForm
              plant={plant}
              initial={editing}
              withDate
              submitLabel="저장"
              onSubmit={handleEditSave}
              onDelete={handleEditDelete}
              onCancel={() => setEditing(null)}
            />
          </div>
        </div>
      )}
    </section>
  )
}
