import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ContactForm } from '../ContactForm'

describe('ContactForm', () => {
  it('enables submit only when the required fields are filled, then thanks the user', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    const submit = screen.getByRole('button', { name: 'Invia' })
    expect(submit).toBeDisabled()

    await user.type(screen.getByLabelText('Nome *'), 'Ada')
    await user.type(screen.getByLabelText('Email *'), 'ada@example.com')
    expect(submit).toBeEnabled()

    await user.click(submit)
    expect(screen.getByText(/messaggio inviato/)).toHaveTextContent('Grazie Ada')
  })
})
