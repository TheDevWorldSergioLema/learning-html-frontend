import { describe, expect, it } from 'vitest'
import en from '../../i18n/locales/en/translation.json'
import { levels } from './levels.js'

describe('levels', () => {
  it('has 20 steps with unique ids', () => {
    expect(levels).toHaveLength(20)
    expect(new Set(levels.map((l) => l.id)).size).toBe(20)
  })

  it('has a solution that differs from the starter in every step', () => {
    for (const l of levels) {
      const changed = (l.solutionCss && l.solutionCss !== l.css) || (l.solutionHtml && l.solutionHtml !== l.html)
      expect(changed, l.id).toBeTruthy()
      if (l.solutionHtml) expect(l.htmlEditable, l.id).toBe(true)
    }
  })

  it('has a title, an intro, a goal, hints and a recap in the translations for every step', () => {
    for (const l of levels) {
      const texts = en.levels[l.id]
      expect(texts?.title && texts.goal && texts.recap && texts.intro.length && texts.hints.length >= 2, l.id).toBeTruthy()
    }
    expect(Object.keys(en.levels)).toEqual(levels.map((l) => l.id))
  })
})
