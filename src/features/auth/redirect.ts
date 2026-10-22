import type { Location } from 'react-router'

/**
 * Where to go after login: the page RequireAuth saved in `location.state.from`,
 * or `fallback` when the user opened the login page directly.
 */
export function getRedirectPath(state: unknown, fallback = '/'): string {
  const from = (state as { from?: Location } | null)?.from
  return from ? `${from.pathname}${from.search}${from.hash}` : fallback
}
