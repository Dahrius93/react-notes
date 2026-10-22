import { useState } from 'react'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { Badge } from '@/shared/ui/Badge'
import { Input } from '@/shared/ui/Input'

const libraries = [
  'React', 'React Router', 'React Hook Form', 'React Query', 'Redux', 'Redux Toolkit', 'Zustand', 'Jotai',
  'Zod', 'Vite', 'Vitest', 'Testing Library', 'Playwright', 'Tailwind CSS', 'Radix UI', 'shadcn/ui',
  'Framer Motion', 'date-fns', 'Day.js', 'Axios', 'TanStack Table', 'TanStack Router', 'Next.js', 'Remix',
]

export function DebouncedSearch() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 400)
  const isWaiting = query !== debouncedQuery

  // In a real app this would be an API call: with debounce it runs once per pause, not per keystroke
  const results = libraries.filter((lib) => lib.toLowerCase().includes(debouncedQuery.trim().toLowerCase()))

  return (
    <div className="max-w-lg space-y-4">
      <Input label="Cerca una libreria" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="es. react" />

      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-mono text-sm">
        <dt className="text-zinc-500">query</dt>
        <dd>&quot;{query}&quot;</dd>
        <dt className="text-zinc-500">debounced</dt>
        <dd className="flex items-center gap-2">
          &quot;{debouncedQuery}&quot; {isWaiting && <Badge tone="warning">in attesa…</Badge>}
        </dd>
      </dl>

      <ul className="flex flex-wrap gap-2">
        {results.map((lib) => (
          <li key={lib}>
            <Badge tone="info">{lib}</Badge>
          </li>
        ))}
        {results.length === 0 && <li className="text-sm text-zinc-500">Nessun risultato</li>}
      </ul>
    </div>
  )
}
