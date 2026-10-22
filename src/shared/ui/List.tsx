import type { Key, ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

type ListProps<T> = {
  items: readonly T[]
  /** Stable key for each item, usually its id */
  getKey: (item: T) => Key
  /** How to draw one item: it receives the item with its real type */
  renderItem: (item: T, index: number) => ReactNode
  /** Shown when `items` is empty */
  empty?: ReactNode
  className?: string
}

/**
 * Generic list: T is inferred from `items`, so `renderItem` and `getKey`
 * get a fully typed item, without casts.
 *
 * @example
 * <List items={users} getKey={(u) => u.id} renderItem={(u) => u.name} />
 */
export function List<T>({ items, getKey, renderItem, empty = 'Nessun elemento', className }: ListProps<T>) {
  if (items.length === 0) {
    return <p className="text-sm text-zinc-500">{empty}</p>
  }

  return (
    <ul className={cn('divide-y divide-zinc-200 dark:divide-zinc-800', className)}>
      {items.map((item, index) => (
        <li key={getKey(item)} className="py-2">
          {renderItem(item, index)}
        </li>
      ))}
    </ul>
  )
}
