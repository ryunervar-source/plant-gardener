import { usePlants } from '../../hooks/usePlants.jsx'
import { useChecklist } from '../../hooks/useChecklist.js'
import Badge from '../common/Badge.jsx'
import {
  getCheckStatus,
  ddayLabel,
  formatDate,
  lastLogDate,
  CHECK_INTERVAL_DAYS,
} from '../../lib/schedule.js'

export default function ChecklistCard({ plant }) {
  const { logCheck } = usePlants()
  const { items, checked, note, setNote, toggle, reset, checkedCount, buildEntry } =
    useChecklist(plant)

  const status = getCheckStatus(plant)
  const lastCheck = lastLogDate((plant.checkLog ?? []).map((c) => c.date))

  const handleSave = () => {
    logCheck(plant.id, buildEntry())
    reset()
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

      <button
        onClick={handleSave}
        className="btn-primary mt-3 w-full"
      >
        점검 완료 저장 ({checkedCount}/{items.length})
      </button>

      {(plant.checkLog ?? []).length > 0 && (
        <details className="mt-4">
          <summary className="cursor-pointer text-sm font-semibold text-leaf-700">
            점검 이력 ({plant.checkLog.length})
          </summary>
          <ul className="mt-2 space-y-2">
            {plant.checkLog.slice(0, 20).map((c, i) => {
              const done = Object.values(c.items).filter(Boolean).length
              const total = Object.keys(c.items).length
              return (
                <li key={c.date + i} className="rounded-xl bg-sand-50 px-3 py-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-leaf-800">
                      {formatDate(c.date)}
                    </span>
                    <span className="text-sand-500">
                      {done}/{total} 항목
                    </span>
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
    </section>
  )
}
