import { Link, useLocation } from 'react-router'
import { useDocumentTitle } from '@/shared/hooks/useDocumentTitle'

export function NotFoundPage() {
  useDocumentTitle('Pagina non trovata · React Notes')
  const { pathname } = useLocation()

  return (
    <div className="max-w-xl">
      <p className="text-sm font-semibold text-sky-600">404</p>
      <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">Pagina non trovata</h1>
      <p className="mt-3 text-zinc-600 dark:text-zinc-400">
        Nessuna pagina corrisponde a <code className="font-mono">{pathname}</code>.
      </p>
      <Link to="/" className="mt-6 inline-block font-medium text-sky-600 hover:text-sky-500">
        ← Torna alla home
      </Link>
    </div>
  )
}
