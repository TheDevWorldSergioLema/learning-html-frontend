import { describe, expect, it } from 'vitest'
import { brick } from '../test/factories.js'
import { BuildIssue } from '../types/buildIssue.js'
import { DistanceUnit } from '../types/distanceUnit.js'
import { colorName, compareBuild, distance } from './compare.js'
import { UNPAINTED } from './frame.js'

const studs = (value) => ({ unit: DistanceUnit.Stud, value })

describe('compare', () => {
  describe('distance', () => {
    it('speaks in studs, or pixels below half a stud', () => {
      expect(distance(20)).toEqual(studs(1))
      expect(distance(-60)).toEqual(studs(3))
      expect(distance(30)).toEqual(studs(1.5))
      expect(distance(4)).toEqual({ unit: DistanceUnit.Pixel, value: 4 })
    })
  })

  describe('colorName', () => {
    it('names the CSS color keywords and nothing else', () => {
      expect(colorName('rgb(0, 0, 255)')).toBe('blue')
      expect(colorName('rgb(1, 2, 3)')).toBeNull()
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
        { type: BuildIssue.TooWide, distance: studs(2) },
        { type: BuildIssue.TooShort, distance: studs(1) },
        { type: BuildIssue.TooFarLeft, distance: studs(2) },
        { type: BuildIssue.TooLow, distance: studs(3) },
        { type: BuildIssue.WrongColor, color: 'rgb(255, 0, 0)' },
      ])
    })

    it('asks to keep unpainted bricks unpainted', () => {
      const r = compareBuild([brick({ color: UNPAINTED })], [brick()])
      expect(r.items[0].issues).toEqual([{ type: BuildIssue.StayUnpainted }])
    })

    it('reports missing and extra bricks', () => {
      expect(compareBuild([brick(), brick({ name: 'wall', index: 1 })], [brick()]).items[1]).toMatchObject({
        name: 'wall',
        index: 1,
        ok: false,
        issues: [{ type: BuildIssue.Missing }],
      })
      const extra = compareBuild([brick()], [brick(), brick({ name: 'wall', index: 1 })])
      expect(extra.done).toBe(false)
      expect(extra.items[1]).toMatchObject({ name: 'wall', index: 1, extra: true, issues: [{ type: BuildIssue.Extra }] })
    })
  })
})
