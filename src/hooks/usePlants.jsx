import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { loadState, saveState, emptyState, normalizePlant, makeId } from '../lib/storage.js'
import { SEED_PLANTS } from '../data/seedPlants.js'

const PlantsContext = createContext(null)

/** 시드/신규 식물을 완전한 v2 식물 객체로 */
function hydratePlant(seed) {
  return normalizePlant({ id: makeId(), ...seed })
}

function initState() {
  const loaded = loadState()
  if (loaded) return loaded
  // 최초 실행: 시드 데이터로 초기화
  return {
    ...emptyState(),
    plants: SEED_PLANTS.map(hydratePlant),
    settings: { seededAt: new Date().toISOString() },
  }
}

export function PlantsProvider({ children }) {
  const [state, setState] = useState(initState)

  // 상태 변경 시 localStorage 동기화
  useEffect(() => {
    saveState(state)
  }, [state])

  const api = useMemo(() => {
    const updatePlant = (id, updater) =>
      setState((s) => ({
        ...s,
        plants: s.plants.map((p) => (p.id === id ? updater(p) : p)),
      }))

    return {
      plants: state.plants,
      settings: state.settings,
      rawState: state,

      getPlant: (id) => state.plants.find((p) => p.id === id) ?? null,

      addPlant: (data) => {
        const plant = hydratePlant(data)
        setState((s) => ({ ...s, plants: [...s.plants, plant] }))
        return plant.id
      },

      // 편집 시에도 activities/intervals/logs 구조를 표준화
      editPlant: (id, data) =>
        updatePlant(id, (p) => normalizePlant({ ...p, ...data })),

      deletePlant: (id) =>
        setState((s) => ({ ...s, plants: s.plants.filter((p) => p.id !== id) })),

      // --- 활동 기록 (급수/비료/분갈이/기타 공통) ---
      logActivity: (id, key, entry = {}) =>
        updatePlant(id, (p) => {
          const e = {
            id: makeId(),
            date: new Date().toISOString(),
            value: '',
            ...entry,
          }
          const arr = p.logs?.[key] ?? []
          return { ...p, logs: { ...p.logs, [key]: [...arr, e] } }
        }),

      editActivityEntry: (id, key, entryId, patch) =>
        updatePlant(id, (p) => ({
          ...p,
          logs: {
            ...p.logs,
            [key]: (p.logs?.[key] ?? []).map((e) =>
              e.id === entryId ? { ...e, ...patch } : e,
            ),
          },
        })),

      removeActivityEntry: (id, key, entryId) =>
        updatePlant(id, (p) => ({
          ...p,
          logs: {
            ...p.logs,
            [key]: (p.logs?.[key] ?? []).filter((e) => e.id !== entryId),
          },
        })),

      // --- 점검 이력 ---
      logCheck: (id, entry) =>
        updatePlant(id, (p) => ({
          ...p,
          checkLog: [
            { id: makeId(), date: new Date().toISOString(), items: {}, note: '', ...entry },
            ...p.checkLog,
          ],
        })),

      editCheck: (id, entryId, patch) =>
        updatePlant(id, (p) => ({
          ...p,
          checkLog: p.checkLog.map((c) =>
            c.id === entryId ? { ...c, ...patch } : c,
          ),
        })),

      removeCheck: (id, entryId) =>
        updatePlant(id, (p) => ({
          ...p,
          checkLog: p.checkLog.filter((c) => c.id !== entryId),
        })),

      // 전체 상태 교체 (백업 가져오기)
      replaceState: (next) => setState(next),
    }
  }, [state])

  return <PlantsContext.Provider value={api}>{children}</PlantsContext.Provider>
}

export function usePlants() {
  const ctx = useContext(PlantsContext)
  if (!ctx) throw new Error('usePlants must be used within PlantsProvider')
  return ctx
}
