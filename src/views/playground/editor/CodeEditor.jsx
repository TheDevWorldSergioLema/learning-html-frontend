import { css as cssLang } from '@codemirror/lang-css'
import { html as htmlLang } from '@codemirror/lang-html'
import { EditorView } from '@codemirror/view'
import CodeMirror from '@uiw/react-codemirror'
import { Trans, useTranslation } from 'react-i18next'
import { Button } from '../../../components/button/Button.jsx'
import { RichText } from '../../../components/rich-text/RichText.jsx'
import { ButtonVariant } from '../../../types/buttonVariant.js'
import { EditorTab } from '../../../types/editorTab.js'
import './CodeEditor.scss'

const editorTheme = EditorView.theme({
  '&': { fontSize: 'var(--font-size-code)', height: '100%' },
  '.cm-scroller': { fontFamily: 'var(--font-code)', lineHeight: 'var(--line-height-editor)' },
  '.cm-content': { padding: 'var(--spacing-6) 0' },
  '.cm-gutters': { backgroundColor: 'var(--color-panel-sunk)', border: 'none', color: 'var(--color-ink-faint)' },
  '.cm-activeLineGutter': { backgroundColor: 'transparent', color: 'var(--color-ink)' },
  '.cm-activeLine': { backgroundColor: 'var(--color-active-line)' },
  '&.cm-focused': { outline: 'none' },
})

const LANGS = {
  [EditorTab.Html]: [htmlLang(), editorTheme],
  [EditorTab.Css]: [cssLang(), editorTheme],
}

const SETUP = { foldGutter: false, highlightActiveLine: true, autocompletion: true }

export function CodeEditor({ tab, onTab, html, css, onChange, htmlEditable, onReset }) {
  const { t } = useTranslation()

  const isHtml = tab === EditorTab.Html
  const readOnly = isHtml && !htmlEditable

  const renderTab = (value) => (
    <button
      key={value}
      type="button"
      role="tab"
      id={`tab-${value}`}
      aria-selected={tab === value}
      aria-controls="editor-panel"
      className="tab"
      onClick={() => onTab(value)}
    >
      {t(`editor.tabs.${value}`)}
    </button>
  )

  const renderHtmlNote = () => (
    <p className="editor-note">
      {htmlEditable
        ? <RichText text={t('editor.htmlEditable')} />
        : <Trans i18nKey="editor.htmlFixed" components={{ strong: <strong /> }} />}
    </p>
  )

  return (
    <section className="editor" aria-label={t('editor.label')}>
      <div className="editor-bar">
        <div role="tablist" aria-label={t('editor.files')} className="tabs">
          {Object.values(EditorTab).map(renderTab)}
        </div>
        <Button variant={ButtonVariant.Quiet} onClick={onReset}>
          {t('editor.startOver')}
        </Button>
      </div>
      {isHtml && renderHtmlNote()}
      <div className="editor-body" id="editor-panel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
        <CodeMirror
          key={tab}
          value={isHtml ? html : css}
          height="100%"
          extensions={LANGS[tab]}
          basicSetup={SETUP}
          readOnly={readOnly}
          editable={!readOnly}
          onChange={(value) => onChange(tab, value)}
          aria-label={t(`editor.code.${tab}`)}
        />
      </div>
    </section>
  )
}
