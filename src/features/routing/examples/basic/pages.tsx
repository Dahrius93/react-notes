// Plain components: they don't know anything about the router

export function HomePage() {
  return (
    <div>
      <h2 className="text-xl font-bold">Home</h2>
      <p className="text-sm text-zinc-500">Benvenuto! Prova i link qui sopra.</p>
    </div>
  )
}

export function AboutPage() {
  return (
    <div>
      <h2 className="text-xl font-bold">Chi siamo</h2>
      <p className="text-sm text-zinc-500">L'URL è cambiato in /about, ma la pagina non si è ricaricata.</p>
    </div>
  )
}

export function NotFoundPage() {
  return (
    <div>
      <h2 className="text-xl font-bold">404</h2>
      <p className="text-sm text-zinc-500">Nessuna route corrisponde a questo indirizzo.</p>
    </div>
  )
}
