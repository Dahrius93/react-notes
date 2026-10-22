import { createContext, use, useContext, useState, type ReactNode } from 'react'

type Accent = 'sky' | 'emerald' | 'rose'

// Full class names (not built with string concatenation) so Tailwind can find them
const accentClasses: Record<Accent, string> = {
  sky: 'bg-sky-100 text-sky-800 ring-sky-300 dark:bg-sky-950 dark:text-sky-300 dark:ring-sky-800',
  emerald: 'bg-emerald-100 text-emerald-800 ring-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-800',
  rose: 'bg-rose-100 text-rose-800 ring-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:ring-rose-800',
}

// 1. Create the context, with the value used when there is NO provider above
const AccentContext = createContext<Accent>('sky')

// 2. Read it anywhere below, without props
function Tag({ children }: { children: ReactNode }) {
  const accent = useContext(AccentContext)
  return <span className={`rounded-md px-2 py-1 text-sm ring-1 ${accentClasses[accent]}`}>{children}</span>
}

function TagRow({ title }: { title: string }) {
  // `use` (React 19) reads a context like useContext, and it may also be called inside an `if`
  const accent = use(AccentContext)
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-40 text-sm text-zinc-500">{title}</span>
      <Tag>React</Tag>
      <Tag>Context</Tag>
      <Tag>{accent}</Tag>
    </div>
  )
}

export function AccentDemo() {
  const [accent, setAccent] = useState<Accent>('emerald')

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2 text-sm">
        Colore del provider esterno
        <select
          value={accent}
          onChange={(e) => setAccent(e.target.value as Accent)}
          className="rounded-md bg-white px-2 py-1 ring-1 ring-zinc-300 dark:bg-zinc-900 dark:ring-zinc-700"
        >
          <option value="sky">sky</option>
          <option value="emerald">emerald</option>
          <option value="rose">rose</option>
        </select>
      </label>

      <TagRow title="Senza provider" />

      {/* 3. Provide a value: in React 19 the context itself is the provider */}
      <AccentContext value={accent}>
        <TagRow title="Provider esterno" />

        {/* The closest provider wins: this subtree overrides the value */}
        <AccentContext value="rose">
          <TagRow title="Provider annidato" />
        </AccentContext>
      </AccentContext>
    </div>
  )
}
