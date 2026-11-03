import { useEffect, useMemo, useRef, useState } from 'react'
import { BrowserWindow } from './components/BrowserWindow.jsx'
import { BuildCheck } from './components/BuildCheck.jsx'
import { CodeEditor } from './components/CodeEditor.jsx'
import { LegoFrame } from './components/LegoFrame.jsx'
import { LessonPanel } from './components/LessonPanel.jsx'
import { StepStrip } from './components/StepStrip.jsx'
import { levels } from './levels/levels.js'
import { compareBuild } from './lib/compare.js'
import { lintCss } from './lib/cssLint.js'
import { loadProgress, saveProgress } from './lib/storage.js'
import './App.css'

const starterCode = (level) => ({ html: level.html, css: level.css })
const solutionCode = (level) => ({ html: level.solutionHtml ?? level.html, css: level.solutionCss ?? level.css })

export default function App() {
  const [progress, setProgress] = useState(loadProgress)
  const [target, setTarget] = useState(null)
  const [actual, setActual] = useState(null)
  const [tabChoice, setTabChoice] = useState(null)
  const [showGhosts, setShowGhosts] = useState(true)
  const latest = useRef({ target: null, actual: null })

  const index = Math.min(progress.current, levels.length - 1)
  const level = levels[index]
  const code = progress.code[level.id] ?? starterCode(level)
  const solution = useMemo(() => solutionCode(level), [level])
  const tab = tabChoice?.id === level.id ? tabChoice.tab : (level.startTab ?? 'css')
  const hintsShown = progress.hints[level.id] ?? 0

  useEffect(() => saveProgress(progress), [progress])

  const update = (fn) => setProgress((p) => ({ ...p, ...fn(p) }))

  const markIfDone = () => {
    const { target: t, actual: a } = latest.current
    if (t?.id !== level.id || a?.id !== level.id || !compareBuild(t.bricks, a.bricks).done) return
    update((p) => (p.completed.includes(level.id) ? {} : { completed: [...p.completed, level.id] }))
  }

  const onTarget = (bricks) => {
    latest.current.target = { id: level.id, bricks }
    setTarget(latest.current.target)
    markIfDone()
  }

  const onActual = (bricks) => {
    latest.current.actual = { id: level.id, bricks }
    setActual(latest.current.actual)
    markIfDone()
  }

  const setCode = (next) => update((p) => ({ code: { ...p.code, [level.id]: next } }))
  const goTo = (i) => update(() => ({ current: i }))

  const current = target?.id === level.id && actual?.id === level.id
  const result = current ? compareBuild(target.bricks, actual.bricks) : null
  const placed = result?.items.map((it) => it.ok) ?? []
  const warnings = useMemo(() => lintCss(code.css), [code.css])
  const isLast = index === levels.length - 1

  return (
    <div className="app">
      <header className="topbar">
        <span className="brand">
          <svg viewBox="0 0 40 24" width="34" height="20" aria-hidden="true">
            <rect x="6" y="0" width="10" height="5" rx="1.5" />
            <rect x="24" y="0" width="10" height="5" rx="1.5" />
            <rect x="0" y="4" width="40" height="20" rx="2.5" />
          </svg>
          Brick by Brick
        </span>
        <StepStrip levels={levels} current={index} completed={progress.completed} onSelect={goTo} />
      </header>

      <main className="workspace">
        <div className="column column-code">
          <LessonPanel
            key={level.id}
            step={index + 1}
            total={levels.length}
            level={level}
            hintsShown={hintsShown}
            onHint={() => update((p) => ({ hints: { ...p.hints, [level.id]: hintsShown + 1 } }))}
            onSolution={() => setCode(solution)}
          />
          <CodeEditor
            tab={tab}
            onTab={(t) => setTabChoice({ id: level.id, tab: t })}
            html={code.html}
            css={code.css}
            htmlEditable={Boolean(level.htmlEditable)}
            onChange={(which, value) => update((p) => {
              const prev = p.code[level.id] ?? starterCode(level)
              return { code: { ...p.code, [level.id]: { ...prev, [which]: value } } }
            })}
            onReset={() => update((p) => {
              const rest = { ...p.code }
              delete rest[level.id]
              return { code: rest }
            })}
          />
        </div>

        <div className="column column-preview">
          <BrowserWindow
            address={`bricks://step-${String(index + 1).padStart(2, '0')}/index.html`}
            showGhosts={showGhosts}
            onToggleGhosts={setShowGhosts}
          >
            <LegoFrame
              title="Your build"
              html={code.html}
              css={code.css}
              onMeasure={onActual}
              target={current ? target.bricks : null}
              placed={placed}
              showGhosts={showGhosts}
            />
          </BrowserWindow>
          <BuildCheck
            result={result}
            warnings={warnings}
            solved={Boolean(result?.done)}
            recap={level.recap}
            isLast={isLast}
            onNext={() => goTo(index + 1)}
          />
        </div>
      </main>

      <LegoFrame title="Target build" hidden html={solution.html} css={solution.css} onMeasure={onTarget} />
    </div>
  )
}
