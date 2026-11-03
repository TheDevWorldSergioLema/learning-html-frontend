import { describe, expect, it } from 'vitest'
import { levels } from './levels.js'

describe('levels', () => {
  it('has 20 steps with unique ids', () => {
    expect(levels).toHaveLength(20)
    expect(new Set(levels.map((l) => l.id)).size).toBe(20)
  })

  it('gives every step a goal, hints, a recap and a solution that differs from the starter', () => {
    for (const l of levels) {
      expect(l.goal && l.recap && l.intro.length && l.hints.length >= 2, l.id).toBeTruthy()
      const changed = (l.solutionCss && l.solutionCss !== l.css) || (l.solutionHtml && l.solutionHtml !== l.html)
      expect(changed, l.id).toBeTruthy()
      if (l.solutionHtml) expect(l.htmlEditable, l.id).toBe(true)
    }
  })
})
