import { STUD, UNPAINTED } from './frame.js'

const TOLERANCE = 1

const COLOR_NAMES = {
  'rgb(255, 0, 0)': 'red',
  'rgb(255, 255, 0)': 'yellow',
  'rgb(0, 0, 255)': 'blue',
  'rgb(0, 128, 0)': 'green',
  'rgb(255, 165, 0)': 'orange',
  'rgb(128, 0, 128)': 'purple',
  'rgb(255, 255, 255)': 'white',
  'rgb(0, 0, 0)': 'black',
  [UNPAINTED]: 'unpainted',
}

export const colorName = (rgb) => COLOR_NAMES[rgb] ?? rgb

/** "1 stud", "3 studs", "1.5 studs", or pixels when it is less than half a stud. */
export function distance(px) {
  const abs = Math.abs(px)
  if (abs < STUD / 2) return `${abs}px`
  const studs = Math.round((abs / STUD) * 10) / 10
  return `${studs} ${studs === 1 ? 'stud' : 'studs'}`
}

function issuesFor(t, a) {
  const issues = []
  const dw = a.w - t.w
  const dh = a.h - t.h
  const dx = a.x - t.x
  const dy = a.y - t.y
  if (Math.abs(dw) > TOLERANCE) issues.push(`${distance(dw)} too ${dw > 0 ? 'wide' : 'narrow'}`)
  if (Math.abs(dh) > TOLERANCE) issues.push(`${distance(dh)} too ${dh > 0 ? 'tall' : 'short'}`)
  if (Math.abs(dx) > TOLERANCE) issues.push(`${distance(dx)} too far ${dx > 0 ? 'right' : 'left'}`)
  if (Math.abs(dy) > TOLERANCE) issues.push(`${distance(dy)} too ${dy > 0 ? 'low' : 'high'}`)
  if (a.color !== t.color) {
    issues.push(t.color === UNPAINTED ? 'should stay unpainted' : `should be ${colorName(t.color)}`)
  }
  return issues
}

/**
 * Compares the student's bricks with the target, brick by brick in HTML order.
 * @returns {{ done: boolean, placed: number, total: number, items: {name, color, ok, issues}[] }}
 */
export function compareBuild(target, actual) {
  const items = target.map((t, i) => {
    const a = actual[i]
    if (!a) return { name: t.name, color: t.color, ok: false, issues: ['is missing: add it in the HTML'] }
    const issues = issuesFor(t, a)
    return { name: t.name, color: t.color, ok: issues.length === 0, issues }
  })
  actual.slice(target.length).forEach((a) => {
    items.push({ name: a.name, color: a.color, ok: false, extra: true, issues: ['is not part of this build: remove it'] })
  })
  const placed = items.filter((it) => it.ok).length
  return { done: placed === target.length && items.length === target.length, placed, total: target.length, items }
}
