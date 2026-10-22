import { useEffect } from 'react'
import { useSearchParams } from 'react-router'
import { getPosts } from '@/shared/api/jsonplaceholder/posts'
import type { Post } from '@/shared/api/jsonplaceholder/types'
import { useAsync } from '@/shared/hooks/useAsync'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Spinner } from '@/shared/ui/Spinner'

const PAGE_SIZE = 5

export function PostsSearch() {
  const { data: posts, run } = useAsync<Post[]>()
  useEffect(() => void run(getPosts()), [run])

  // The URL is the state: ?q=...&author=...&page=...
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const author = searchParams.get('author') ?? ''
  const page = Math.max(1, Number(searchParams.get('page')) || 1)

  /** Updates several params at once. Empty values are removed from the URL. */
  function updateParams(changes: Record<string, string>, options?: { replace?: boolean }) {
    const next = new URLSearchParams(searchParams)
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value)
      else next.delete(key)
    }
    setSearchParams(next, options)
  }

  // Everything below is derived from the URL params
  const filtered = (posts ?? []).filter(
    (post) =>
      post.title.toLowerCase().includes(q.trim().toLowerCase()) && (!author || post.userId === Number(author)),
  )
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <Input
          label="Cerca nel titolo"
          value={q}
          // replace while typing: one history entry per search, not per keystroke
          onChange={(e) => updateParams({ q: e.target.value, page: '' }, { replace: true })}
          placeholder="es. qui"
        />
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Autore
          <select
            value={author}
            onChange={(e) => updateParams({ author: e.target.value, page: '' })}
            className="h-10 rounded-lg bg-white px-3 ring-1 ring-zinc-300 dark:bg-zinc-900 dark:ring-zinc-700"
          >
            <option value="">Tutti</option>
            {[1, 2, 3, 4, 5].map((id) => (
              <option key={id} value={id}>
                Utente {id}
              </option>
            ))}
          </select>
        </label>
      </div>

      {!posts ? (
        <Spinner />
      ) : (
        <ul className="space-y-1 text-sm">
          {visible.map((post) => (
            <li key={post.id}>
              <span className="text-zinc-400">#{post.id}</span> {post.title}
            </li>
          ))}
          {visible.length === 0 && <li className="text-zinc-500">Nessun risultato</li>}
        </ul>
      )}

      <div className="flex items-center gap-2 text-sm">
        <Button size="sm" variant="secondary" disabled={page <= 1} onClick={() => updateParams({ page: String(page - 1) })}>
          ← Prec.
        </Button>
        <span>
          Pagina {page} di {pageCount} · {filtered.length} risultati
        </span>
        <Button
          size="sm"
          variant="secondary"
          disabled={page >= pageCount}
          onClick={() => updateParams({ page: String(page + 1) })}
        >
          Succ. →
        </Button>
      </div>
    </div>
  )
}
