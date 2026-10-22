import { useState, type FormEvent } from 'react'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'

export function UncontrolledForm() {
  const [submitted, setSubmitted] = useState<Record<string, FormDataEntryValue> | null>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // The DOM holds the values: read them all at once when needed
    const formData = new FormData(event.currentTarget)
    setSubmitted(Object.fromEntries(formData))
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* defaultValue (not value): only the initial value, then the DOM is in charge */}
        <Input name="city" label="Città" defaultValue="Torino" />
        <Input name="zip" label="CAP" inputMode="numeric" />
        <Button type="submit">Invia</Button>
      </form>
      <pre className="rounded-lg bg-zinc-100 p-3 font-mono text-xs dark:bg-zinc-900">
        {submitted ? JSON.stringify(submitted, null, 2) : '// premi Invia'}
      </pre>
    </div>
  )
}
