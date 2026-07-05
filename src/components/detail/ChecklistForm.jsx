import { useState } from 'react'
import { useChecklist } from '../../hooks/useChecklist.js'
import Badge from '../common/Badge.jsx'
import { toDateInput, fromDateInput } from '../../lib/schedule.js'

/**
 * 점검 체크리스트 입력 폼 (신규 저장 / 이력 수정 공용).
 * withDate: 날짜 입력 노출(수정 시), onSubmit({items, note, date?}).
 */
export default function ChecklistForm({
  plant,
  initial,
  withDate = false,
  submitLabel = '저장',
  onSubmit,
  onDelete,
  onCancel,
}) {
  const { items, checked, note, setNote, toggle, checkedCount, buildEntry } =
    useChecklist(plant, initial)
  const [dateStr, setDateStr] = useState(toDateInput(initial?.date))

  const handleSubmit = () => {
    const entry = buildEntry()
    if (withDate) entry.date = fromDateInput(dateStr, initial?.date)
    onSubmit(entry)
  }

  return (
    <div>
      {withDate && (
        <div className="mb-3">
          <label className="field-label">점검 날짜</label>
          <input
            type="date"
            className="field-input"
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
          />
        </div>
      )}

      <ul className="space-y-1.5">
        {items.map((it) => (
          <li key={it.key}>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 hover:bg-sand-50">
              <input
                type="checkbox"
                checked={!!checked[it.key]}
                onChange={() => toggle(it.key)}
                className="h-5 w-5 shrink-0 rounded border-sand-300 text-leaf-600 focus:ring-leaf-400"
              />
              <span className="flex-1 text-sm text-leaf-900">{it.label}</span>
              {it.special && <Badge level="neutral">특이</Badge>}
            </label>
          </li>
        ))}
      </ul>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="메모 (선택) — 예: 아랫잎 하나 노래짐, 응애 없음"
        rows={2}
        className="field-input mt-3 resize-none text-sm"
      />

      <div className="mt-3 flex gap-2">
        {onDelete && (
          <button className="btn-danger" onClick={onDelete}>
            삭제
          </button>
        )}
        {onCancel && (
          <button className="btn-secondary flex-1" onClick={onCancel}>
            취소
          </button>
        )}
        <button className="btn-primary flex-1" onClick={handleSubmit}>
          {submitLabel} ({checkedCount}/{items.length})
        </button>
      </div>
    </div>
  )
}
