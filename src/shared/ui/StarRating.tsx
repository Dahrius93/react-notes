import { useId, type Ref } from 'react'
import { cn } from '@/shared/lib/cn'
import { descriptionId } from './fieldAttributes'

type StarRatingProps = {
  value: number
  onChange: (value: number) => void
  onBlur?: () => void
  label?: string
  error?: string
  max?: number
  /** Forwarded to the first star: form libraries use it to focus the field on error. */
  ref?: Ref<HTMLButtonElement>
}

/**
 * Controlled star rating (value + onChange), not a native input:
 * with React Hook Form it is connected through <Controller>.
 */
export function StarRating({ value, onChange, onBlur, label, error, max = 5, ref }: StarRatingProps) {
  const id = useId()
  const labelId = `${id}-label`

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <span id={labelId} className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
          {label}
        </span>
      )}
      <div
        role="radiogroup"
        aria-labelledby={label ? labelId : undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? descriptionId(id) : undefined}
        onBlur={onBlur}
        className="flex gap-1"
      >
        {Array.from({ length: max }, (_, index) => {
          const star = index + 1
          return (
            <button
              key={star}
              ref={index === 0 ? ref : undefined}
              type="button"
              role="radio"
              aria-checked={value === star}
              aria-label={`${star} ${star === 1 ? 'stella' : 'stelle'}`}
              onClick={() => onChange(star)}
              className={cn(
                'text-2xl leading-none transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-sky-500',
                star <= value ? 'text-amber-400' : 'text-zinc-300 dark:text-zinc-600',
              )}
            >
              ★
            </button>
          )
        })}
      </div>
      {error && (
        <p id={descriptionId(id)} className="text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}
