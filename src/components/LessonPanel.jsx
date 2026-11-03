import { useState } from 'react'
import { RichText } from './RichText.jsx'

export function LessonPanel({ step, total, level, hintsShown, onHint, onSolution }) {
  const [confirming, setConfirming] = useState(false)
  const allHints = hintsShown >= level.hints.length

  return (
    <section className="lesson" aria-labelledby="lesson-title">
      <header className="lesson-head">
        <span className="step-number" aria-hidden="true">{step}</span>
        <div>
          <p className="lesson-meta">
            Step {step} of {total} <span className="concept">{level.concept}</span>
          </p>
          <h1 id="lesson-title">{level.title}</h1>
        </div>
      </header>

      {level.intro.map((p) => (
        <p key={p} className="lesson-text">
          <RichText text={p} />
        </p>
      ))}
      {level.example && <pre className="example"><code>{level.example}</code></pre>}

      <div className="goal">
        <span className="goal-brick" aria-hidden="true" />
        <p>
          <strong>Your goal: </strong>
          <RichText text={level.goal} />
        </p>
      </div>

      <div className="hints">
        {hintsShown > 0 && (
          <ol className="hint-list">
            {level.hints.slice(0, hintsShown).map((h) => (
              <li key={h}>
                <RichText text={h} />
              </li>
            ))}
          </ol>
        )}
        <div className="hint-actions">
          {!allHints && (
            <button type="button" className="button-secondary" onClick={onHint}>
              {hintsShown === 0 ? 'Need a hint?' : 'Another hint'}
              <span className="hint-count">{hintsShown + 1} of {level.hints.length}</span>
            </button>
          )}
          {allHints && !confirming && (
            <button type="button" className="button-quiet" onClick={() => setConfirming(true)}>
              Show me the solution
            </button>
          )}
          {confirming && (
            <div className="confirm" role="group" aria-label="Replace your code with the solution?">
              <span>This replaces your code with the solution.</span>
              <button
                type="button"
                className="button-secondary"
                onClick={() => {
                  setConfirming(false)
                  onSolution()
                }}
              >
                Replace my code
              </button>
              <button type="button" className="button-quiet" onClick={() => setConfirming(false)}>
                Keep trying
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
