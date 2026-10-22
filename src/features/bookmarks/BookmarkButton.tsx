import { cn } from '@/shared/lib/cn'
import { useBookmarks } from './useBookmarks'

type BookmarkButtonProps = {
  path: string
  title: string
}

/** Star toggle: saves or removes the page from the bookmarks. */
export function BookmarkButton({ path, title }: BookmarkButtonProps) {
  const { isBookmarked, toggle } = useBookmarks()
  const saved = isBookmarked(path)

  return (
    <button
      type="button"
      onClick={() => toggle({ path, title })}
      aria-pressed={saved}
      aria-label={saved ? `Rimuovi “${title}” dai preferiti` : `Aggiungi “${title}” ai preferiti`}
      title={saved ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
      className={cn(
        'rounded-md px-2 py-1 text-lg leading-none transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800',
        saved ? 'text-amber-400' : 'text-zinc-400',
      )}
    >
      {saved ? '★' : '☆'}
    </button>
  )
}
