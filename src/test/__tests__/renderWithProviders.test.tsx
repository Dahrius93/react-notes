import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { RequireAuth } from '@/features/auth/RequireAuth'
import { UsersList } from '@/features/data-fetching/examples/basic-query/UsersList'
import { mockFetch } from '../mockFetch'
import { renderWithProviders } from '../renderWithProviders'

const loginRoute = { path: '/login', element: <h1>Pagina di login</h1> }

describe('renderWithProviders', () => {
  it('provides the router and auth: anonymous users are redirected to /login', async () => {
    const { router } = renderWithProviders(
      <RequireAuth>
        <p>Area riservata</p>
      </RequireAuth>,
      { route: '/account', routes: [loginRoute] },
    )

    expect(await screen.findByRole('heading', { name: 'Pagina di login' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/login')
  })

  it('logs a user in through the `user` option', () => {
    renderWithProviders(
      <RequireAuth>
        <p>Area riservata</p>
      </RequireAuth>,
      { route: '/account', user: { id: 1, username: 'Bret' } },
    )

    expect(screen.getByText('Area riservata')).toBeInTheDocument()
  })

  it('provides TanStack Query; mockFetch answers like the real API', async () => {
    const fetchMock = mockFetch({
      'GET /users': [{ id: 1, name: 'Leanne Graham', email: 'leanne@example.com' }],
    })
    renderWithProviders(<UsersList />)

    expect(await screen.findByText('Leanne Graham')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
