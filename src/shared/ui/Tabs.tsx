import { createContext, use, useId, useState, type KeyboardEvent, type ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

/**
 * Compound component: <Tabs.Root> owns the state, the parts share it through a private context.
 * Import the whole module as a namespace (like Radix UI):
 *
 * @example
 * import * as Tabs from '@/shared/ui/Tabs'
 *
 * <Tabs.Root defaultValue="info">
 *   <Tabs.List label="Prodotto">
 *     <Tabs.Trigger value="info">Info</Tabs.Trigger>
 *     <Tabs.Trigger value="reviews">Recensioni</Tabs.Trigger>
 *   </Tabs.List>
 *   <Tabs.Panel value="info">...</Tabs.Panel>
 *   <Tabs.Panel value="reviews">...</Tabs.Panel>
 * </Tabs.Root>
 */

type TabsContextValue = {
  value: string
  select: (value: string) => void
  baseId: string
}

// Private: only the Tabs parts can read it
const TabsContext = createContext<TabsContextValue | null>(null)

function useTabsContext() {
  const context = use(TabsContext)
  if (!context) throw new Error('Tabs.List, Tabs.Trigger and Tabs.Panel must be used inside <Tabs.Root>')
  return context
}

type TabsProps = {
  /** Uncontrolled: initial tab */
  defaultValue?: string
  /** Controlled: current tab (use together with onValueChange) */
  value?: string
  onValueChange?: (value: string) => void
  children: ReactNode
  className?: string
}

export function Root({ defaultValue = '', value, onValueChange, children, className }: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const baseId = useId()
  const current = value ?? internalValue // controlled wins over uncontrolled

  function select(next: string) {
    if (value === undefined) setInternalValue(next)
    onValueChange?.(next)
  }

  return (
    <TabsContext value={{ value: current, select, baseId }}>
      <div className={className}>{children}</div>
    </TabsContext>
  )
}

export function List({ children, label }: { children: ReactNode; label: string }) {
  // Arrow keys move between tabs (WAI-ARIA tabs pattern)
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
    const tabs = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]')]
    const index = tabs.indexOf(document.activeElement as HTMLButtonElement)
    const next = tabs[(index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length]
    next.focus()
    next.click()
  }

  return (
    <div
      role="tablist"
      aria-label={label}
      onKeyDown={handleKeyDown}
      className="flex gap-1 border-b border-zinc-200 dark:border-zinc-800"
    >
      {children}
    </div>
  )
}

export function Trigger({ value, children }: { value: string; children: ReactNode }) {
  const tabs = useTabsContext()
  const isSelected = tabs.value === value

  return (
    <button
      type="button"
      role="tab"
      id={`${tabs.baseId}-tab-${value}`}
      aria-controls={`${tabs.baseId}-panel-${value}`}
      aria-selected={isSelected}
      tabIndex={isSelected ? 0 : -1} // only the active tab is in the Tab order
      onClick={() => tabs.select(value)}
      className={cn(
        '-mb-px border-b-2 px-3 py-2 text-sm font-medium',
        isSelected
          ? 'border-sky-600 text-sky-700 dark:text-sky-400'
          : 'border-transparent text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100',
      )}
    >
      {children}
    </button>
  )
}

export function Panel({ value, children }: { value: string; children: ReactNode }) {
  const tabs = useTabsContext()
  if (tabs.value !== value) return null

  return (
    <div
      role="tabpanel"
      id={`${tabs.baseId}-panel-${value}`}
      aria-labelledby={`${tabs.baseId}-tab-${value}`}
      tabIndex={0}
      className="pt-4"
    >
      {children}
    </div>
  )
}
