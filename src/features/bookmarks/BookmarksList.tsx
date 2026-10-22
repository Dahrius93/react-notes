import { Link } from 'react-router'
import { Button } from '@/shared/ui/Button'
import { List } from '@/shared/ui/List'
import { useBookmarks } from './useBookmarks'

/** The saved pages, newest first. Built on the generic List of shared/ui. */
export function BookmarksList() {
  const { bookmarks, remove } = useBookmarks()

  return (
    <List
      items={bookmarks}
      getKey={(bookmark) => bookmark.path}
      empty="Nessun preferito: usa la ☆ in alto a destra su una pagina per salvarla qui."
      renderItem={(bookmark) => (
        <div className="flex items-center justify-between gap-2">
          <Link to={bookmark.path} className="font-medium text-sky-700 hover:underline dark:text-sky-400">
            ★ {bookmark.title}
          </Link>
          <Button size="sm" variant="ghost" onClick={() => remove(bookmark.path)} aria-label={`Rimuovi ${bookmark.title}`}>
            ✕
          </Button>
        </div>
      )}
    />
  )
}
