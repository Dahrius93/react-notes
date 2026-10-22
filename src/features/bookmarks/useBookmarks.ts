import { useSyncExternalStore } from 'react'
import { bookmarksStore, type BookmarksStore } from './bookmarksStore'

/**
 * The React side of the store: every component using it re-renders
 * when the bookmarks change, in this tab or in another one.
 */
export function useBookmarks(store: BookmarksStore = bookmarksStore) {
  const bookmarks = useSyncExternalStore(store.subscribe, store.getSnapshot)

  return {
    bookmarks,
    isBookmarked: (path: string) => bookmarks.some((bookmark) => bookmark.path === path),
    toggle: store.toggle,
    remove: store.remove,
  }
}
