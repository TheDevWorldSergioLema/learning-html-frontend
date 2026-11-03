import { BuildIssue } from '../types/buildIssue.js'
import { DistanceUnit } from '../types/distanceUnit.js'
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
}

/** @returns {string | null} the CSS color keyword of an rgb() value, null when it has none */
export const colorName = (rgb) => COLOR_NAMES[rgb] ?? null

/**
 * Studs, rounded to a tenth, or pixels below half a stud.
 * @returns {import('../types/entities.js').Distance}
 */
export function distance(px) {
  const abs = Math.abs(px)
  if (abs < STUD / 2) return { unit: DistanceUnit.Pixel, value: abs }
  return { unit: DistanceUnit.Stud, value: Math.round((abs / STUD) * 10) / 10 }
}

function sizeAndPositionIssues(t, a) {
  const checks = [
    [a.w - t.w, BuildIssue.TooWide, BuildIssue.TooNarrow],
    [a.h - t.h, BuildIssue.TooTall, BuildIssue.TooShort],
    [a.x - t.x, BuildIssue.TooFarRight, BuildIssue.TooFarLeft],
    [a.y - t.y, BuildIssue.TooLow, BuildIssue.TooHigh],
  ]
  return checks
    .filter(([delta]) => Math.abs(delta) > TOLERANCE)
    .map(([delta, more, less]) => ({ type: delta > 0 ? more : less, distance: distance(delta) }))
}

function issuesFor(t, a) {
  const issues = sizeAndPositionIssues(t, a)
  if (a.color === t.color) return issues
  return [...issues, t.color === UNPAINTED ? { type: BuildIssue.StayUnpainted } : { type: BuildIssue.WrongColor, color: t.color }]
}

/**
 * Compares the student's bricks with the target, brick by brick in HTML order.
 * @param {import('../types/entities.js').Brick[]} target
 * @param {import('../types/entities.js').Brick[]} actual
 * @returns {import('../types/entities.js').BuildResult}
 */
export function compareBuild(target, actual) {
  const items = target.map((t, index) => {
    const a = actual[index]
    const issues = a ? issuesFor(t, a) : [{ type: BuildIssue.Missing }]
    return { name: t.name, index, color: t.color, ok: issues.length === 0, issues }
  })
  actual.slice(target.length).forEach((a) => {
    items.push({ name: a.name, index: a.index, color: a.color, ok: false, extra: true, issues: [{ type: BuildIssue.Extra }] })
  })
  const placed = items.filter((it) => it.ok).length
  return { done: placed === target.length && items.length === target.length, placed, total: target.length, items }
}
