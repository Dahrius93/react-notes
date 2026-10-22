import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ErrorBoundary } from '../ErrorBoundary'

function Bomb({ explode }: { explode: boolean }) {
  if (explode) throw new Error('Boom')
  return <p>Tutto ok</p>
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // React logs caught render errors: keep the test output clean
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('shows the fallback instead of crashing, and calls onError', () => {
    const onError = vi.fn()
    render(
      <ErrorBoundary fallback={<p>Qualcosa è andato storto</p>} onError={onError}>
        <Bomb explode />
      </ErrorBoundary>,
    )

    expect(screen.getByText('Qualcosa è andato storto')).toBeInTheDocument()
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ message: 'Boom' }), expect.anything())
  })

  it('resets when a resetKey changes', () => {
    const { rerender } = render(
      <ErrorBoundary resetKeys={[1]} fallback={({ error }) => <p>Errore: {error.message}</p>}>
        <Bomb explode />
      </ErrorBoundary>,
    )
    expect(screen.getByText('Errore: Boom')).toBeInTheDocument()

    rerender(
      <ErrorBoundary resetKeys={[2]} fallback={({ error }) => <p>Errore: {error.message}</p>}>
        <Bomb explode={false} />
      </ErrorBoundary>,
    )
    expect(screen.getByText('Tutto ok')).toBeInTheDocument()
  })

  it('offers a reset function to the fallback', async () => {
    const user = userEvent.setup()
    let explode = true
    function MaybeBomb() {
      return <Bomb explode={explode} />
    }
    render(
      <ErrorBoundary
        fallback={({ reset }) => (
          <button
            onClick={() => {
              explode = false
              reset()
            }}
          >
            Riprova
          </button>
        )}
      >
        <MaybeBomb />
      </ErrorBoundary>,
    )

    await user.click(screen.getByRole('button', { name: 'Riprova' }))
    expect(screen.getByText('Tutto ok')).toBeInTheDocument()
  })
})
