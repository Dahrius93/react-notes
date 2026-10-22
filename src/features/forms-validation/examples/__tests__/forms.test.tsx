import { QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createQueryClient } from '@/shared/api/queryClient'
import { SignInForm } from '../basic/SignInForm'
import { InvoiceForm } from '../invoice/InvoiceForm'
import { ReviewForm } from '../review/ReviewForm'
import { SignupForm } from '../signup/SignupForm'

function renderWithClient(ui: ReactNode) {
  return render(<QueryClientProvider client={createQueryClient()}>{ui}</QueryClientProvider>)
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('SignInForm', () => {
  it('shows the Zod messages on submit and focuses the first invalid field', async () => {
    const user = userEvent.setup()
    render(<SignInForm />)

    await user.click(screen.getByRole('button', { name: 'Accedi' }))

    expect(await screen.findByText('Inserisci un’email valida')).toBeInTheDocument()
    expect(screen.getByText('Almeno 8 caratteri')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toHaveFocus()
  })

  it('submits valid data', async () => {
    const user = userEvent.setup()
    render(<SignInForm />)

    await user.type(screen.getByLabelText('Email'), 'ada@example.com')
    await user.type(screen.getByLabelText('Password'), 'password1')
    await user.click(screen.getByRole('button', { name: 'Accedi' }))

    expect(await screen.findByText('ada@example.com')).toBeInTheDocument()
  })
})

describe('SignupForm', { timeout: 15_000 }, () => {
  it('shows the server error on a taken username (setError)', async () => {
    // findUserByUsername("Bret") → found
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify([{ id: 1, username: 'Bret' }]), { headers: { 'Content-Type': 'application/json' } })),
    )
    const user = userEvent.setup()
    renderWithClient(<SignupForm />)

    await user.type(screen.getByLabelText('Nome e cognome *'), 'Leanne Graham')
    await user.type(screen.getByLabelText('Username *'), 'Bret')
    await user.type(screen.getByLabelText('Email *'), 'bret@example.com')
    await user.selectOptions(screen.getByLabelText('Ruolo *'), 'frontend')
    await user.type(screen.getByLabelText('Password *'), 'password1')
    await user.type(screen.getByLabelText('Conferma password *'), 'password1')
    await user.click(screen.getByLabelText('Accetto i termini di servizio *'))
    await user.click(screen.getByRole('button', { name: 'Registrati' }))

    expect(await screen.findByText('Username già in uso')).toBeInTheDocument()
    expect(screen.getByLabelText('Username *')).toHaveFocus()
  })

  it('reports mismatching passwords', async () => {
    const user = userEvent.setup()
    renderWithClient(<SignupForm />)

    await user.type(screen.getByLabelText('Password *'), 'password1')
    await user.type(screen.getByLabelText('Conferma password *'), 'password2')
    await user.tab() // mode onTouched: validates on blur

    expect(await screen.findByText('Le password non coincidono')).toBeInTheDocument()
  })
})

describe('ReviewForm (Controller)', () => {
  it('requires a rating, then accepts a click on a star', async () => {
    const user = userEvent.setup()
    render(<ReviewForm />)

    await user.type(screen.getByLabelText('Commento *'), 'Ottimo prodotto, consigliato')
    await user.click(screen.getByRole('button', { name: 'Invia recensione' }))
    expect(await screen.findByText('Dai almeno una stella')).toBeInTheDocument()

    await user.click(screen.getByRole('radio', { name: '4 stelle' }))
    await user.click(screen.getByRole('button', { name: 'Invia recensione' }))
    expect(await screen.findByText(/Hai dato 4\/5/)).toBeInTheDocument()
  })
})

describe('InvoiceForm (useFieldArray)', () => {
  it('adds lines, updates the total and validates each line', async () => {
    const user = userEvent.setup()
    render(<InvoiceForm />)

    await user.type(screen.getByLabelText('Descrizione riga 1'), 'Consulenza')
    const price = screen.getByLabelText('Prezzo riga 1')
    await user.clear(price)
    await user.type(price, '100')
    expect(screen.getByText(/Totale/)).toHaveTextContent('100,00')

    await user.click(screen.getByRole('button', { name: '+ Aggiungi riga' }))
    await user.click(screen.getByRole('button', { name: 'Crea fattura' }))

    // The new line has an empty description → error on lines.1.description
    expect(await screen.findAllByText('Obbligatoria')).toHaveLength(1)
    expect(screen.getByText('Indica il cliente')).toBeInTheDocument()
  })
})
