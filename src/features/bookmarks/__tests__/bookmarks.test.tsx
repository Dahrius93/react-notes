import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { BookmarkButton } from '../BookmarkButton'
import { BookmarksList } from '../BookmarksList'
import { createBookmarksStore } from '../bookmarksStore'

/** In-memory Storage: each test gets its own, nothing leaks between tests. */
function memoryStorage(): Storage {
  const data = new Map<string, string>()
  return {
    get length() {
      return data.size
    },
    clear: () => data.clear(),
    getItem: (key) => data.get(key) ?? null,
    key: (index) => [...data.keys()][index] ?? null,
    removeItem: (key) => void data.delete(key),
    setItem: (key, value) => void data.set(key, value),
  }
}

describe('bookmarksStore (no React)', () => {
  it('toggles bookmarks, newest first, and persists them', () => {
    const storage = memoryStorage()
    const store = createBookmarksStore(storage)

    store.toggle({ path: '/a', title: 'A' })
    store.toggle({ path: '/b', title: 'B' })
    expect(store.getSnapshot().map((b) => b.path)).toEqual(['/b', '/a'])

    store.toggle({ path: '/a', title: 'A' })
    expect(store.isBookmarked('/a')).toBe(false)

    // A new store on the same storage reads what was saved
    expect(createBookmarksStore(storage).getSnapshot().map((b) => b.path)).toEqual(['/b'])
  })

  it('keeps the same snapshot until something changes (required by useSyncExternalStore)', () => {
    const store = createBookmarksStore(memoryStorage())
    const first = store.getSnapshot()
    expect(store.getSnapshot()).toBe(first)

    store.toggle({ path: '/a', title: 'A' })
    expect(store.getSnapshot()).not.toBe(first)
  })

  it('notifies subscribers', () => {
    const store = createBookmarksStore(memoryStorage())
    let calls = 0
    const unsubscribe = store.subscribe(() => calls++)

    store.toggle({ path: '/a', title: 'A' })
    unsubscribe()
    store.remove('/a')

    expect(calls).toBe(1)
  })
})

describe('BookmarkButton + BookmarksList', () => {
  it('stay in sync through the shared store', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <BookmarkButton path="/routing" title="React Router" />
        <BookmarksList />
      </MemoryRouter>,
    )
    expect(screen.getByText(/Nessun preferito/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Aggiungi “React Router” ai preferiti' }))
    expect(screen.getByRole('link', { name: '★ React Router' })).toHaveAttribute('href', '/routing')

    await user.click(screen.getByRole('button', { name: 'Rimuovi React Router' }))
    expect(screen.getByRole('button', { name: 'Aggiungi “React Router” ai preferiti' })).toHaveAttribute('aria-pressed', 'false')
  })
})
