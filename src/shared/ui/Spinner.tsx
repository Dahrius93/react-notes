import { cn } from '@/shared/lib/cn'

export function Spinner({ className, label = 'Caricamento…' }: { className?: string; label?: string }) {
  return (
    <span role="status" className={cn('inline-flex items-center gap-2 text-sm text-zinc-500', className)}>
      <span className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
      {label}
    </span>
  )
}
