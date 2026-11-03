import { describe, expect, it } from 'vitest'
import { locales } from '../../i18n/index.js'
import { fillComments } from '../../utils/codeComments.js'
import { lintCss } from '../../utils/cssLint.js'
import { levels } from './levels.js'

const codeOf = (l) => [l.css, l.solutionCss, l.example].filter(Boolean)

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

  describe.each(Object.keys(locales))('texts in %s', (language) => {
    const translation = locales[language]

    it('has a title, an intro, a goal, hints and a recap for every step', () => {
      for (const l of levels) {
        const texts = translation.levels[l.id]
        expect(texts?.title && texts.goal && texts.recap && texts.intro.length && texts.hints.length >= 2, l.id).toBeTruthy()
      }
      expect(Object.keys(translation.levels)).toEqual(levels.map((l) => l.id))
    })

    it('has the same number of intro paragraphs and hints as English', () => {
      for (const l of levels) {
        expect(translation.levels[l.id].intro.length, l.id).toBe(locales.en.levels[l.id].intro.length)
        expect(translation.levels[l.id].hints.length, l.id).toBe(locales.en.levels[l.id].hints.length)
      }
    })

    it('fills every comment placeholder of the code without breaking the CSS', () => {
      for (const l of levels) {
        for (const code of codeOf(l)) {
          const filled = fillComments(code, translation.codeComments)
          expect(filled, l.id).not.toMatch(/\{\{\w+\}\}/)
          expect(lintCss(filled), l.id).toEqual(lintCss(fillComments(code, locales.en.codeComments)))
        }
      }
    })
  })
})
