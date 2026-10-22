import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

const variants = {
  note: {
    label: 'Nota',
    icon: 'ℹ',
    className: 'border-sky-500 bg-sky-50 dark:bg-sky-950/40',
  },
  tip: {
    label: 'Suggerimento',
    icon: '💡',
    className: 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40',
  },
  warning: {
    label: 'Attenzione',
    icon: '⚠',
    className: 'border-amber-500 bg-amber-50 dark:bg-amber-950/40',
  },
  danger: {
    label: 'Errore comune',
    icon: '✗',
    className: 'border-red-500 bg-red-50 dark:bg-red-950/40',
  },
}

type CalloutProps = {
  variant?: keyof typeof variants
  title?: string
  children: ReactNode
}

export function Callout({ variant = 'note', title, children }: CalloutProps) {
  const { label, icon, className } = variants[variant]

  return (
    <aside className={cn('rounded-r-lg border-l-4 px-4 py-3', className)}>
      <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        <span aria-hidden>{icon}</span>
        {title ?? label}
      </p>
      <div className="prose-notes text-sm">{children}</div>
    </aside>
  )
}
