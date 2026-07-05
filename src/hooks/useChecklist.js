import { useMemo, useState } from 'react'
import { DEFAULT_CHECK_ITEMS } from '../data/seedPlants.js'

/**
 * 식물별 주간 점검 체크리스트의 로컬(미저장) 상태를 관리하는 훅.
 * 기본 항목 + 식물별 special_checks 를 합쳐 항목 목록을 구성하고,
 * 각 항목의 체크 여부와 메모를 다룬다. 저장은 상위에서 logCheck 로 처리.
 */
export function useChecklist(plant) {
  const items = useMemo(() => {
    const specials = plant.special_checks ?? []
    return [
      ...DEFAULT_CHECK_ITEMS.map((label, i) => ({ key: `base_${i}`, label, special: false })),
      ...specials.map((label, i) => ({ key: `special_${i}`, label, special: true })),
    ]
  }, [plant.special_checks])

  const [checked, setChecked] = useState({})
  const [note, setNote] = useState('')

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
