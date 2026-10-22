import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NewsletterForm } from '../action-state/NewsletterForm'
import { NotificationsDemo } from '../effect-event/NotificationsDemo'
import { MessageThread } from '../optimistic/MessageThread'
import { PasswordFields } from '../use-id/PasswordFields'
import { UsePromiseDemo } from '../use-promise/UsePromiseDemo'

/** Fake JSONPlaceholder: GET /users/1 exists, everything else 404; POST echoes the body. */
beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string, init?: RequestInit) => {
      const json = (body: unknown, status = 200) =>
        new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
      if (init?.method === 'POST') return json({ ...JSON.parse(String(init.body)), id: 501 }, 201)
      if (url.endsWith('/users/1')) return json({ id: 1, name: 'Leanne Graham', email: 'l@x.it', address: { city: 'Gwenborough' } })
      return json({}, 404)
    }),
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('useId', () => {
  it('gives each instance its own ids, so every label targets its own input', async () => {
    const user = userEvent.setup()
    render(<PasswordFields />)

    const password = screen.getByLabelText('Password')
    const confirm = screen.getByLabelText('Conferma password')
    expect(password.id).not.toBe(confirm.id)

    await user.click(screen.getByText('Conferma password'))
    expect(confirm).toHaveFocus()
  })
})

describe('use(promise) + Suspense + ErrorBoundary', () => {
  it('shows the fallback, then the data; a rejected promise reaches the boundary', async () => {
    const user = userEvent.setup()
    // A component that suspends must be rendered inside an AWAITED act(),
    // otherwise React ignores the promise resolution and never retries
    await act(async () => {
      render(<UsePromiseDemo />)
    })

    expect(screen.getByText('Caricamento utente…')).toBeInTheDocument()
    expect(await screen.findByText('Leanne Graham', {}, { timeout: 3000 })).toBeInTheDocument()

    await act(() => user.click(screen.getByRole('button', { name: '#999' })))
    expect(await screen.findByText(/Errore: 404/, {}, { timeout: 3000 })).toBeInTheDocument()
  })
})

describe('useActionState + useFormStatus', { timeout: 10_000 }, () => {
  it('validates in the action, keeps the typed value on error, then succeeds', async () => {
    const user = userEvent.setup()
    render(<NewsletterForm />)

    await user.type(screen.getByLabelText('Email'), 'ada')
    await user.click(screen.getByRole('button', { name: 'Iscriviti' }))
    expect(await screen.findByText('Inserisci un’email valida')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toHaveValue('ada') // restored via defaultValue

    await user.clear(screen.getByLabelText('Email'))
    await user.type(screen.getByLabelText('Email'), 'ada@lovelace.dev')
    await user.click(screen.getByRole('button', { name: 'Iscriviti' }))
    expect(screen.getByRole('button', { name: 'Iscrizione…' })).toBeDisabled() // useFormStatus
    expect(await screen.findByText(/Iscrizione confermata/, {}, { timeout: 3000 })).toBeInTheDocument()
  })
})

describe('useOptimistic', { timeout: 10_000 }, () => {
  it('shows the message immediately, then keeps it after the server answers', async () => {
    const user = userEvent.setup()
    render(<MessageThread />)

    await user.type(screen.getByLabelText('Messaggio'), 'Ciao a tutti')
    await user.click(screen.getByRole('button', { name: 'Invia' }))

    expect(screen.getByText('invio…')).toBeInTheDocument() // optimistic
    expect(await screen.findByText('Ciao a tutti')).toBeInTheDocument()
    await vi.waitFor(() => expect(screen.queryByText('invio…')).not.toBeInTheDocument(), { timeout: 3000 })
    expect(screen.getByText('Ciao a tutti')).toBeInTheDocument() // now real state
  })

  it('removes the optimistic message when sending fails', async () => {
    const user = userEvent.setup()
    render(<MessageThread />)

    await user.click(screen.getByLabelText('Simula errore di invio'))
    await user.type(screen.getByLabelText('Messaggio'), 'Questo fallirà')
    await user.click(screen.getByRole('button', { name: 'Invia' }))

    expect(screen.getByText('Questo fallirà')).toBeInTheDocument()
    expect(await screen.findByRole('alert', {}, { timeout: 3000 })).toHaveTextContent('non riuscito')
    expect(screen.queryByText('Questo fallirà')).not.toBeInTheDocument()
  })
})

describe('useEffectEvent', () => {
  it('reads the latest props without restarting the effect', async () => {
    const user = userEvent.setup()
    render(<NotificationsDemo />)

    await user.click(screen.getByLabelText('Silenzia notifiche'))

    // Changing `muted` did not disconnect/reconnect
    expect(screen.queryByText(/Disconnesso/)).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '#react' }))
    expect(screen.getByText('❌ Disconnesso da #generale')).toBeInTheDocument()
  })
})
