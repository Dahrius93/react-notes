import { QueryClientProvider } from '@tanstack/react-query'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createQueryClient } from '@/shared/api/queryClient'
import { UsersList } from '../basic-query/UsersList'
import { TodoManager } from '../todos/TodoManager'

/** A NEW client for every test: no cache shared between tests, no retries to wait for. */
function renderWithClient(ui: ReactNode) {
  const client = createQueryClient()
  client.setDefaultOptions({ queries: { retry: false } })
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>)
}

function mockFetch(handler: (url: URL, init?: RequestInit) => unknown) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string, init?: RequestInit) => {
      const body = handler(new URL(url), init)
      return new Response(JSON.stringify(body), { headers: { 'Content-Type': 'application/json' } })
    }),
  )
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('UsersList (useQuery)', () => {
  it('shows a spinner, then the users', async () => {
    mockFetch(() => [{ id: 1, name: 'Leanne Graham', email: 'l@example.com' }])
    renderWithClient(<UsersList />)

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(await screen.findByText('Leanne Graham')).toBeInTheDocument()
  })
})

describe('TodoManager (mutations)', { timeout: 10_000 }, () => {
  const todos = [{ id: 1, userId: 1, title: 'delectus aut autem', completed: false }]

  it('updates optimistically and rolls back when the server fails', async () => {
    mockFetch(() => todos)
    const user = userEvent.setup()
    renderWithClient(<TodoManager />)

    const checkbox = await screen.findByLabelText('delectus aut autem')
    await user.click(screen.getByLabelText(/Simula errore/))
    await user.click(checkbox)

    // Optimistic: checked immediately, before the (slow) server answers
    expect(checkbox).toBeChecked()

    // The server fails → rollback to the snapshot
    expect(await screen.findByRole('alert', {}, { timeout: 3000 })).toHaveTextContent('modifica annullata')
    expect(checkbox).not.toBeChecked()
  })

  it('adds a todo with the server response', async () => {
    mockFetch((_url, init) =>
      init?.method === 'POST' ? { ...JSON.parse(String(init.body)), id: 201 } : todos,
    )
    const user = userEvent.setup()
    renderWithClient(<TodoManager />)

    await screen.findByLabelText('delectus aut autem')
    await user.type(screen.getByLabelText('Nuova attività'), 'Studiare TanStack Query')
    await user.click(screen.getByRole('button', { name: 'Aggiungi' }))

    const list = screen.getByRole('list')
    expect(await within(list).findByText('Studiare TanStack Query')).toBeInTheDocument()
  })
})
