import { useMemo, useState } from 'react'
import { usePlants } from '../../hooks/usePlants.jsx'
import { getActivity } from '../../data/activities.js'
import LogEntryModal from './LogEntryModal.jsx'
import { formatDateTime } from '../../lib/schedule.js'

// 모든 활동 기록을 하나의 타임라인으로 병합해 최근 30건 표시.
// 각 항목은 탭하면 수정/삭제할 수 있다.
export default function CareTimeline({ plant }) {
  const { editActivityEntry, removeActivityEntry } = usePlants()
  const [editing, setEditing] = useState(null) // { key, entry }

  const events = useMemo(() => {
    const all = []
    for (const [key, entries] of Object.entries(plant.logs ?? {})) {
      for (const e of entries) all.push({ key, entry: e })
    }
    return all
      .sort((a, b) => new Date(b.entry.date) - new Date(a.entry.date))
      .slice(0, 30)
  }, [plant.logs])

  const editingAct = editing ? getActivity(editing.key) : null

  const handleSave = ({ date, value }) => {
    editActivityEntry(plant.id, editing.key, editing.entry.id, { date, value })
    setEditing(null)
  }
  const handleDelete = () => {
    removeActivityEntry(plant.id, editing.key, editing.entry.id)
    setEditing(null)
  }

  return (
    <section className="card p-4">
      <h3 className="mb-3 text-sm font-bold text-leaf-900">
        관리 이력 <span className="text-sand-400">(최근 30건)</span>
      </h3>
      {events.length === 0 ? (
        <p className="py-4 text-center text-sm text-sand-400">
          아직 기록이 없어요. 위 버튼으로 첫 기록을 남겨보세요.
        </p>
      ) : (
        <ul className="space-y-2">
          {events.map(({ key, entry }) => {
            const act = getActivity(key)
            return (
              <li key={entry.id}>
                <button
                  onClick={() => setEditing({ key, entry })}
                  className="flex w-full items-center gap-3 rounded-xl bg-sand-50 px-3 py-2 text-left hover:bg-sand-100"
                >
                  <span className="text-lg">{act.emoji}</span>
                  <span className="min-w-0 flex-1">
                    <span className="text-sm font-medium text-leaf-900">
                      {act.label}
                    </span>
                    {entry.value && (
                      <span className="ml-2 truncate text-xs text-sand-500">
                        {entry.value}
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 text-xs text-sand-500">
                    {formatDateTime(entry.date)}
                  </span>
                  <span className="shrink-0 text-sand-300">✏️</span>
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {editing && (
        <LogEntryModal
          open
          activity={editingAct}
          initial={editing.entry}
          onSave={handleSave}
          onDelete={handleDelete}
          onCancel={() => setEditing(null)}
        />
      )}
    </section>
  )
}
