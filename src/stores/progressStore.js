import { create } from 'zustand'
import { loadProgress, saveProgress } from '../services/progressService.js'

/** @typedef {import('../types/entities.js').Code} Code */

/**
 * @type {import('zustand').UseBoundStore<import('zustand').StoreApi<import('../types/entities.js').Progress & {
 *   goTo: (index: number) => void,
 *   complete: (levelId: string) => void,
 *   setCode: (levelId: string, code: Code) => void,
 *   editCode: (levelId: string, starter: Code, which: keyof Code, value: string) => void,
 *   resetCode: (levelId: string) => void,
 *   showHint: (levelId: string) => void,
 * }>>}
 */
export const useProgressStore = create((set) => ({
  ...loadProgress(),
  goTo: (index) => set({ current: index }),
  complete: (levelId) => set((p) => (p.completed.includes(levelId) ? {} : { completed: [...p.completed, levelId] })),
  setCode: (levelId, code) => set((p) => ({ code: { ...p.code, [levelId]: code } })),
  editCode: (levelId, starter, which, value) => set((p) => ({
    code: { ...p.code, [levelId]: { ...(p.code[levelId] ?? starter), [which]: value } },
  })),
  resetCode: (levelId) => set((p) => {
    const rest = { ...p.code }
    delete rest[levelId]
    return { code: rest }
  }),
  showHint: (levelId) => set((p) => ({ hints: { ...p.hints, [levelId]: (p.hints[levelId] ?? 0) + 1 } })),
}))

useProgressStore.subscribe(({ current, completed, code, hints }) => saveProgress({ current, completed, code, hints }))
