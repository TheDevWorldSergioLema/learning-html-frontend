import { useLayoutEffect, useRef, useState } from 'react'

/** Scale that fits a `width` × `height` box inside the observed element, capped at `max`. */
export function useFitScale(width, height, max = Infinity) {
  const ref = useRef(null)
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const { width: available, height: availableHeight } = entry.contentRect
      setScale(Math.min(available / width, availableHeight / height, max))
    })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [width, height, max])

  return [ref, scale]
}
