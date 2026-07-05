import { useMemo, useState } from 'react'
import { DEFAULT_CHECK_ITEMS } from '../data/seedPlants.js'

/**
 * 주간 점검 체크리스트의 로컬(미저장) 상태 훅.
 * 기본 항목 + 식물별 special_checks 를 합쳐 항목 목록을 만든다.
 * initial 을 주면(이력 수정 시) 그때의 체크 상태·메모로 초기화한다.
 */
export function useChecklist(plant, initial) {
  const items = useMemo(() => {
    const specials = plant.special_checks ?? []
    return [
      ...DEFAULT_CHECK_ITEMS.map((label, i) => ({ key: `base_${i}`, label, special: false })),
      ...specials.map((label, i) => ({ key: `special_${i}`, label, special: true })),
    ]
  }, [plant.special_checks])

  // 라벨 기준으로 저장되므로, 수정 시 라벨→key 로 되살린다.
  const initialChecked = useMemo(() => {
    if (!initial?.items) return {}
    const map = {}
    for (const it of items) map[it.key] = !!initial.items[it.label]
    return map
  }, [initial, items])

  const [checked, setChecked] = useState(initialChecked)
  const [note, setNote] = useState(initial?.note ?? '')

  const toggle = (key) => setChecked((c) => ({ ...c, [key]: !c[key] }))
  const reset = () => {
    setChecked({})
    setNote('')
  }

  const checkedCount = items.filter((it) => checked[it.key]).length

  // 저장용 스냅샷: 항목 라벨 → 체크여부
  const buildEntry = () => ({
    items: items.reduce((acc, it) => {
      acc[it.label] = !!checked[it.key]
      return acc
    }, {}),
    note: note.trim(),
  })

  return { items, checked, note, setNote, toggle, reset, checkedCount, buildEntry }
}
