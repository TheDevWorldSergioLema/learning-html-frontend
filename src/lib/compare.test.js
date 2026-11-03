import { describe, expect, it } from 'vitest'
import { compareBuild, distance } from './compare.js'
import { UNPAINTED } from './frame.js'

const brick = (over) => ({ name: 'door', x: 0, y: 0, w: 40, h: 40, color: 'rgb(255, 0, 0)', ...over })

describe('distance', () => {
  it('speaks in studs, or pixels below half a stud', () => {
    expect(distance(20)).toBe('1 stud')
    expect(distance(-60)).toBe('3 studs')
    expect(distance(30)).toBe('1.5 studs')
    expect(distance(4)).toBe('4px')
  })
})

describe('compareBuild', () => {
  it('is done when every brick matches', () => {
    const r = compareBuild([brick()], [brick({ x: 1 })])
    expect(r.done).toBe(true)
    expect(r.items[0]).toMatchObject({ ok: true, issues: [] })
  })

  it('explains size, position and color differences', () => {
    const r = compareBuild([brick()], [brick({ w: 80, h: 20, x: -40, y: 60, color: 'rgb(0, 0, 255)' })])
    expect(r.done).toBe(false)
    expect(r.items[0].issues).toEqual([
      '2 studs too wide',
      '1 stud too short',
      '2 studs too far left',
      '3 studs too low',
      'should be red',
    ])
  })

  it('asks to keep unpainted bricks unpainted', () => {
    const r = compareBuild([brick({ color: UNPAINTED })], [brick()])
    expect(r.items[0].issues).toEqual(['should stay unpainted'])
  })

  it('reports missing and extra bricks', () => {
    expect(compareBuild([brick(), brick({ name: 'wall' })], [brick()]).items[1]).toMatchObject({
      name: 'wall',
      ok: false,
      issues: ['is missing: add it in the HTML'],
    })
    const extra = compareBuild([brick()], [brick(), brick({ name: 'wall' })])
    expect(extra.done).toBe(false)
    expect(extra.items[1]).toMatchObject({ name: 'wall', extra: true })
  })
})
