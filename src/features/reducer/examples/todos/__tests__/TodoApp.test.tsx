import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { TodoApp } from '../TodoApp'

describe('TodoApp', () => {
  it('adds, completes and filters todos', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    await user.type(screen.getByLabelText('Nuova attività'), 'Comprare il latte')
    await user.click(screen.getByRole('button', { name: 'Aggiungi' }))
    expect(screen.getByText('Comprare il latte')).toBeInTheDocument()

    await user.click(screen.getByLabelText('Completata: Comprare il latte'))
    await user.click(screen.getByRole('button', { name: 'Da fare' }))

    const list = screen.getByRole('list')
    expect(within(list).queryByText('Comprare il latte')).not.toBeInTheDocument()
  })

  it('edits a todo inline', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    const [firstEdit] = screen.getAllByRole('button', { name: 'Modifica' })
    await user.click(firstEdit)
    const input = screen.getByLabelText('Modifica attività')
    await user.clear(input)
    await user.type(input, 'Testo nuovo{Enter}')

    expect(screen.getByText('Testo nuovo')).toBeInTheDocument()
  })

  it('persists the state in localStorage', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<TodoApp />)

    await user.type(screen.getByLabelText('Nuova attività'), 'Da ricordare{Enter}')
    unmount()

    render(<TodoApp />)
    expect(screen.getByText('Da ricordare')).toBeInTheDocument()
  })
})
