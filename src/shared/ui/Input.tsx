import { useId, type ComponentProps } from 'react'
import { Field } from './Field'
import { controlClassName, describedBy } from './fieldAttributes'

export type InputProps = ComponentProps<'input'> & {
  label?: string
  error?: string
  hint?: string
}

/**
 * Text input with optional label, hint and error message.
 * In React 19 `ref` is a regular prop, so it is forwarded through `...props`.
 */
export function Input({ label, error, hint, id, className, ...props }: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <Field id={inputId} label={label} error={error} hint={hint}>
      <input
        id={inputId}
        {...describedBy(inputId, error, hint)}
        className={controlClassName(Boolean(error), `h-10 ${className ?? ''}`)}
        {...props}
      />
    </Field>
  )
}
