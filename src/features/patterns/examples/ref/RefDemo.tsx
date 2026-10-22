import { useRef, useState } from 'react'
import { useEventListener } from '@/shared/hooks/useEventListener'
import { Button } from '@/shared/ui/Button'
import { SearchBox, type SearchBoxHandle } from './SearchBox'

export function RefDemo() {
  const searchRef = useRef<SearchBoxHandle>(null)
  const [query, setQuery] = useState('')

  // Keyboard shortcut: "/" focuses the search, like on GitHub
  useEventListener('keydown', (event) => {
    const target = event.target as HTMLElement
    if (event.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
      event.preventDefault()
      searchRef.current?.focus()
    }
  })

  return (
    <div className="max-w-md space-y-3">
      <SearchBox ref={searchRef} onSearch={setQuery} />
      <div className="flex gap-2">
        <Button size="sm" variant="secondary" onClick={() => searchRef.current?.focus()}>
          focus()
        </Button>
        <Button size="sm" variant="secondary" onClick={() => searchRef.current?.clear()}>
          clear()
        </Button>
      </div>
      <p className="text-sm text-zinc-500">Ricerca: “{query}”</p>
    </div>
  )
}
