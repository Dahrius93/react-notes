import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { KeysDemo } from '../KeysDemo'
import { countPrimes } from '../slow'

describe('countPrimes', () => {
  it.each([
    [10, 4],
    [100, 25],
    [1000, 168],
  ])('countPrimes(%i) = %i', (limit, expected) => {
    expect(countPrimes(limit)).toBe(expected)
  })
})

describe('KeysDemo', () => {
  it('keeps the input state with the right person only when key = id', async () => {
    const user = userEvent.setup()
    render(<KeysDemo />)

    // Both columns have a "Nota per Ada" input: [0] = key index, [1] = key id
    const [byIndex, byId] = screen.getAllByPlaceholderText('Nota per Ada')
    await user.type(byIndex, 'nota di Ada')
    await user.type(byId, 'nota di Ada')

    await user.click(screen.getByRole('button', { name: 'Aggiungi in cima' }))

    const [adaByIndex, adaById] = screen.getAllByPlaceholderText('Nota per Ada')
    // key = index: the text stayed in the FIRST row, which is now a different person
    expect(adaByIndex).toHaveValue('')
    // key = id: the text moved together with Ada
    expect(adaById).toHaveValue('nota di Ada')
  })
})
