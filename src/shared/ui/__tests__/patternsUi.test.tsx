import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { List } from '../List'
import { Modal } from '../Modal'
import * as Tabs from '../Tabs'

function ModalHarness() {
  const [open, setOpen] = useState(false)
  return (
    <div data-testid="app">
      <button onClick={() => setOpen(true)}>Apri</button>
      <Modal open={open} onClose={() => setOpen(false)} title="Conferma">
        Contenuto
      </Modal>
    </div>
  )
}

describe('Modal', () => {
  it('renders in <body> through a portal, closes on Escape and gives the focus back', async () => {
    const user = userEvent.setup()
    render(<ModalHarness />)
    const opener = screen.getByRole('button', { name: 'Apri' })

    await user.click(opener)
    const dialog = screen.getByRole('dialog', { name: 'Conferma' })
    expect(within(screen.getByTestId('app')).queryByRole('dialog')).not.toBeInTheDocument() // not inside the app tree
    expect(dialog.parentElement?.parentElement).toBe(document.body)
    expect(dialog).toHaveFocus()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(opener).toHaveFocus()
  })

  it('makes #root inert while open', async () => {
    const root = document.createElement('div')
    root.id = 'root'
    document.body.appendChild(root)
    const user = userEvent.setup()
    render(<ModalHarness />, { container: root })

    await user.click(screen.getByRole('button', { name: 'Apri' }))
    expect(root.inert).toBe(true)

    await user.keyboard('{Escape}')
    expect(root.inert).toBe(false)
    root.remove()
  })
})

describe('Tabs (compound component)', () => {
  it('links tabs and panels with ARIA and supports arrow keys', async () => {
    const user = userEvent.setup()
    render(
      <Tabs.Root defaultValue="a">
        <Tabs.List label="Esempio">
          <Tabs.Trigger value="a">Primo</Tabs.Trigger>
          <Tabs.Trigger value="b">Secondo</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Panel value="a">Pannello A</Tabs.Panel>
        <Tabs.Panel value="b">Pannello B</Tabs.Panel>
      </Tabs.Root>,
    )

    const first = screen.getByRole('tab', { name: 'Primo' })
    expect(first).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel', { name: 'Primo' })).toHaveTextContent('Pannello A')

    first.focus()
    await user.keyboard('{ArrowRight}')

    expect(screen.getByRole('tab', { name: 'Secondo' })).toHaveFocus()
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Pannello B')
  })

  it('throws a clear error when a part is used outside Tabs.Root', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<Tabs.Trigger value="x">X</Tabs.Trigger>)).toThrow(/inside <Tabs.Root>/)
    spy.mockRestore()
  })
})

describe('List (generic component)', () => {
  it('renders typed items or the empty message', () => {
    const { rerender } = render(
      <List items={[{ id: 1, name: 'Ada' }]} getKey={(item) => item.id} renderItem={(item) => item.name.toUpperCase()} />,
    )
    expect(screen.getByText('ADA')).toBeInTheDocument()

    rerender(<List items={[] as { id: number }[]} getKey={(item) => item.id} renderItem={() => null} empty="Vuoto" />)
    expect(screen.getByText('Vuoto')).toBeInTheDocument()
  })
})
