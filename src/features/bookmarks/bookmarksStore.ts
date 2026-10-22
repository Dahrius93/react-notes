import type { Bookmark } from './types'

const STORAGE_KEY = 'react-notes:bookmarks'

/**
 * Bookmarks kept in localStorage, with a subscribe/getSnapshot API
 * that useSyncExternalStore understands. Plain TypeScript: no React here,
 * so the logic is tested without rendering anything.
 *
 * A factory (not a singleton only) so tests get a fresh store with its own storage.
 */
export function createBookmarksStore(storage: Storage = window.localStorage) {
  const listeners = new Set<() => void>()
  let snapshot: Bookmark[] | null = null // cached: same array until something changes

  function read(): Bookmark[] {
    try {
      return JSON.parse(storage.getItem(STORAGE_KEY) ?? '[]') as Bookmark[]
    } catch {
      return []
    }
  }

  function write(next: Bookmark[]) {
    snapshot = next
    storage.setItem(STORAGE_KEY, JSON.stringify(next))
    listeners.forEach((listener) => listener())
  }

  function getSnapshot(): Bookmark[] {
    snapshot ??= read()
    return snapshot
  }

  function subscribe(listener: () => void) {
    listeners.add(listener)
    // Another tab changed the bookmarks: drop the cache and notify
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return
      snapshot = null
      listener()
    }
    window.addEventListener('storage', onStorage)
    return () => {
      listeners.delete(listener)
      window.removeEventListener('storage', onStorage)
    }
  }

  function isBookmarked(path: string) {
    return getSnapshot().some((bookmark) => bookmark.path === path)
  }

  /** Adds the page if missing, removes it if present. Newest first. */
  function toggle(page: Omit<Bookmark, 'addedAt'>) {
    const current = getSnapshot()
    write(
      isBookmarked(page.path)
        ? current.filter((bookmark) => bookmark.path !== page.path)
        : [{ ...page, addedAt: Date.now() }, ...current],
    )
  }

  function remove(path: string) {
    write(getSnapshot().filter((bookmark) => bookmark.path !== path))
  }

  return { getSnapshot, subscribe, isBookmarked, toggle, remove }
}

export type BookmarksStore = ReturnType<typeof createBookmarksStore>

/** The app's store. */
export const bookmarksStore = createBookmarksStore()
