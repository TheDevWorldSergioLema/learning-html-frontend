import { useEffect, useRef, useState } from 'react'
import { useLatest } from '../../../hooks/useLatest.js'
import { drawGhosts, FRAME_HEIGHT, FRAME_WIDTH, measure, render, SKELETON } from '../../../utils/frame.js'
import './LegoFrame.scss'

/** Renders the build in a sandboxed frame and reports its bricks through `onMeasure` on every change. */
export function LegoFrame({ html, css, onMeasure, target, placed, showGhosts, hidden = false, title }) {
  const ref = useRef(null)
  const measureRef = useLatest(onMeasure)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!ready) return
    const doc = ref.current.contentDocument
    render(doc, html, css)
    measureRef.current(measure(doc))
  }, [ready, html, css, measureRef])

  useEffect(() => {
    if (!ready || hidden) return
    drawGhosts(ref.current.contentDocument, target, placed ?? [], showGhosts)
  }, [ready, hidden, html, css, target, placed, showGhosts])

  return (
    <iframe
      ref={ref}
      title={title}
      srcDoc={SKELETON}
      sandbox="allow-same-origin"
      onLoad={() => setReady(true)}
      width={FRAME_WIDTH}
      height={FRAME_HEIGHT}
      className={hidden ? 'probe-frame' : 'preview-frame'}
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
    />
  )
}
