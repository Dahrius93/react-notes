import { useId, type ComponentProps } from 'react'
import { Field } from './Field'
import { controlClassName, describedBy } from './fieldAttributes'

export type TextareaProps = ComponentProps<'textarea'> & {
  label?: string
  error?: string
  hint?: string
}

export function Textarea({ label, error, hint, id, className, rows = 4, ...props }: TextareaProps) {
  const generatedId = useId()
  const textareaId = id ?? generatedId

  return (
    <Field id={textareaId} label={label} error={error} hint={hint}>
      <textarea
        id={textareaId}
        rows={rows}
        {...describedBy(textareaId, error, hint)}
        className={controlClassName(Boolean(error), `py-2 ${className ?? ''}`)}
        {...props}
      />
    </Field>
  )
}
