import { Suspense, useEffect } from 'react'
import { Link, Outlet, ScrollRestoration, useLocation, useMatches, useNavigation } from 'react-router'
import { UserMenu } from '@/features/auth/UserMenu'
import { BookmarkButton } from '@/features/bookmarks/BookmarkButton'
import { useDarkMode, type Theme } from '@/shared/hooks/useDarkMode'
import { useEventListener } from '@/shared/hooks/useEventListener'
import { useToggle } from '@/shared/hooks/useToggle'
import { cn } from '@/shared/lib/cn'
import { Spinner } from '@/shared/ui/Spinner'
import { navItems } from '../navigation'
import { Sidebar } from './Sidebar'

const nextTheme: Record<Theme, Theme> = { system: 'light', light: 'dark', dark: 'system' }
const themeLabel: Record<Theme, string> = { system: '🖥 Sistema', light: '☀ Chiaro', dark: '☾ Scuro' }

/**
 * Document title from the deepest matched route with `handle: { title }`.
 * Note pages set their own title with <Page>, so routes without a handle are left alone.
 */
function useRouteTitle() {
  const matches = useMatches()
  const title = matches
    .map((match) => (match.handle as { title?: string } | undefined)?.title)
    .findLast(Boolean)

  useEffect(() => {
    if (!title) return
    const previous = document.title
    document.title = `${title} · React Notes`
    return () => {
      document.title = previous
    }
  }, [title])
}

export function RootLayout() {
  const { theme, setTheme } = useDarkMode()
  const [isMenuOpen, menu] = useToggle()
  // 'loading' while the router fetches the code of a lazy page
  const isNavigating = useNavigation().state !== 'idle'
  useRouteTitle()
  // The note page currently open (if any), to bookmark it from the header
  const { pathname } = useLocation()
  const currentNote = navItems.find((item) => item.load && pathname === `/${item.path}`)

  useEventListener('keydown', (event) => {
    if (event.key === 'Escape') menu.setOff()
  })

  return (
    <div className="min-h-screen">
      {isNavigating && (
        <div role="progressbar" aria-label="Caricamento pagina" className="fixed inset-x-0 top-0 z-50 h-0.5 overflow-hidden">
          <div className="h-full w-1/3 animate-[progress_1s_ease-in-out_infinite] bg-sky-500" />
        </div>
      )}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-zinc-200 bg-white/80 px-4 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
        <button
          type="button"
          onClick={menu.toggle}
          aria-label="Apri menu"
          aria-expanded={isMenuOpen}
          className="rounded-md p-2 text-zinc-600 hover:bg-zinc-100 lg:hidden dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          ☰
        </button>
        <Link to="/" className="flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-50">
          <span className="text-sky-500">⚛</span> React Notes
        </Link>
        <div className="ml-auto flex items-center gap-2">
          {currentNote && <BookmarkButton path={pathname} title={currentNote.title} />}
          <button
            type="button"
            onClick={() => setTheme(nextTheme[theme])}
            title="Cambia tema"
            className="rounded-md px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            {themeLabel[theme]}
          </button>
          <UserMenu />
        </div>
      </header>

      <div className="mx-auto flex max-w-360">
        {/* Mobile: drawer over the content. Desktop: fixed column. */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-40 bg-zinc-950/50 lg:hidden" onClick={menu.setOff} aria-hidden />
        )}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto border-r border-zinc-200 bg-white px-4 py-6 transition-transform dark:border-zinc-800 dark:bg-zinc-950',
            'lg:sticky lg:top-14 lg:z-0 lg:h-[calc(100vh-3.5rem)] lg:translate-x-0',
            isMenuOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <Sidebar onNavigate={menu.setOff} />
        </aside>

        <main className="min-w-0 flex-1 px-4 py-10 sm:px-8 lg:px-12">
          <Suspense fallback={<Spinner className="mt-10" />}>
            <Outlet />
          </Suspense>
        </main>
      </div>

      <ScrollRestoration />
    </div>
  )
}
