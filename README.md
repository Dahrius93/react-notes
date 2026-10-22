# React Notes

Appunti su React 19 con spiegazioni ed esempi funzionanti. Ogni demo è renderizzata dallo stesso file di cui la pagina mostra il codice (import con `?raw`).

## Comandi

```bash
npm run dev       # server di sviluppo
npm run build     # type-check + build di produzione
npm run lint      # oxlint
npm test          # vitest in watch mode
npm run test:run  # vitest, una sola esecuzione
npm run coverage  # vitest con report di copertura (coverage/index.html)
```

## Struttura

```
src/
  app/                 # shell dell'applicazione
    navigation.ts      # elenco delle sezioni: sidebar, home e route nascono da qui
    router.tsx         # route (React Router)
    providers.tsx      # provider globali (auth, ...), montati in main.tsx
    layout/            # RootLayout + Sidebar
    pages/             # home, 404, errore, "in arrivo"
  docs/                # componenti per scrivere le note: Page, Section, Step, Example, CodeBlock, Callout, Table,
                       # RenderTracker (render visibili), RouterSandbox (demo di routing isolate),
                       # blockFor (simula componenti lenti nelle demo)
  features/auth/       # autenticazione finta su JSONPlaceholder: AuthProvider, useAuth, LoginForm, UserMenu,
                       # RequireAuth (route protette), LoginPage (/login), AccountPage (/account)
  features/<sezione>/  # una cartella per pagina
    <Nome>Page.tsx     # la pagina (export default, caricata in lazy)
    examples/          # un componente per esempio, mostrato come demo e come codice
  shared/              # codice riutilizzabile, copiabile in altri progetti
    api/               # client HTTP (request, HttpError), servizi JSONPlaceholder (users, posts, todos),
                       # queryClient e queryOptions di TanStack Query (jsonplaceholder/queries.ts)
    hooks/             # custom hook generici
    lib/               # funzioni pure (cn, sleep, slugify, validators, assertNever, createStrictContext)
    ui/                # componenti UI (Button, Input, Select, Textarea, Checkbox, Card, Badge, Spinner,
                       # Dropdown, StarRating, ErrorBoundary, Modal, Tabs (import * as Tabs), List<T>)
  test/                # setup.ts (Vitest + Testing Library), renderWithProviders, mockFetch,
                       # architecture.test.ts (regole sulle dipendenze tra cartelle)
```

## Aggiungere una sezione

1. Crea `src/features/<sezione>/<Nome>Page.tsx` con `export default` e gli esempi in `examples/`.
   La pagina si apre sempre con **"Primo esempio, passo per passo"**: l'uso più semplice, diviso in file come in un
   progetto vero (`examples/basic/`), un componente `<Step>` per file e una demo finale. Solo dopo vengono gli esempi
   avanzati.
2. In `src/app/navigation.ts` aggiungi `load: () => import('@/features/<sezione>/<Nome>Page')` alla voce corrispondente:
   il router ne fa una route `lazy` (il codice della pagina si scarica solo quando la visiti).
3. Il test `src/app/__tests__/routes.smoke.test.tsx` controlla in automatico che la nuova pagina si renderizzi.

## Stack

React 19 · TypeScript · Vite · Tailwind CSS 4 · React Router · TanStack Query · React Hook Form · Zod · Vitest · Testing Library. Dati di esempio da [JSONPlaceholder](https://jsonplaceholder.typicode.com).
