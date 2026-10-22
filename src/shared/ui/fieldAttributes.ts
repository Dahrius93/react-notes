import { cn } from '@/shared/lib/cn'

// Helpers shared by the form controls. Kept out of Field.tsx so that
// component files export only components (needed by Fast Refresh).

/** Base classes shared by text-like controls (input, select, textarea). */
export function controlClassName(hasError: boolean, className?: string) {
  return cn(
    'rounded-lg bg-white px-3 text-sm text-zinc-900 ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400',
    'focus:outline-none focus:ring-2 focus:ring-sky-500',
    'disabled:cursor-not-allowed disabled:opacity-60',
    'dark:bg-zinc-900 dark:text-zinc-100 dark:ring-zinc-700',
    hasError && 'ring-red-500 focus:ring-red-500 dark:ring-red-500',
    className,
  )
}

/** Id of the hint/error paragraph, to link it with aria-describedby. */
export function descriptionId(controlId: string) {
  return `${controlId}-description`
}

/** Accessibility attributes every control needs to expose its error/hint. */
export function describedBy(controlId: string, error?: string, hint?: string) {
  return {
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error || hint ? descriptionId(controlId) : undefined,
  } as const
}
