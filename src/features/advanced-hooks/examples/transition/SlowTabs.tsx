import { useState, useTransition } from 'react'
import { blockFor } from '@/docs/blockFor'
import { cn } from '@/shared/lib/cn'

type Tab = 'about' | 'posts' | 'contact'

// Each row takes ~1ms to render: 300 rows ≈ 300ms (twice in dev, StrictMode)
function SlowRow({ index }: { index: number }) {
  blockFor(1) // simulate an expensive component
  return <li className="py-0.5">Post #{index + 1}</li>
}

function SlowPosts() {
  return (
    <ul className="h-40 overflow-auto text-sm">
      {Array.from({ length: 300 }, (_, i) => (
        <SlowRow key={i} index={i} />
      ))}
    </ul>
  )
}

export function SlowTabs() {
  const [tab, setTab] = useState<Tab>('about')
  const [isPending, startTransition] = useTransition()
  const [useTransitionEnabled, setUseTransitionEnabled] = useState(true)

  function selectTab(next: Tab) {
    if (useTransitionEnabled) {
      // Non-urgent update: React renders it in the background and can interrupt it
      startTransition(() => setTab(next))
    } else {
      // Urgent update: the page is frozen until the slow tab has rendered
      setTab(next)
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'about', label: 'Info' },
    { id: 'posts', label: 'Post (lenta)' },
    { id: 'contact', label: 'Contatti' },
  ]

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={useTransitionEnabled} onChange={(e) => setUseTransitionEnabled(e.target.checked)} />
        usa startTransition
      </label>

      <div className="flex gap-1">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => selectTab(id)}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm',
              tab === id ? 'bg-sky-600 text-white' : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* isPending: the transition is still rendering, the old tab stays visible */}
      <div className={cn('min-h-40 rounded-lg bg-zinc-50 p-3 transition-opacity dark:bg-zinc-900', isPending && 'opacity-50')}>
        {tab === 'about' && <p className="text-sm">Clicca &quot;Post&quot; e subito dopo &quot;Contatti&quot;.</p>}
        {tab === 'posts' && <SlowPosts />}
        {tab === 'contact' && <p className="text-sm">contatti@esempio.it</p>}
      </div>
    </div>
  )
}
