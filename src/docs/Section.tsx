import type { ReactNode } from 'react'

type SectionProps = {
  id: string
  title: string
  children: ReactNode
}

/** A chapter of a note page. Collected automatically by the page's table of contents. */
export function Section({ id, title, children }: SectionProps) {
  return (
    <section id={id} data-toc={title} className="border-t border-zinc-200 pt-10 dark:border-zinc-800">
      <h2 className="group mb-4 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        {title}
        <a
          href={`#${id}`}
          aria-label={`Link a ${title}`}
          className="ml-2 text-zinc-300 opacity-0 transition group-hover:opacity-100 dark:text-zinc-600"
        >
          #
        </a>
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

/** Explanatory text block with the notes typography. */
export function Prose({ children }: { children: ReactNode }) {
  return <div className="prose-notes">{children}</div>
}
