import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Dropdown } from '../Dropdown'

function setup() {
  const onEdit = vi.fn()
  render(
    <div>
      <p>Fuori</p>
      <Dropdown label="Azioni" items={[{ label: 'Modifica', onSelect: onEdit }]} />
    </div>,
  )
  return { onEdit, user: userEvent.setup() }
}

describe('Dropdown', () => {
  it('opens on click and runs the selected action', async () => {
    const { onEdit, user } = setup()

    await user.click(screen.getByRole('button', { name: /azioni/i }))
    await user.click(screen.getByRole('menuitem', { name: 'Modifica' }))

    expect(onEdit).toHaveBeenCalledOnce()
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('closes on outside click (useOnClickOutside)', async () => {
    const { user } = setup()

    await user.click(screen.getByRole('button', { name: /azioni/i }))
    expect(screen.getByRole('menu')).toBeInTheDocument()

    await user.click(screen.getByText('Fuori'))
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('closes on Escape (useEventListener)', async () => {
    const { user } = setup()

    await user.click(screen.getByRole('button', { name: /azioni/i }))
    await user.keyboard('{Escape}')

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })
})
