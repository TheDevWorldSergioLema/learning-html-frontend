import { css as cssLang } from '@codemirror/lang-css'
import { html as htmlLang } from '@codemirror/lang-html'
import { EditorView } from '@codemirror/view'
import CodeMirror from '@uiw/react-codemirror'

const editorTheme = EditorView.theme({
  '&': { fontSize: '15px', height: '100%' },
  '.cm-scroller': { fontFamily: 'var(--font-code)', lineHeight: '1.6' },
  '.cm-content': { padding: '12px 0' },
  '.cm-gutters': { backgroundColor: 'var(--panel-sunk)', border: 'none', color: 'var(--ink-faint)' },
  '.cm-activeLineGutter': { backgroundColor: 'transparent', color: 'var(--ink)' },
  '.cm-activeLine': { backgroundColor: 'rgba(11, 92, 173, 0.06)' },
  '&.cm-focused': { outline: 'none' },
})

const LANGS = { html: [htmlLang(), editorTheme], css: [cssLang(), editorTheme] }

const SETUP = { foldGutter: false, highlightActiveLine: true, autocompletion: true }

export function CodeEditor({ tab, onTab, html, css, onChange, htmlEditable, onReset }) {
  const readOnly = tab === 'html' && !htmlEditable
  return (
    <section className="editor" aria-label="Code editor">
      <div className="editor-bar">
        <div role="tablist" aria-label="File" className="tabs">
          {['html', 'css'].map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              id={`tab-${t}`}
              aria-selected={tab === t}
              aria-controls="editor-panel"
              className="tab"
              onClick={() => onTab(t)}
            >
              {t === 'html' ? 'index.html' : 'style.css'}
            </button>
          ))}
        </div>
        <button type="button" className="button-quiet" onClick={onReset}>
          Start over
        </button>
      </div>
      {tab === 'html' && (
        <p className="editor-note">
          {htmlEditable
            ? <>This HTML goes inside <code>&lt;div class="baseplate"&gt;</code>.</>
            : <>The HTML is fixed in this step: change the look in <strong>style.css</strong>.</>}
        </p>
      )}
      <div className="editor-body" id="editor-panel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
        <CodeMirror
          key={tab}
          value={tab === 'html' ? html : css}
          height="100%"
          extensions={LANGS[tab]}
          basicSetup={SETUP}
          readOnly={readOnly}
          editable={!readOnly}
          onChange={(value) => onChange(tab, value)}
          aria-label={tab === 'html' ? 'HTML code' : 'CSS code'}
        />
      </div>
    </section>
  )
}
