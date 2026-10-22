import { useState } from 'react'
import { HttpError } from '@/shared/api/http'
import { createUser } from '@/shared/api/jsonplaceholder/users'
import { useSimpleForm } from '@/shared/hooks/useSimpleForm'
import { sleep } from '@/shared/lib/sleep'
import { Button } from '@/shared/ui/Button'
import { Checkbox } from '@/shared/ui/Checkbox'
import { Input } from '@/shared/ui/Input'
import { Select } from '@/shared/ui/Select'
import { Textarea } from '@/shared/ui/Textarea'
import { BIO_MAX_LENGTH, initialSignupValues, validateSignup } from './signupValidation'

const roles = [
  { value: 'frontend', label: 'Frontend developer' },
  { value: 'backend', label: 'Backend developer' },
  { value: 'designer', label: 'Designer' },
  { value: 'other', label: 'Altro' },
]

type CreatedUser = Awaited<ReturnType<typeof createUser>>

export function SignupForm() {
  const [created, setCreated] = useState<CreatedUser | null>(null)
  const [simulateServerError, setSimulateServerError] = useState(false)

  const form = useSimpleForm({
    initialValues: initialSignupValues,
    validate: validateSignup,
    onSubmit: async ({ name, username, email, website }) => {
      await sleep(800) // make the loading state visible
      if (simulateServerError) throw new HttpError(500, 'Errore del server (simulato), riprova')
      if (username === 'admin') throw new Error('Lo username "admin" è già in uso')

      const user = await createUser({ name, username, email, website: website || undefined })
      setCreated(user)
      form.reset()
    },
  })

  if (created) {
    return (
      <div className="space-y-4">
        <p className="font-semibold text-emerald-700 dark:text-emerald-400">✓ Utente creato! Risposta del server:</p>
        <pre className="rounded-lg bg-zinc-100 p-3 font-mono text-xs dark:bg-zinc-900">
          {JSON.stringify(created, null, 2)}
        </pre>
        <Button variant="secondary" onClick={() => setCreated(null)}>
          Nuova registrazione
        </Button>
      </div>
    )
  }

  return (
    // noValidate: we show our own messages instead of the browser bubbles
    <form onSubmit={form.handleSubmit} noValidate className="max-w-xl space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Nome e cognome *" autoComplete="name" {...form.getFieldProps('name')} error={form.getError('name')} />
        <Input
          label="Username *"
          autoComplete="username"
          {...form.getFieldProps('username')}
          error={form.getError('username')}
          hint="Prova “admin” per un errore dal server"
        />
      </div>
      <Input label="Email *" type="email" autoComplete="email" {...form.getFieldProps('email')} error={form.getError('email')} />
      <Input
        label="Sito web"
        type="url"
        placeholder="https://"
        {...form.getFieldProps('website')}
        error={form.getError('website')}
        hint="Facoltativo"
      />
      <Select
        label="Ruolo *"
        placeholder="Scegli…"
        options={roles}
        {...form.getFieldProps('role')}
        error={form.getError('role')}
      />
      <Textarea
        label="Bio"
        rows={3}
        {...form.getFieldProps('bio')}
        error={form.getError('bio')}
        hint={`${form.values.bio.length}/${BIO_MAX_LENGTH}`}
      />
      <div className="space-y-2">
        <Checkbox label="Ricevi la newsletter" {...form.getCheckboxProps('newsletter')} />
        <Checkbox label="Accetto i termini di servizio *" {...form.getCheckboxProps('terms')} error={form.getError('terms')} />
      </div>

      {form.submitError && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {form.submitError}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={form.isSubmitting}>
          {form.isSubmitting ? 'Invio in corso…' : 'Registrati'}
        </Button>
        <Button variant="ghost" onClick={() => form.reset()} disabled={!form.isDirty || form.isSubmitting}>
          Annulla modifiche
        </Button>
        <label className="ml-auto flex items-center gap-2 text-xs text-zinc-500">
          <input type="checkbox" checked={simulateServerError} onChange={(e) => setSimulateServerError(e.target.checked)} />
          Simula errore 500
        </label>
      </div>
    </form>
  )
}
