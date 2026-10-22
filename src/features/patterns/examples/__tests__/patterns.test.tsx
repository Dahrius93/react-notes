import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ActivityDemo } from '../activity/ActivityDemo'
import { ErrorBoundaryDemo } from '../basic/ErrorBoundaryDemo'
import { LazyChartDemo } from '../lazy/LazyChartDemo'
import { RefDemo } from '../ref/RefDemo'

describe('Error Boundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {}) // React logs caught errors
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('isolates the crash of one widget and lets the user retry', async () => {
    const user = userEvent.setup()
    render(<ErrorBoundaryDemo />)
    const [first] = screen.getAllByRole('button', { name: /Clic: 0/ })

    await user.click(first)
    await user.click(screen.getByRole('button', { name: /Clic: 1/ }))
    await user.click(screen.getByRole('button', { name: /Clic: 2/ }))

    expect(screen.getByRole('alert')).toHaveTextContent('si è rotto')
    expect(screen.getByRole('button', { name: /Clic: 0/ })).toBeInTheDocument() // the other widget still works

    await user.click(screen.getByRole('button', { name: 'Riprova' }))
    expect(screen.getAllByRole('button', { name: /Clic: 0/ })).toHaveLength(2)
  })
})

describe('React.lazy', { timeout: 10_000 }, () => {
  it('shows the fallback while the code downloads, then the component', async () => {
    const user = userEvent.setup()
    render(<LazyChartDemo />)

    await act(() => user.click(screen.getByRole('button', { name: 'Mostra grafico' })))

    expect(screen.getByText(/Scaricamento del codice/)).toBeInTheDocument()
    expect(await screen.findByRole('img', { name: 'Vendite per mese' }, { timeout: 3000 })).toBeInTheDocument()
  })
})

describe('ref as a prop + useImperativeHandle', () => {
  it('lets the parent call focus() and clear() on the child', async () => {
    const user = userEvent.setup()
    render(<RefDemo />)
    const input = screen.getByLabelText('Cerca')

    await user.type(input, 'react')
    expect(screen.getByText('Ricerca: “react”')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'clear()' }))
    expect(input).toHaveValue('')
    expect(input).toHaveFocus()
  })
})

describe('<Activity>', () => {
  it('keeps the state of a hidden part; conditional rendering loses it', async () => {
    const user = userEvent.setup()
    render(<ActivityDemo />)

    await user.type(screen.getByLabelText('Bozza'), 'testo importante')
    await user.click(screen.getByRole('button', { name: 'Cronometro' }))
    await user.click(screen.getByRole('button', { name: 'Bozza' }))
    expect(screen.getByLabelText('Bozza')).toHaveValue('testo importante')

    await user.click(screen.getByLabelText(/usa <Activity>/))
    await user.click(screen.getByRole('button', { name: 'Cronometro' }))
    await user.click(screen.getByRole('button', { name: 'Bozza' }))
    expect(screen.getByLabelText('Bozza')).toHaveValue('')
  })
})
