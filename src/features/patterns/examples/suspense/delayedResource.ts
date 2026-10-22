import { sleep } from '@/shared/lib/sleep'

// Cached promises (same key → same promise), as `use` requires
const cache = new Map<string, Promise<string>>()

/** A fake resource that resolves with `value` after `ms` milliseconds. */
export function loadAfter(key: string, ms: number, value: string): Promise<string> {
  let promise = cache.get(key)
  if (!promise) {
    promise = sleep(ms).then(() => value)
    cache.set(key, promise)
  }
  return promise
}
