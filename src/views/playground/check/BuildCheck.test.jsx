import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { brick } from '../../../test/factories.js'
import { renderWithUser } from '../../../test/render.js'
import { compareBuild } from '../../../utils/compare.js'
import { lintCss } from '../../../utils/cssLint.js'
import { BuildCheck } from './BuildCheck.jsx'

const props = { warnings: [], solved: false, recap: 'Well done', isLast: false, onNext: () => {} }

describe('BuildCheck', () => {
  describe('while building', () => {
    it('counts the bricks in place and explains the others', () => {
      const result = compareBuild(
        [brick(), brick({ name: null, index: 1, x: 40 })],
        [brick(), brick({ name: null, index: 1, x: 100, color: 'rgb(0, 0, 255)' })],
      )
      render(<BuildCheck {...props} result={result} />)

      expect(screen.getByText('1 of 2 bricks in place')).toBeInTheDocument()
      expect(screen.getByText('in place')).toBeInTheDocument()
      expect(screen.getByText('brick 2')).toBeInTheDocument()
      expect(screen.getByText('3 studs too far right, should be red')).toBeInTheDocument()
    })

    it('shows the CSS warnings', () => {
      render(<BuildCheck {...props} result={null} warnings={lintCss('.brick {\n  padding: 20;\n}')} />)

      expect(screen.getByText('Line 2: add a unit to the number, like 20px.')).toBeInTheDocument()
    })
  })

  describe('when solved', () => {
    it('shows the recap and goes to the next step', async () => {
      const onNext = vi.fn()
      const { user } = renderWithUser(<BuildCheck {...props} solved result={null} onNext={onNext} />)

      expect(screen.getByText('Step complete!')).toBeInTheDocument()
      expect(screen.getByText('Well done')).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: 'Next step' }))
      expect(onNext).toHaveBeenCalledOnce()
    })

    it('has no next step after the last one', () => {
      render(<BuildCheck {...props} solved isLast result={null} />)

      expect(screen.getByText('You finished every step!')).toBeInTheDocument()
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })
  })
})
