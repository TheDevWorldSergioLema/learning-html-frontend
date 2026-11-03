import { useLayoutEffect, useRef, useState } from 'react'
import { FRAME_HEIGHT, FRAME_WIDTH } from '../lib/frame.js'

const MAX_SCALE = 1.5

/** Browser-like chrome around the preview; the frame scales to fit, its layout never changes. */
export function BrowserWindow({ address, showGhosts, onToggleGhosts, children }) {
  const viewport = useRef(null)
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    const el = viewport.current
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setScale(Math.min(width / FRAME_WIDTH, height / FRAME_HEIGHT, MAX_SCALE))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="browser" aria-label="Preview">
      <div className="browser-bar">
        <span className="browser-lights" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="browser-address">{address}</span>
        <label className="toggle">
          <input type="checkbox" checked={showGhosts} onChange={(e) => onToggleGhosts(e.target.checked)} />
          <span className="toggle-track" aria-hidden="true" />
          Show target
        </label>
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
