import { BookmarkButton } from '@/features/bookmarks/BookmarkButton'
import { BookmarksList } from '@/features/bookmarks/BookmarksList'

const pages = [
  { path: '/routing', title: 'React Router' },
  { path: '/data-fetching', title: 'Data fetching' },
  { path: '/patterns', title: 'Pattern' },
]

// The same store as the ☆ in the header: bookmarking here updates it too
export function BookmarksDemo() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <ul className="space-y-1 text-sm">
        {pages.map((page) => (
          <li key={page.path} className="flex items-center gap-2">
            <BookmarkButton path={page.path} title={page.title} />
            {page.title}
          </li>
        ))}
      </ul>
      <BookmarksList />
    </div>
  )
}
