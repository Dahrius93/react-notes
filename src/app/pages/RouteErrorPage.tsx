import { isRouteErrorResponse, Link, useRouteError } from 'react-router'

/** Rendered by the router when a route throws while rendering or loading. */
export function RouteErrorPage() {
  const error = useRouteError()

  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'Errore sconosciuto'

  return (
    <div className="mx-auto max-w-xl px-4 py-20">
      <p className="text-sm font-semibold text-red-600">Errore</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
        Qualcosa è andato storto
      </h1>
      <pre className="mt-4 overflow-auto rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-300">
        {message}
      </pre>
      <Link to="/" className="mt-6 inline-block font-medium text-sky-600 hover:text-sky-500">
        ← Torna alla home
      </Link>
    </div>
  )
}
