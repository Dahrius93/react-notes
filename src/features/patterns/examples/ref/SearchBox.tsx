import { useImperativeHandle, useRef, useState, type Ref } from 'react'

/** What the parent can do through the ref: only these two methods, not the whole <input>. */
export type SearchBoxHandle = {
  focus: () => void
  clear: () => void
}

type SearchBoxProps = {
  // React 19: `ref` is a normal prop, no forwardRef needed
  ref?: Ref<SearchBoxHandle>
  onSearch: (query: string) => void
}

export function SearchBox({ ref, onSearch }: SearchBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')

  // Defines the value the parent's ref receives
  useImperativeHandle(
    ref,
    () => ({
      focus: () => inputRef.current?.focus(),
      clear: () => {
        setQuery('')
        onSearch('')
        inputRef.current?.focus()
      },
    }),
    [onSearch],
  )

  return (
    <input
      ref={inputRef}
      type="search"
      aria-label="Cerca"
      value={query}
      onChange={(e) => {
        setQuery(e.target.value)
        onSearch(e.target.value)
      }}
      placeholder="Cerca… (premi / per il focus)"
      className="h-10 w-full rounded-lg bg-white px-3 text-sm ring-1 ring-zinc-300 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-zinc-900 dark:ring-zinc-700"
    />
  )
}
