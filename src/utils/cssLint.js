import { LintWarning } from '../types/lintWarning.js'

// Browsers silently ignore broken CSS: these checks explain the usual reasons why "nothing happens".

/** @returns {import('../types/entities.js').CssWarning[]} */
export function lintCss(css) {
  const warnings = []
  const lines = css.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' ')).split('\n')
  let depth = 0

  lines.forEach((raw, i) => {
    const line = raw.trim()
    const n = i + 1
    for (const ch of line) {
      if (ch === '{') depth++
      if (ch === '}') depth--
      if (depth < 0) {
        warnings.push({ type: LintWarning.UnmatchedClosingBrace, line: n })
        depth = 0
      }
    }
    if (depth > 0 && line && !/[{};]$/.test(line)) {
      const next = lines.slice(i + 1).map((l) => l.trim()).find(Boolean)
      if (next && !next.startsWith('}')) warnings.push({ type: LintWarning.MissingSemicolon, line: n })
    }
    if (depth > 0 && /^[a-z-]+\s+[^:{]+;$/.test(line)) warnings.push({ type: LintWarning.MissingColon, line: n })
    if (depth > 0 && /:\s*\d+\s*;/.test(line) && !/:\s*0\s*;/.test(line)) warnings.push({ type: LintWarning.MissingUnit, line: n })
  })
  if (depth > 0) warnings.push({ type: LintWarning.UnclosedBrace })
  return warnings
}
