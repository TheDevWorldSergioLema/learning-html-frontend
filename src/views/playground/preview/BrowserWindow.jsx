import { useTranslation } from 'react-i18next'
import { Toggle } from '../../../components/toggle/Toggle.jsx'
import { useFitScale } from '../../../hooks/useFitScale.js'
import { FRAME_HEIGHT, FRAME_WIDTH } from '../../../utils/frame.js'
import './BrowserWindow.scss'

const MAX_SCALE = 1.5

/** The frame is scaled to fit: its layout, and so the measured bricks, never change. */
export function BrowserWindow({ address, showGhosts, onToggleGhosts, children }) {
  const { t } = useTranslation()
  const [viewport, scale] = useFitScale(FRAME_WIDTH, FRAME_HEIGHT, MAX_SCALE)

  return (
    <section className="browser" aria-label={t('preview.label')}>
      <div className="browser-bar">
        <span className="browser-lights" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="browser-address">{address}</span>
        <Toggle checked={showGhosts} onChange={onToggleGhosts}>
          {t('preview.showTarget')}
        </Toggle>
      </div>
      <div className="browser-viewport" ref={viewport}>
        <div style={{ width: FRAME_WIDTH * scale, height: FRAME_HEIGHT * scale }}>
          <div
            className="browser-scaler"
            style={{ width: FRAME_WIDTH, height: FRAME_HEIGHT, transform: `scale(${scale})` }}
          >
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}
