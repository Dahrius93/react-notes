import { Link } from 'react-router'
import { BookmarksList } from '@/features/bookmarks/BookmarksList'
import { useDocumentTitle } from '@/shared/hooks/useDocumentTitle'
import { Badge } from '@/shared/ui/Badge'
import { navigation } from '../navigation'

export function HomePage() {
  useDocumentTitle('React Notes')

  return (
    <div className="max-w-5xl">
      <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">React Notes</h1>
      <div className="prose-notes mt-4 max-w-3xl text-lg">
        <p>
          Appunti su React 19 con spiegazioni ed esempi funzionanti. Ogni esempio è un componente vero del progetto: la
          demo che vedi è renderizzata dallo stesso file di cui leggi il codice.
        </p>
        <p>
          Il codice è pensato anche per essere <strong>riutilizzato</strong>: hook, componenti UI e client HTTP stanno in{' '}
          <code>src/shared/</code> e si possono copiare in altri progetti così come sono.
        </p>
      </div>

      <section className="mt-10 max-w-xl">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-zinc-500">I tuoi preferiti</h2>
        <BookmarksList />
      </section>

      {navigation.map((group) => (
        <section key={group.title} className="mt-12">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500">{group.title}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="group rounded-xl p-5 ring-1 ring-zinc-200 transition hover:ring-sky-500 dark:ring-zinc-800 dark:hover:ring-sky-500"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-zinc-900 group-hover:text-sky-600 dark:text-zinc-100 dark:group-hover:text-sky-400">
                    {item.title}
                  </h3>
                  {!item.load && <Badge>In arrivo</Badge>}
                </div>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{item.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
