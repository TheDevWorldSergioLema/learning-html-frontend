import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { brick } from '../../../test/factories.js'
import { LegoFrame } from './LegoFrame.jsx'

vi.mock('../../../utils/frame.js', () => ({
  SKELETON: '',
  FRAME_WIDTH: 440,
  FRAME_HEIGHT: 320,
  render: vi.fn(),
  measure: vi.fn(() => [brick()]),
  drawGhosts: vi.fn(),
}))

const code = { html: '<div class="brick"></div>', css: '.brick { padding: 20px; }' }

const renderLoaded = (props) => {
  const view = render(<LegoFrame title="Build" {...props} />)
  fireEvent.load(screen.getByTitle('Build'))
  return view
}

describe('LegoFrame', () => {
  describe('measure', () => {
    it('reports the bricks once the frame is loaded', () => {
      const onMeasure = vi.fn()
      renderLoaded({ stepId: 'first-brick', ...code, onMeasure })

      expect(onMeasure).toHaveBeenCalledExactlyOnceWith([brick()])
    })

    it('reports the bricks again when the step changes with the same code', () => {
      const onMeasure = vi.fn()
      const { rerender } = renderLoaded({ stepId: 'first-brick', ...code, onMeasure })

      rerender(<LegoFrame title="Build" stepId="long-brick" {...code} onMeasure={onMeasure} />)

      expect(onMeasure).toHaveBeenCalledTimes(2)
    })

    it('does not report the bricks again when nothing changes', () => {
      const onMeasure = vi.fn()
      const { rerender } = renderLoaded({ stepId: 'first-brick', ...code, onMeasure })

      rerender(<LegoFrame title="Build" stepId="first-brick" {...code} onMeasure={onMeasure} />)

      expect(onMeasure).toHaveBeenCalledOnce()
    })
  })
})
