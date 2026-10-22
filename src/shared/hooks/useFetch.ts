import { useCallback, useEffect, useState } from 'react'
import { request } from '@/shared/api/http'
import { useAsync } from './useAsync'

/**
 * Loads JSON from `url` when the component mounts and every time the URL changes.
 * The previous request is aborted, so a slow old response can't overwrite a new one.
 * Pass `null` to skip the request (e.g. while a required id is missing).
 *
 * No cache: for real apps prefer TanStack Query.
 *
 * @example
 * const { data: user, error, isPending, refetch } = useFetch<User>(`${API_URL}/users/${id}`)
 */
export function useFetch<T>(url: string | null) {
  // reset is left out on purpose: here the URL drives the state, and refetch() reloads
  const { run, reset: _reset, ...state } = useAsync<T>()
  const [reloadCount, setReloadCount] = useState(0)

  useEffect(() => {
    if (url === null) return
    const controller = new AbortController()
    void run(request<T>(url, { signal: controller.signal }))
    return () => controller.abort()
  }, [url, reloadCount, run])

  // Changing reloadCount re-runs the effect with the same URL
  const refetch = useCallback(() => setReloadCount((count) => count + 1), [])

  if (url === null) {
    return { status: 'idle' as const, data: undefined, error: undefined, isIdle: true, isPending: false, isSuccess: false, isError: false, refetch }
  }
  return { ...state, refetch }
}
