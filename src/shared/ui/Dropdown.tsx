import { useRef, type ReactNode } from 'react'
import { useEventListener } from '@/shared/hooks/useEventListener'
import { useOnClickOutside } from '@/shared/hooks/useOnClickOutside'
import { useToggle } from '@/shared/hooks/useToggle'
import { cn } from '@/shared/lib/cn'
import { Button, type ButtonProps } from './Button'

export type DropdownItem = {
  label: string
  onSelect: () => void
  danger?: boolean
}

type DropdownProps = {
  label: ReactNode
  items: DropdownItem[]
  align?: 'left' | 'right'
  variant?: ButtonProps['variant']
}

/** Menu button that closes on outside click, on Escape and after a selection. */
export function Dropdown({ label, items, align = 'left', variant = 'secondary' }: DropdownProps) {
  const [isOpen, { toggle, setOff }] = useToggle()
  const containerRef = useRef<HTMLDivElement>(null)

  useOnClickOutside(containerRef, setOff)
  useEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOff()
  })

  return (
    <div ref={containerRef} className="relative inline-block">
      <Button variant={variant} onClick={toggle} aria-haspopup="menu" aria-expanded={isOpen}>
        {label} <span aria-hidden>▾</span>
      </Button>

      {isOpen && (
        <ul
          role="menu"
          className={cn(
            'absolute z-20 mt-2 min-w-48 rounded-lg bg-white p-1 shadow-lg ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800',
            align === 'right' ? 'right-0' : 'left-0',
          )}
        >
          {items.map((item) => (
            <li key={item.label} role="none">
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  item.onSelect()
                  setOff()
                }}
                className={cn(
                  'w-full rounded-md px-3 py-2 text-left text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800',
                  item.danger && 'text-red-600 dark:text-red-400',
                )}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
