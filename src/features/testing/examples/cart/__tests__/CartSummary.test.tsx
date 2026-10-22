import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CartSummary } from '../CartSummary'
import { validateCoupon } from '../couponService'

// Replace the whole module: no network, no 600ms wait, and we decide the answer.
// vi.mock is hoisted: it runs before the imports above.
vi.mock('../couponService', () => ({ validateCoupon: vi.fn() }))
const validateCouponMock = vi.mocked(validateCoupon)

beforeEach(() => {
  validateCouponMock.mockReset()
})

describe('CartSummary', () => {
  it('shows the items and the total', () => {
    render(<CartSummary />)

    // Query by role and accessible name, like a user or a screen reader
    const cart = screen.getByRole('region', { name: 'Carrello' })
    expect(within(cart).getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByTestId('cart-total')).toHaveTextContent('62,00')
  })

  it('updates quantities and removes an item at zero', async () => {
    const user = userEvent.setup()
    render(<CartSummary />)

    await user.click(screen.getByRole('button', { name: 'Aumenta Tazza React' }))
    expect(screen.getByLabelText('Quantità di Tazza React')).toHaveTextContent('2')
    expect(screen.getByTestId('cart-total')).toHaveTextContent('74,00')

    await user.click(screen.getByRole('button', { name: 'Diminuisci Tazza React' }))
    await user.click(screen.getByRole('button', { name: 'Diminuisci Tazza React' }))
    // queryBy* returns null instead of throwing: the right tool to assert absence
    expect(screen.queryByText('Tazza React')).not.toBeInTheDocument()
  })

  it('applies a valid coupon returned by the (mocked) service', async () => {
    validateCouponMock.mockResolvedValue({ code: 'REACT10', percent: 10 })
    const user = userEvent.setup()
    render(<CartSummary />)

    await user.type(screen.getByLabelText('Codice sconto'), 'react10')
    await user.click(screen.getByRole('button', { name: 'Applica' }))

    // findBy* waits for async UI updates (default up to 1s)
    expect(await screen.findByText('Sconto REACT10 (−10%)')).toBeInTheDocument()
    expect(screen.getByTestId('cart-total')).toHaveTextContent('55,80')
    expect(validateCouponMock).toHaveBeenCalledWith('react10')
  })

  it('shows the error of an invalid coupon and disables the button while checking', async () => {
    let reject!: (error: Error) => void
    validateCouponMock.mockReturnValue(new Promise((_, rej) => (reject = rej)))
    const user = userEvent.setup()
    render(<CartSummary />)

    await user.type(screen.getByLabelText('Codice sconto'), 'NOPE')
    await user.click(screen.getByRole('button', { name: 'Applica' }))
    expect(screen.getByRole('button', { name: 'Verifica…' })).toBeDisabled()

    reject(new Error('Il codice “NOPE” non è valido'))
    expect(await screen.findByText('Il codice “NOPE” non è valido')).toBeInTheDocument()
    expect(screen.getByLabelText('Codice sconto')).toHaveAttribute('aria-invalid', 'true')
  })
})
