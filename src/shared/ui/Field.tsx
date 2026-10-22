import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'
import { descriptionId } from './fieldAttributes'

type FieldProps = {
  id: string
  label?: string
  error?: string
  hint?: string
  children: ReactNode
}

/**
 * Label + control + hint or error message. The error replaces the hint.
 * The control itself must use `describedBy(id, error, hint)` from fieldAttributes.
 */
export function Field({ id, label, error, hint, children }: FieldProps) {
  const description = error ?? hint

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
          {label}
        </label>
      )}
      {children}
      {description && (
        <p
          id={descriptionId(id)}
          className={cn('text-xs', error ? 'text-red-600 dark:text-red-400' : 'text-zinc-500')}
        >
          {description}
        </p>
      )}
    </div>
  )
}
