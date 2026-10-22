import { useState, type ChangeEvent, type FocusEvent, type FormEvent } from 'react'

type FieldValue = string | boolean
type FormValues = Record<string, FieldValue>
type ControlElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

export type FormErrors<T> = Partial<Record<keyof T, string>>

type Options<T extends FormValues> = {
  initialValues: T
  /** Pure function: values in, errors out. An empty object means valid. */
  validate?: (values: T) => FormErrors<T>
  /** Called only with valid values. Throw to show `submitError`. */
  onSubmit: (values: T) => Promise<void> | void
}

/**
 * Minimal form state built only on useState: values, touched fields,
 * derived validation, async submit. Good for small forms; for bigger ones
 * use React Hook Form + Zod.
 *
 * Values are strings (text, select, radio, textarea) or booleans (checkbox).
 *
 * @example
 * const form = useSimpleForm({ initialValues: { email: '' }, validate, onSubmit })
 * <form onSubmit={form.handleSubmit} noValidate>
 *   <Input {...form.getFieldProps('email')} error={form.getError('email')} />
 */
export function useSimpleForm<T extends FormValues>({ initialValues, validate, onSubmit }: Options<T>) {
  const [values, setValues] = useState(initialValues)
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Derived on every render: errors can never be out of sync with values
  const errors: FormErrors<T> = validate ? validate(values) : {}
  const isValid = Object.keys(errors).length === 0
  const isDirty = Object.keys(initialValues).some((key) => !Object.is(values[key], initialValues[key]))

  function setValue<K extends keyof T>(name: K, value: T[K]) {
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  function handleChange(event: ChangeEvent<ControlElement>) {
    const { name, value } = event.target
    const isCheckbox = event.target instanceof HTMLInputElement && event.target.type === 'checkbox'
    setValue(name as keyof T, (isCheckbox ? (event.target as HTMLInputElement).checked : value) as T[keyof T])
  }

  function handleBlur(event: FocusEvent<ControlElement>) {
    const name = event.target.name as keyof T
    setTouched((prev) => (prev[name] ? prev : { ...prev, [name]: true }))
  }

  /** Error to display: only after the field was left or the form was submitted. */
  function getError(name: keyof T): string | undefined {
    return touched[name] || isSubmitted ? errors[name] : undefined
  }

  /** Props for text inputs, selects and textareas. */
  function getFieldProps(name: keyof T & string) {
    return { name, value: String(values[name]), onChange: handleChange, onBlur: handleBlur }
  }

  /** Props for checkboxes. */
  function getCheckboxProps(name: keyof T & string) {
    return { name, checked: Boolean(values[name]), onChange: handleChange, onBlur: handleBlur }
  }

  /** Props for one radio button of a group. */
  function getRadioProps(name: keyof T & string, value: string) {
    return { name, value, checked: values[name] === value, onChange: handleChange, onBlur: handleBlur }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting) return // no double submit
    setIsSubmitted(true)

    if (!isValid) {
      focusFirstInvalid(event.currentTarget, Object.keys(errors))
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)
    try {
      await onSubmit(values)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Invio non riuscito')
    } finally {
      setIsSubmitting(false)
    }
  }

  function reset(nextValues: T = initialValues) {
    setValues(nextValues)
    setTouched({})
    setIsSubmitted(false)
    setSubmitError(null)
  }

  return {
    values,
    errors,
    touched,
    isValid,
    isDirty,
    isSubmitted,
    isSubmitting,
    submitError,
    setValue,
    handleChange,
    handleBlur,
    handleSubmit,
    getError,
    getFieldProps,
    getCheckboxProps,
    getRadioProps,
    reset,
  }
}

/** Moves focus to the first field (in DOM order) that has an error. */
function focusFirstInvalid(form: HTMLFormElement, invalidNames: string[]) {
  const field = Array.from(form.elements).find(
    (el): el is HTMLElement => el instanceof HTMLElement && invalidNames.includes(el.getAttribute('name') ?? ''),
  )
  field?.focus()
}
