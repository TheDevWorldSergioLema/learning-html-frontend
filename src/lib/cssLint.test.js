import { describe, expect, it } from 'vitest'
import { levels } from '../levels/levels.js'
import { lintCss } from './cssLint.js'

describe('lintCss', () => {
  it('accepts every starter and solution of the course', () => {
    for (const level of levels) {
      expect(lintCss(level.css), level.id).toEqual([])
      if (level.solutionCss) expect(lintCss(level.solutionCss), level.id).toEqual([])
    }
  })

  it('spots a missing semicolon', () => {
    expect(lintCss('.brick {\n  padding: 20px\n  background-color: red;\n}')).toEqual([
      'Line 2: the line may be missing a ; at the end.',
    ])
  })

  it('spots a missing colon, a missing unit and unbalanced braces', () => {
    expect(lintCss('.brick {\n  padding 20px;\n}')).toEqual(['Line 2: write a : between the property and its value.'])
    expect(lintCss('.brick {\n  padding: 20;\n}')).toEqual(['Line 2: add a unit to the number, like 20px.'])
    expect(lintCss('.brick {\n  padding: 20px;\n')).toEqual(['A { is never closed: add a } at the end of the rule.'])
    expect(lintCss('}')).toEqual(['Line 1: there is a } without a matching {.'])
  })
})
