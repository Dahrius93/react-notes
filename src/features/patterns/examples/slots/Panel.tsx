import type { ReactNode } from 'react'

type PanelProps = {
  title: ReactNode
  /** Slot: buttons in the top-right corner */
  actions?: ReactNode
  /** Slot: content of the bottom bar */
  footer?: ReactNode
  children: ReactNode
}

/**
 * "Slots": props that accept JSX. The component decides WHERE things go,
 * the caller decides WHAT goes there. More flexible than a prop for every variant.
 */
export function Panel({ title, actions, footer, children }: PanelProps) {
  return (
    <section className="overflow-hidden rounded-xl ring-1 ring-zinc-200 dark:ring-zinc-800">
      <header className="flex items-center justify-between gap-2 border-b border-zinc-200 px-4 py-2 dark:border-zinc-800">
        <h3 className="font-semibold">{title}</h3>
        {actions && <div className="flex gap-1">{actions}</div>}
      </header>
      <div className="p-4 text-sm">{children}</div>
      {footer && (
        <footer className="border-t border-zinc-200 bg-zinc-50 px-4 py-2 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
          {footer}
        </footer>
      )}
    </section>
  )
}
