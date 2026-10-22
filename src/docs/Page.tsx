import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useDocumentTitle } from '@/shared/hooks/useDocumentTitle'

type PageProps = {
  title: string
  /** One-line summary under the title */
  lead: ReactNode
  children: ReactNode
}

type TocItem = { id: string; title: string }

/**
 * Layout of a note page: title, lead and a table of contents
 * built from the <Section> elements rendered inside it.
 */
export function Page({ title, lead, children }: PageProps) {
  useDocumentTitle(`${title} · React Notes`)
  const contentRef = useRef<HTMLDivElement>(null)
  const [toc, setToc] = useState<TocItem[]>([])

  // Reading the DOM after render is a legitimate effect: sync with "the outside"
  useEffect(() => {
    const sections = contentRef.current?.querySelectorAll<HTMLElement>('[data-toc]') ?? []
    setToc([...sections].map((el) => ({ id: el.id, title: el.dataset.toc ?? '' })))
  }, [])

  return (
    <div className="flex gap-10">
      <article className="min-w-0 flex-1">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">{title}</h1>
          <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400">{lead}</p>
        </header>
        <div ref={contentRef} className="space-y-12">
          {children}
        </div>
      </article>

      {toc.length > 0 && (
        <nav aria-label="In questa pagina" className="sticky top-20 hidden max-h-[calc(100vh-6rem)] w-56 shrink-0 self-start overflow-auto xl:block">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">In questa pagina</p>
          <ul className="space-y-2 text-sm">
            {toc.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-zinc-600 hover:text-sky-600 dark:text-zinc-400 dark:hover:text-sky-400"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  )
}
