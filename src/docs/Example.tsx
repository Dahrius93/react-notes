import { useState, type ReactNode } from 'react'
import { useToggle } from '@/shared/hooks/useToggle'
import { CodeBlock } from './CodeBlock'

type ExampleProps = {
  title: string
  /** Source shown under the demo, usually imported with `?raw` */
  code: string
  /** Path of the file inside the project, shown as caption */
  file: string
  children: ReactNode
}

/**
 * A live demo followed by the source code that renders it.
 * "Reset" remounts the demo (new `key`), so state and effects start over.
 */
export function Example({ title, code, file, children }: ExampleProps) {
  const [demoKey, setDemoKey] = useState(0)
  const [showCode, { toggle }] = useToggle(true)

  return (
    <figure className="my-6 overflow-hidden rounded-xl ring-1 ring-zinc-200 dark:ring-zinc-800">
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 bg-zinc-50 px-4 py-2 dark:border-zinc-800 dark:bg-zinc-900">
        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{title}</span>
        <span className="flex gap-1">
          <button
            type="button"
            onClick={() => setDemoKey((k) => k + 1)}
            className="rounded px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            ↺ Reset
          </button>
          <button
            type="button"
            onClick={toggle}
            aria-expanded={showCode}
            className="rounded px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            {showCode ? 'Nascondi codice' : 'Mostra codice'}
          </button>
        </span>
      </figcaption>

      <div key={demoKey} className="bg-white p-6 dark:bg-zinc-950">
        {children}
      </div>

      {showCode && <CodeBlock code={code} filename={file} className="rounded-none ring-0" />}
    </figure>
  )
}
