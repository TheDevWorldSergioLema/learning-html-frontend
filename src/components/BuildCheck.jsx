import { RichText } from './RichText.jsx'

export function BuildCheck({ result, warnings, solved, recap, onNext, isLast }) {
  if (solved) {
    return (
      <section className="check check-solved" aria-live="polite">
        <div className="solved-studs" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </div>
        <div>
          <h2>{isLast ? 'You finished every step!' : 'Step complete!'}</h2>
          <p>
            <RichText text={recap} />
          </p>
        </div>
        {!isLast && (
          <button type="button" className="button-primary" onClick={onNext}>
            Next step
          </button>
        )}
      </section>
    )
  }

  return (
    <section className="check" aria-labelledby="check-title">
      <h2 id="check-title">
        Build check
        {result && (
          <span className="check-count" aria-live="polite">
            {result.placed} of {result.total} {result.total === 1 ? 'brick' : 'bricks'} in place
          </span>
        )}
      </h2>
      {warnings.length > 0 && (
        <ul className="warnings">
          {warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      )}
      {result && (
        <ul className="brick-list">
          {result.items.map((it, i) => (
            <li key={i} className={it.ok ? 'is-ok' : 'is-off'}>
              <span className="swatch" style={{ backgroundColor: it.color }} aria-hidden="true" />
              <span className="brick-name">{it.name}</span>
              <span className="brick-status">{it.ok ? 'in place' : it.issues.join(', ')}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
