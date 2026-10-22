import { render, screen } from '@testing-library/react'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { navItems } from '../navigation'
import { AppProviders } from '../providers'
import { routes } from '../router'

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  return render(
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>,
  )
}

describe('routes (smoke)', () => {
  beforeEach(() => {
    // Pages may fetch from JSONPlaceholder: never hit the network in tests
    vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders the home page', async () => {
    renderAt('/')
    expect(await screen.findByRole('heading', { level: 1, name: 'React Notes' })).toBeInTheDocument()
  })

  it.each(navItems.map((item) => [item.path, item.title]))('renders /%s', async (path, title) => {
    renderAt(`/${path}`)
    // Pages are lazy: the first import of a big page can exceed findBy's default 1s on a busy machine
    expect(await screen.findByRole('heading', { level: 1, name: title }, { timeout: 5000 })).toBeInTheDocument()
  })

  it('redirects /account to the login page when logged out', async () => {
    renderAt('/account')
    expect(await screen.findByRole('heading', { level: 1, name: 'Accedi' }, { timeout: 5000 })).toBeInTheDocument()
  })

  it('shows /account to a logged-in user', async () => {
    localStorage.setItem('react-notes:auth-user', JSON.stringify({ id: 1, name: 'Leanne Graham', username: 'Bret', email: 'b@x.it', company: { name: 'X' }, address: { city: 'Y' } }))
    renderAt('/account')
    expect(await screen.findByRole('heading', { level: 1, name: 'Il mio account' }, { timeout: 5000 })).toBeInTheDocument()
  })

  it('renders the 404 page for unknown paths', async () => {
    renderAt('/does-not-exist')
    expect(await screen.findByRole('heading', { level: 1, name: 'Pagina non trovata' })).toBeInTheDocument()
  })
})
