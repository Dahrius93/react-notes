import { useId, type ComponentProps, type ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'
import { describedBy, descriptionId } from './fieldAttributes'

export type CheckboxProps = Omit<ComponentProps<'input'>, 'type'> & {
  label: ReactNode
  error?: string
  hint?: string
}

/** Checkbox with the label on its right. */
export function Checkbox({ label, error, hint, id, className, ...props }: CheckboxProps) {
  const generatedId = useId()
  const checkboxId = id ?? generatedId
  const description = error ?? hint

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className="flex items-start gap-2">
        <input
          id={checkboxId}
          type="checkbox"
          {...describedBy(checkboxId, error, hint)}
          className="mt-0.5 size-4 shrink-0 accent-sky-600"
          {...props}
        />
        <label htmlFor={checkboxId} className="text-sm text-zinc-800 dark:text-zinc-200">
          {label}
        </label>
      </div>
      {description && (
        <p
          id={descriptionId(checkboxId)}
          className={cn('pl-6 text-xs', error ? 'text-red-600 dark:text-red-400' : 'text-zinc-500')}
        >
          {description}
        </p>
      )}
    </div>
  )
}
