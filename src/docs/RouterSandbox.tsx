import {
  Fragment,
  StrictMode,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ComponentType,
  type FormEvent,
  type ReactNode,
} from 'react'
import { createRoot } from 'react-dom/client'
import { createMemoryRouter, type RouteObject } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { cn } from '@/shared/lib/cn'

type MemoryRouter = ReturnType<typeof createMemoryRouter>

type RouterSandboxProps = {
  /** Data-mode routes. Alternative to `children`. */
  routes?: RouteObject[]
  /** Declarative-mode app (with its own <Routes>): mounted on a catch-all route. */
  children?: ReactNode
  initialPath?: string
  /** Providers around the router, e.g. an AuthProvider. */
  wrapper?: ComponentType<{ children: ReactNode }>
}

/**
 * Docs tool: runs a router demo in an isolated React root with a memory router
 * and a fake address bar. React Router forbids a router inside another router,
 * and the notes app already runs inside one: a separate root avoids the conflict.
 * In a real app you would use createBrowserRouter / <BrowserRouter> instead.
 */
export function RouterSandbox({ routes, children, initialPath = '/', wrapper = Fragment }: RouterSandboxProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  // Props are read once: each demo is static
  const config = useRef({ routes, children, initialPath, wrapper })

  useEffect(() => {
    const { routes, children, initialPath, wrapper: Wrapper } = config.current
    const container = document.createElement('div')
    hostRef.current?.appendChild(container)

    const router = createMemoryRouter(routes ?? [{ path: '*', element: children }], {
      initialEntries: [initialPath],
    })
    const root = createRoot(container)
    root.render(
      <StrictMode>
        <Wrapper>
          <AddressBar router={router} />
          <div className="p-4">
            <RouterProvider router={router} />
          </div>
        </Wrapper>
      </StrictMode>,
    )

    return () => {
      // Unmounting another root during this root's commit is not allowed: defer it
      setTimeout(() => {
        root.unmount()
        router.dispose()
        container.remove()
      })
    }
  }, [])

  return <div ref={hostRef} className="overflow-hidden rounded-lg ring-1 ring-zinc-300 dark:ring-zinc-700" />
}

function AddressBar({ router }: { router: MemoryRouter }) {
  const state = useSyncExternalStore(
    (onChange) => router.subscribe(onChange),
    () => router.state,
  )
  const { pathname, search, hash } = state.location
  const url = `${pathname}${search}${hash}`
  const [draft, setDraft] = useState<string | null>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (draft !== null) void router.navigate(draft.startsWith('/') ? draft : `/${draft}`)
    setDraft(null)
  }

  const buttonClass =
    'grid size-7 place-items-center rounded text-zinc-600 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-800'

  return (
    <div className="flex items-center gap-1 border-b border-zinc-300 bg-zinc-100 px-2 py-1.5 dark:border-zinc-700 dark:bg-zinc-900">
      <button type="button" aria-label="Indietro" className={buttonClass} onClick={() => void router.navigate(-1)}>
        ←
      </button>
      <button type="button" aria-label="Avanti" className={buttonClass} onClick={() => void router.navigate(1)}>
        →
      </button>
      <form onSubmit={handleSubmit} className="flex-1">
        <input
          aria-label="Indirizzo"
          value={draft ?? url}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => setDraft(null)}
          className="h-7 w-full rounded-md bg-white px-3 font-mono text-xs text-zinc-700 ring-1 ring-zinc-300 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-zinc-950 dark:text-zinc-300 dark:ring-zinc-700"
        />
      </form>
      <span
        title="useNavigation().state"
        className={cn(
          'w-20 text-center font-mono text-[10px]',
          state.navigation.state === 'idle' ? 'text-zinc-400' : 'text-amber-600 dark:text-amber-400',
        )}
      >
        {state.navigation.state}
      </span>
    </div>
  )
}
