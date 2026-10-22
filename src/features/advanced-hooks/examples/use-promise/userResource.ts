import type { User } from '@/shared/api/jsonplaceholder/types'
import { getUser } from '@/shared/api/jsonplaceholder/users'
import { sleep } from '@/shared/lib/sleep'

// The promise must be the SAME object across renders: a promise created during render
// would be new every time, and `use` would suspend forever. So: a cache by id.
const cache = new Map<number, Promise<User>>()

export function fetchUser(id: number): Promise<User> {
  let promise = cache.get(id)
  if (!promise) {
    promise = sleep(800).then(() => getUser(id))
    // Don't keep failed requests: the next attempt will try again
    promise.catch(() => cache.delete(id))
    cache.set(id, promise)
  }
  return promise
}
