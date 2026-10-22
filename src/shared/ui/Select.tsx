import { useId, type ComponentProps } from 'react'
import { Field } from './Field'
import { controlClassName, describedBy } from './fieldAttributes'

export type SelectOption = { value: string; label: string }

export type SelectProps = ComponentProps<'select'> & {
  label?: string
  error?: string
  hint?: string
  options: SelectOption[]
  /** Optional empty first option, e.g. "Choose…" */
  placeholder?: string
}

export function Select({ label, error, hint, options, placeholder, id, className, ...props }: SelectProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId

  return (
    <Field id={selectId} label={label} error={error} hint={hint}>
      <select
        id={selectId}
        {...describedBy(selectId, error, hint)}
        className={controlClassName(Boolean(error), `h-10 ${className ?? ''}`)}
        {...props}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  )
}
