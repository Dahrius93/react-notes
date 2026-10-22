import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Counter } from '../Counter'

describe('Counter', () => {
  it('adds only 1 when setting the value three times', async () => {
    render(<Counter />)
    await userEvent.click(screen.getByRole('button', { name: '+3 con valore' }))
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('adds 3 with the updater function', async () => {
    render(<Counter />)
    await userEvent.click(screen.getByRole('button', { name: '+3 con funzione' }))
    expect(screen.getByText('3')).toBeInTheDocument()
  })
})
