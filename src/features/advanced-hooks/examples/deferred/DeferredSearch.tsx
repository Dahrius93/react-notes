import { memo, useDeferredValue, useState } from 'react'
import { blockFor } from '@/docs/blockFor'
import { cn } from '@/shared/lib/cn'
import { Input } from '@/shared/ui/Input'

const words = ['react', 'hook', 'stato', 'effetto', 'context', 'router', 'query', 'form', 'zod', 'vite', 'test', 'render']
const items = Array.from({ length: 5000 }, (_, i) => `${words[i % 12]} ${words[(i * 7) % 12]} #${i + 1}`)

// memo is essential: during the urgent render the deferred query is still the old one,
// so this component receives the same props and React skips it
const SlowResults = memo(function SlowResults({ query }: { query: string }) {
  const results = items.filter((item) => item.includes(query.toLowerCase())).slice(0, 150)
  return (
    <ul className="h-48 overflow-auto font-mono text-xs">
      {results.map((item) => (
        <SlowRow key={item} text={item} />
      ))}
    </ul>
  )
})

function SlowRow({ text }: { text: string }) {
  blockFor(1) // simulate an expensive row: ~150ms for 150 rows
  return <li>{text}</li>
}

export function DeferredSearch() {
  const [query, setQuery] = useState('')
  const [isDeferEnabled, setIsDeferEnabled] = useState(true)

  // A copy of `query` that "lags behind": updated in a background render
  const deferredQuery = useDeferredValue(query)
  const shownQuery = isDeferEnabled ? deferredQuery : query
  const isStale = query !== shownQuery

  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={isDeferEnabled} onChange={(e) => setIsDeferEnabled(e.target.checked)} />
        usa useDeferredValue
      </label>
      {/* The input always uses the urgent value: it stays responsive */}
      <Input label="Cerca tra 5000 elementi" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="scrivi velocemente…" />
      <div className={cn('transition-opacity', isStale && 'opacity-50')}>
        <SlowResults query={shownQuery} />
      </div>
    </div>
  )
}
