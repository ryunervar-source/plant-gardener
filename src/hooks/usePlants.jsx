import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { loadState, saveState, emptyState } from '../lib/storage.js'
import { SEED_PLANTS } from '../data/seedPlants.js'

const PlantsContext = createContext(null)

/** 간단한 고유 id 생성 (crypto.randomUUID 우선) */
function makeId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return 'p_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

/** 시드 식물에 id/로그 필드를 붙여 완전한 식물 객체로 */
function hydratePlant(seed) {
  return {
    id: makeId(),
    photo: null,
    wateringLog: [],
    fertilizerLog: [],
    checkLog: [],
    special_checks: [],
    ...seed,
  }
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

      editPlant: (id, data) =>
        updatePlant(id, (p) => ({ ...p, ...data })),

      deletePlant: (id) =>
        setState((s) => ({ ...s, plants: s.plants.filter((p) => p.id !== id) })),

      // 급수 기록 추가 (기본 오늘)
      logWatering: (id, when = new Date().toISOString()) =>
        updatePlant(id, (p) => ({ ...p, wateringLog: [...p.wateringLog, when] })),

      // 비료 기록 추가
      logFertilizer: (id, when = new Date().toISOString()) =>
        updatePlant(id, (p) => ({ ...p, fertilizerLog: [...p.fertilizerLog, when] })),

      // 급수/비료 기록 개별 삭제 (실수 정정용)
      removeWatering: (id, when) =>
        updatePlant(id, (p) => ({
          ...p,
          wateringLog: p.wateringLog.filter((d) => d !== when),
        })),
      removeFertilizer: (id, when) =>
        updatePlant(id, (p) => ({
          ...p,
          fertilizerLog: p.fertilizerLog.filter((d) => d !== when),
        })),

      // 점검 이력 추가
      logCheck: (id, entry) =>
        updatePlant(id, (p) => ({
          ...p,
          checkLog: [
            { date: new Date().toISOString(), items: {}, note: '', ...entry },
            ...p.checkLog,
          ],
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
