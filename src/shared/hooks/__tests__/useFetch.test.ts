import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useFetch } from '../useFetch'

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('useFetch', () => {
  it('loads the data', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse({ id: 1 })))
    const { result } = renderHook(() => useFetch<{ id: number }>('/api/item'))

    expect(result.current.isPending).toBe(true)
    await waitFor(() => expect(result.current.data).toEqual({ id: 1 }))
  })

  it('exposes HTTP errors', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse({}, 404)))
    const { result } = renderHook(() => useFetch('/api/missing'))

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error?.message).toMatch('404')
  })

  it('aborts the previous request when the URL changes', async () => {
    const signals: AbortSignal[] = []
    vi.stubGlobal(
      'fetch',
      vi.fn(async (_url: string, init?: RequestInit) => {
        signals.push(init!.signal!)
        return jsonResponse({})
      }),
    )
    const { rerender } = renderHook(({ url }) => useFetch(url), { initialProps: { url: '/a' } })

    rerender({ url: '/b' })

    // StrictMode isn't active in tests: one request per URL
    expect(signals[0].aborted).toBe(true)
    expect(signals.at(-1)!.aborted).toBe(false)
  })

  it('stays idle with a null URL', () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    const { result } = renderHook(() => useFetch(null))

    expect(result.current.status).toBe('idle')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('refetches on demand', async () => {
    const fetchMock = vi.fn(async () => jsonResponse({}))
    vi.stubGlobal('fetch', fetchMock)
    const { result } = renderHook(() => useFetch('/api/item'))
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    act(() => result.current.refetch())

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))
  })
})
