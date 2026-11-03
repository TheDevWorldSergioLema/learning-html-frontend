import { describe, expect, it } from 'vitest'
import { LintWarning } from '../types/lintWarning.js'
import { levels } from '../views/playground/levels.js'
import { lintCss } from './cssLint.js'

describe('cssLint', () => {
  describe('lintCss', () => {
    it('accepts every starter and solution of the course', () => {
      for (const level of levels) {
        expect(lintCss(level.css), level.id).toEqual([])
        if (level.solutionCss) expect(lintCss(level.solutionCss), level.id).toEqual([])
      }
    })

    it('spots a missing semicolon', () => {
      expect(lintCss('.brick {\n  padding: 20px\n  background-color: red;\n}')).toEqual([
        { type: LintWarning.MissingSemicolon, line: 2 },
      ])
    })

    it('spots a missing colon, a missing unit and unbalanced braces', () => {
      expect(lintCss('.brick {\n  padding 20px;\n}')).toEqual([{ type: LintWarning.MissingColon, line: 2 }])
      expect(lintCss('.brick {\n  padding: 20;\n}')).toEqual([{ type: LintWarning.MissingUnit, line: 2 }])
      expect(lintCss('.brick {\n  padding: 20px;\n')).toEqual([{ type: LintWarning.UnclosedBrace }])
      expect(lintCss('}')).toEqual([{ type: LintWarning.UnmatchedClosingBrace, line: 1 }])
    })
  })
})
