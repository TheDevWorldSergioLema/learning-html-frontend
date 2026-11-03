// A few beginner-friendly checks. Browsers silently ignore broken CSS, so these
// explain the most common reasons why "nothing happens".

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
        warnings.push(`Line ${n}: there is a } without a matching {.`)
        depth = 0
      }
    }
    if (depth > 0 && line && !/[{};]$/.test(line)) {
      const next = lines.slice(i + 1).map((l) => l.trim()).find(Boolean)
      if (next && !next.startsWith('}')) warnings.push(`Line ${n}: the line may be missing a ; at the end.`)
    }
    if (depth > 0 && /^[a-z-]+\s+[^:{]+;$/.test(line)) warnings.push(`Line ${n}: write a : between the property and its value.`)
    if (depth > 0 && /:\s*\d+\s*;/.test(line) && !/:\s*0\s*;/.test(line)) warnings.push(`Line ${n}: add a unit to the number, like 20px.`)
  })
  if (depth > 0) warnings.push('A { is never closed: add a } at the end of the rule.')
  return warnings
}
