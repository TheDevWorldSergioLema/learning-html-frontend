import { useTranslation } from 'react-i18next'
import { Button } from '../../../components/button/Button.jsx'
import { RichText } from '../../../components/rich-text/RichText.jsx'
import { ButtonVariant } from '../../../types/buttonVariant.js'
import { colorName } from '../../../utils/compare.js'
import './BuildCheck.scss'

export function BuildCheck({ result, warnings, solved, recap, onNext, isLast }) {
  const { t } = useTranslation()

  const distanceText = ({ unit, value }) => t(`check.distance.${unit}`, { count: value })

  const colorText = (rgb) => {
    const name = colorName(rgb)
    return name ? t(`check.colors.${name}`) : rgb
  }

  const issueText = (issue) =>
    t(`check.issues.${issue.type}`, {
      distance: issue.distance && distanceText(issue.distance),
      color: issue.color && colorText(issue.color),
    })

  const renderItem = (it) => (
    <li key={it.index} className={it.ok ? 'is-ok' : 'is-off'}>
      <span className="swatch" style={{ backgroundColor: it.color }} aria-hidden="true" />
      <span className="brick-name">{it.name ?? t('check.unnamedBrick', { number: it.index + 1 })}</span>
      <span className="brick-status">{it.ok ? t('check.inPlace') : it.issues.map(issueText).join(', ')}</span>
    </li>
  )

  const renderSolved = () => (
    <section className="check check-solved" aria-live="polite">
      <div className="solved-studs" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="solved-text">
        <h2>{t(isLast ? 'check.finished' : 'check.solved')}</h2>
        <p>
          <RichText text={recap} />
        </p>
      </div>
      {!isLast && (
        <Button variant={ButtonVariant.Primary} onClick={onNext}>
          {t('check.nextStep')}
        </Button>
      )}
    </section>
  )

  if (solved) return renderSolved()

  return (
    <section className="check" aria-labelledby="check-title">
      <h2 id="check-title">
        {t('check.title')}
        {result && (
          <span className="check-count" aria-live="polite">
            {t('check.count', { placed: result.placed, count: result.total })}
          </span>
        )}
      </h2>
      {warnings.length > 0 && (
        <ul className="warnings">
          {warnings.map((w) => (
            <li key={`${w.type}-${w.line}`}>{t(`check.warnings.${w.type}`, { line: w.line })}</li>
          ))}
        </ul>
      )}
      {result && <ul className="brick-list">{result.items.map(renderItem)}</ul>}
    </section>
  )
}
