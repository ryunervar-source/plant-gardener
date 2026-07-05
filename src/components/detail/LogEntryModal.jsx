import { useState } from 'react'
import { valueFieldMeta } from '../../data/activities.js'
import { toDateInput, fromDateInput } from '../../lib/schedule.js'

/**
 * 활동 기록 추가/수정 모달.
 * activity: 활동 메타(kind로 '양'/'메모' 구분), initial: {date, value}(수정 시),
 * onSave({date, value}), onDelete(수정 시), onCancel.
 */
export default function LogEntryModal({
  open,
  activity,
  initial,
  defaultValue = '',
  onSave,
  onDelete,
  onCancel,
}) {
  const [value, setValue] = useState(initial?.value ?? defaultValue)
  const [dateStr, setDateStr] = useState(toDateInput(initial?.date))

  if (!open) return null
  const meta = valueFieldMeta(activity)
  const isEdit = !!initial
  const isAmount = activity.kind === 'amount'

  const handleSave = () => {
    onSave({
      value: value.trim(),
      date: fromDateInput(dateStr, initial?.date),
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4"
      onClick={onCancel}
    >
      <div
        className="card w-full max-w-sm p-5 safe-bottom"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="flex items-center gap-2 text-lg font-bold text-leaf-900">
          <span>{activity.emoji}</span>
          {activity.label} {isEdit ? '기록 수정' : '기록'}
        </h3>

        <div className="mt-4 space-y-3">
          <div>
            <label className="field-label">날짜</label>
            <input
              type="date"
              className="field-input"
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">
              {meta.label} {isAmount ? '' : '(선택)'}
            </label>
            {isAmount ? (
              <input
                className="field-input"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={meta.placeholder}
                autoFocus={!isEdit}
              />
            ) : (
              <textarea
                rows={2}
                className="field-input resize-none"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={meta.placeholder}
              />
            )}
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          {isEdit && onDelete && (
            <button className="btn-danger" onClick={onDelete} aria-label="기록 삭제">
              삭제
            </button>
          )}
          <button className="btn-secondary flex-1" onClick={onCancel}>
            취소
          </button>
          <button className="btn-primary flex-1" onClick={handleSave}>
            {isEdit ? '저장' : '기록'}
          </button>
        </div>
      </div>
    </div>
  )
}
