import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SignupForm } from '../SignupForm'

// Fake JSONPlaceholder: echoes the body back with id 11, like the real API
const fetchMock = vi.fn(async (_url: string, init?: RequestInit) => {
  const body = JSON.parse(String(init?.body))
  return new Response(JSON.stringify({ ...body, id: 11 }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  })
})

async function fillValidForm(user: ReturnType<typeof userEvent.setup>, username = 'ada_l') {
  await user.type(screen.getByLabelText('Nome e cognome *'), 'Ada Lovelace')
  await user.type(screen.getByLabelText('Username *'), username)
  await user.type(screen.getByLabelText('Email *'), 'ada@example.com')
  await user.selectOptions(screen.getByLabelText('Ruolo *'), 'frontend')
  await user.click(screen.getByLabelText('Accetto i termini di servizio *'))
}

// Typing many fields + the 800ms fake latency: allow more than the default 5s on slow machines
describe('SignupForm', { timeout: 15_000 }, () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    fetchMock.mockClear()
  })

  it('shows the errors and focuses the first invalid field on submit', async () => {
    const user = userEvent.setup()
    render(<SignupForm />)

    await user.click(screen.getByRole('button', { name: 'Registrati' }))

    expect(screen.getByText('Il nome è obbligatorio')).toBeInTheDocument()
    expect(screen.getByText('Devi accettare i termini per continuare')).toBeInTheDocument()
    expect(screen.getByLabelText('Nome e cognome *')).toHaveFocus()
    expect(screen.getByLabelText('Nome e cognome *')).toHaveAttribute('aria-invalid', 'true')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('shows an error only after leaving the field', async () => {
    const user = userEvent.setup()
    render(<SignupForm />)

    await user.type(screen.getByLabelText('Email *'), 'ada@')
    expect(screen.queryByText('Formato email non valido')).not.toBeInTheDocument()

    await user.tab()
    expect(screen.getByText('Formato email non valido')).toBeInTheDocument()
  })

  it('sends valid data to the API and shows the response', async () => {
    const user = userEvent.setup()
    render(<SignupForm />)

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: 'Registrati' }))

    expect(screen.getByRole('button', { name: 'Invio in corso…' })).toBeDisabled()
    expect(await screen.findByText(/Utente creato/, {}, { timeout: 2000 })).toBeInTheDocument()

    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://jsonplaceholder.typicode.com/users')
    expect(init?.method).toBe('POST')
    expect(JSON.parse(String(init?.body))).toEqual({
      name: 'Ada Lovelace',
      username: 'ada_l',
      email: 'ada@example.com',
    })
  })

  it('shows the server error', async () => {
    const user = userEvent.setup()
    render(<SignupForm />)

    await fillValidForm(user, 'admin')
    await user.click(screen.getByRole('button', { name: 'Registrati' }))

    expect(await screen.findByRole('alert', {}, { timeout: 2000 })).toHaveTextContent('già in uso')
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
