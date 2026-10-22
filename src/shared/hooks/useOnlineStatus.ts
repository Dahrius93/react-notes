import { useSyncExternalStore } from 'react'

// Defined outside the hook: a stable function, so React never re-subscribes
function subscribe(onChange: () => void) {
  window.addEventListener('online', onChange)
  window.addEventListener('offline', onChange)
  return () => {
    window.removeEventListener('online', onChange)
    window.removeEventListener('offline', onChange)
  }
}

/** Whether the browser is online. Updates when the connection drops or comes back. */
export function useOnlineStatus(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine, // value on the client
    () => true, // value during server rendering
  )
}
