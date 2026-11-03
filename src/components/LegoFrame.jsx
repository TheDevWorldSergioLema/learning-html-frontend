import { useEffect, useRef, useState } from 'react'
import { drawGhosts, FRAME_HEIGHT, FRAME_WIDTH, measure, render, SKELETON } from '../lib/frame.js'

/**
 * A sandboxed frame showing a build. Every time the code changes it renders it,
 * measures the bricks and reports them through `onMeasure`.
 */
export function LegoFrame({ html, css, onMeasure, target, placed, showGhosts, hidden = false, title }) {
  const ref = useRef(null)
  const [ready, setReady] = useState(false)
  const measureRef = useRef(onMeasure)
  useEffect(() => {
    measureRef.current = onMeasure
  })

  useEffect(() => {
    if (!ready) return
    const doc = ref.current.contentDocument
    render(doc, html, css)
    measureRef.current(measure(doc))
  }, [ready, html, css])

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
