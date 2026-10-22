import { QueryClient } from '@tanstack/react-query'

/**
 * Factory instead of a single instance: tests create a fresh client each time,
 * so the cache never leaks from one test to another.
 */
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data is "fresh" for 30s: in that window, mounting a component reuses the cache without refetching
        staleTime: 30_000,
        // On failure, retry once (default: 3 times with exponential backoff)
        retry: 1,
      },
    },
  })
}

/** The app's client, provided in src/app/providers.tsx. */
export const queryClient = createQueryClient()
