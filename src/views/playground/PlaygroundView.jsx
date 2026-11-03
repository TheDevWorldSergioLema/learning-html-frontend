import { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCodeComments } from '../../hooks/useCodeComments.js'
import { PublicLayout } from '../../layout/PublicLayout.jsx'
import { useProgressStore } from '../../stores/progressStore.js'
import { EditorTab } from '../../types/editorTab.js'
import { fillComments } from '../../utils/codeComments.js'
import { compareBuild } from '../../utils/compare.js'
import { lintCss } from '../../utils/cssLint.js'
import { BuildCheck } from './check/BuildCheck.jsx'
import { CodeEditor } from './editor/CodeEditor.jsx'
import { LessonPanel } from './lesson/LessonPanel.jsx'
import { levels } from './levels.js'
import { BrowserWindow } from './preview/BrowserWindow.jsx'
import { LegoFrame } from './preview/LegoFrame.jsx'
import { StepStrip } from './steps/StepStrip.jsx'
import './PlaygroundView.scss'

const starterCode = (level, comments) => ({ html: level.html, css: fillComments(level.css, comments) })
const solutionCode = (level, comments) => ({
  html: level.solutionHtml ?? level.html,
  css: fillComments(level.solutionCss ?? level.css, comments),
})

export function PlaygroundView() {
  const { t } = useTranslation()
  const comments = useCodeComments()
  const progress = useProgressStore()
  const [target, setTarget] = useState(null)
  const [actual, setActual] = useState(null)
  const [tabChoice, setTabChoice] = useState(null)
  const [showGhosts, setShowGhosts] = useState(true)
  const latest = useRef({ target: null, actual: null })

  const index = Math.min(progress.current, levels.length - 1)
  const level = levels[index]
  const starter = starterCode(level, comments)
  const code = progress.code[level.id] ?? starter
  const tab = tabChoice?.id === level.id ? tabChoice.tab : (level.startTab ?? EditorTab.Css)
  const hintsShown = progress.hints[level.id] ?? 0
  const current = target?.id === level.id && actual?.id === level.id
  const result = current ? compareBuild(target.bricks, actual.bricks) : null
  const placed = result?.items.map((it) => it.ok) ?? []
  const isLast = index === levels.length - 1
  const step = index + 1

  const solution = useMemo(() => solutionCode(level, comments), [level, comments])
  const warnings = useMemo(() => lintCss(code.css), [code.css])

  const markIfDone = () => {
    const { target: expected, actual: built } = latest.current
    if (expected?.id !== level.id || built?.id !== level.id || !compareBuild(expected.bricks, built.bricks).done) return
    progress.complete(level.id)
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

  const renderCodeColumn = () => (
    <div className="column column-code">
      <LessonPanel
        key={level.id}
        step={step}
        total={levels.length}
        level={level}
        hintsShown={hintsShown}
        onHint={() => progress.showHint(level.id)}
        onSolution={() => progress.setCode(level.id, solution)}
      />
      <CodeEditor
        tab={tab}
        onTab={(next) => setTabChoice({ id: level.id, tab: next })}
        html={code.html}
        css={code.css}
        htmlEditable={Boolean(level.htmlEditable)}
        onChange={(which, value) => progress.editCode(level.id, starter, which, value)}
        onReset={() => progress.resetCode(level.id)}
      />
    </div>
  )

  const renderPreviewColumn = () => (
    <div className="column column-preview">
      <BrowserWindow
        address={t('preview.address', { step: String(step).padStart(2, '0') })}
        showGhosts={showGhosts}
        onToggleGhosts={setShowGhosts}
      >
        <LegoFrame
          title={t('preview.yourBuild')}
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
        recap={t(`levels.${level.id}.recap`)}
        isLast={isLast}
        onNext={() => progress.goTo(index + 1)}
      />
    </div>
  )

  return (
    <PublicLayout
      navigation={<StepStrip levels={levels} current={index} completed={progress.completed} onSelect={progress.goTo} />}
    >
      <main className="workspace">
        {renderCodeColumn()}
        {renderPreviewColumn()}
      </main>
      <LegoFrame title={t('preview.targetBuild')} hidden html={solution.html} css={solution.css} onMeasure={onTarget} />
    </PublicLayout>
  )
}
