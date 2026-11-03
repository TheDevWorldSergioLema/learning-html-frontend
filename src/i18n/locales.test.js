import { describe, expect, it } from 'vitest'
import { Language } from '../types/language.js'
import { locales } from './index.js'

const flatten = (value, prefix = '') =>
  typeof value === 'string'
    ? { [prefix]: value }
    : Object.entries(value).reduce((all, [key, child]) => ({ ...all, ...flatten(child, prefix ? `${prefix}.${key}` : key) }), {})

const marks = (text) => [...(text.match(/\{\{\w+\}\}|`[^`]+`|<\/?\w+>/g) ?? [])].sort()

const english = flatten(locales.en)
const translated = Object.values(Language).filter((language) => language !== Language.English)

describe('locales', () => {
  it('has a translation file for every language', () => {
    expect(Object.keys(locales).sort()).toEqual(Object.values(Language).sort())
  })

  describe.each(translated)('%s', (language) => {
    const texts = flatten(locales[language])

    it('has exactly the same keys as English', () => {
      expect(Object.keys(texts).sort()).toEqual(Object.keys(english).sort())
    })

    it('keeps the placeholders, inline code and tags of every English text', () => {
      for (const [key, text] of Object.entries(english)) {
        expect(marks(texts[key]), key).toEqual(marks(text))
      }
    })

    it('has no comment text that would close a CSS comment', () => {
      for (const [key, text] of Object.entries(locales[language].codeComments)) {
        expect(text, key).not.toContain('*/')
      }
    })
  })
})
