import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithUser } from '../../../test/render.js'
import { levels } from '../levels.js'
import { LessonPanel } from './LessonPanel.jsx'

const [level] = levels
const props = { step: 1, total: levels.length, level, onHint: () => {}, onSolution: () => {} }

describe('LessonPanel', () => {
  describe('lesson', () => {
    it('shows the translated title, goal and definition of the level', () => {
      render(<LessonPanel {...props} hintsShown={0} />)

      expect(screen.getByRole('heading', { name: 'Your first brick' })).toBeInTheDocument()
      expect(screen.getByText('Step 1 of 20')).toBeInTheDocument()
      expect(screen.getByText(/Make the brick 2 studs wide/)).toBeInTheDocument()
      expect(screen.getByText(/The space inside an element/)).toBeInTheDocument()
    })

    it('hides the example code until it is given as a hint', () => {
      render(<LessonPanel {...props} hintsShown={0} />)

      expect(screen.queryByText(/padding: 10px; \/\* 10 \+ 10/)).not.toBeInTheDocument()
    })
  })

  describe('hints', () => {
    it('asks for the next hint', async () => {
      const onHint = vi.fn()
      const { user } = renderWithUser(<LessonPanel {...props} hintsShown={1} onHint={onHint} />)

      expect(screen.getAllByRole('listitem')).toHaveLength(1)
      await user.click(screen.getByRole('button', { name: /Another hint/ }))
      expect(onHint).toHaveBeenCalledOnce()
    })

    it('gives the example code just before the last hint', () => {
      render(<LessonPanel {...props} hintsShown={3} />)

      const items = screen.getAllByRole('listitem')
      expect(items).toHaveLength(3)
      expect(items[2]).toHaveTextContent(/padding: 10px; \/\* 10 \+ 10/)
      expect(screen.getByRole('button', { name: /4 of 4/ })).toBeInTheDocument()
    })

    it('replaces the code with the solution only after confirming', async () => {
      const onSolution = vi.fn()
      const { user } = renderWithUser(<LessonPanel {...props} hintsShown={4} onSolution={onSolution} />)

      await user.click(screen.getByRole('button', { name: 'Show me the solution' }))
      await user.click(screen.getByRole('button', { name: 'Keep trying' }))
      expect(onSolution).not.toHaveBeenCalled()

      await user.click(screen.getByRole('button', { name: 'Show me the solution' }))
      await user.click(screen.getByRole('button', { name: 'Replace my code' }))
      expect(onSolution).toHaveBeenCalledOnce()
    })
  })
})
