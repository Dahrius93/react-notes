import { vi } from 'vitest'

type FakeRequest = { url: URL; method: string; body: unknown }
type Handler = (request: FakeRequest) => unknown

/**
 * Replaces the global fetch with a tiny fake server.
 * Keys are "METHOD /path" (query string included if present); values are
 * the JSON body to return, or a function that builds it from the request.
 * Unknown routes answer 404. Undone automatically after each test (setup.ts).
 *
 * @example
 * const fetchMock = mockFetch({
 *   'GET /users/1': { id: 1, name: 'Ada' },
 *   'POST /posts': ({ body }) => ({ ...body, id: 101 }),
 * })
 * expect(fetchMock).toHaveBeenCalledTimes(1)
 */
export function mockFetch(routes: Record<string, unknown>) {
  const fetchMock = vi.fn(async (input: string | URL, init?: RequestInit) => {
    const url = new URL(String(input), 'http://localhost')
    const method = (init?.method ?? 'GET').toUpperCase()
    const key = [`${method} ${url.pathname}${url.search}`, `${method} ${url.pathname}`].find((k) => k in routes)

    if (!key) return new Response(JSON.stringify({}), { status: 404 })

    const value = routes[key]
    const body = init?.body ? JSON.parse(String(init.body)) : undefined
    const data = typeof value === 'function' ? (value as Handler)({ url, method, body }) : value
    return new Response(JSON.stringify(data), {
      status: method === 'POST' ? 201 : 200,
      headers: { 'Content-Type': 'application/json' },
    })
  })

  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}
