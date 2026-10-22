import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { createUser, findUserByUsername } from '@/shared/api/jsonplaceholder/users'
import { Button } from '@/shared/ui/Button'
import { Checkbox } from '@/shared/ui/Checkbox'
import { Input } from '@/shared/ui/Input'
import { Select } from '@/shared/ui/Select'
import { Textarea } from '@/shared/ui/Textarea'
import { signupSchema, type SignupValues } from './signupSchema'

const roleOptions = [
  { value: 'frontend', label: 'Frontend developer' },
  { value: 'backend', label: 'Backend developer' },
  { value: 'designer', label: 'Designer' },
  { value: 'other', label: 'Altro' },
]

export function SignupForm() {
  const [simulateServerError, setSimulateServerError] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(signupSchema),
    mode: 'onTouched', // validate a field when you leave it, then on every change
    defaultValues: {
      name: '',
      username: '',
      email: '',
      website: '',
      bio: '',
      password: '',
      confirmPassword: '',
      newsletter: true,
      terms: false,
    },
  })

  // The mutation (TanStack Query) does the request; the form only collects and validates
  const signup = useMutation({
    mutationFn: ({ name, username, email, website }: SignupValues) =>
      createUser({ name, username, email, website: website || undefined }),
  })

  // Subscribes to one field only: re-renders on bio changes, not on every field
  const bio = useWatch({ control, name: 'bio' })

  async function onSubmit(values: SignupValues) {
    if (simulateServerError) {
      // root.*: errors not tied to a field
      setError('root.server', { message: 'Errore del server (simulato), riprova tra poco' })
      return
    }
    // Server-side check: is the username taken? ("Bret" is, on JSONPlaceholder)
    if (await findUserByUsername(values.username)) {
      setError('username', { type: 'server', message: 'Username già in uso' }, { shouldFocus: true })
      return
    }
    await signup.mutateAsync(values)
    reset() // back to the default values
  }

  if (signup.isSuccess) {
    return (
      <div className="space-y-4">
        <p className="font-semibold text-emerald-700 dark:text-emerald-400">✓ Utente creato! Risposta del server:</p>
        <pre className="rounded-lg bg-zinc-100 p-3 font-mono text-xs dark:bg-zinc-900">
          {JSON.stringify(signup.data, null, 2)}
        </pre>
        <Button variant="secondary" onClick={() => signup.reset()}>
          Nuova registrazione
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-xl space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Nome e cognome *" autoComplete="name" {...register('name')} error={errors.name?.message} />
        <Input
          label="Username *"
          autoComplete="username"
          hint="Prova “Bret”: è già in uso"
          {...register('username')}
          error={errors.username?.message}
        />
      </div>
      <Input label="Email *" type="email" autoComplete="email" {...register('email')} error={errors.email?.message} />
      <Input label="Sito web" type="url" placeholder="https://" hint="Facoltativo" {...register('website')} error={errors.website?.message} />
      <Select label="Ruolo *" placeholder="Scegli…" options={roleOptions} {...register('role')} error={errors.role?.message} />
      <Textarea label="Bio" rows={3} hint={`${bio.length}/200`} {...register('bio')} error={errors.bio?.message} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Password *" type="password" autoComplete="new-password" {...register('password')} error={errors.password?.message} />
        <Input
          label="Conferma password *"
          type="password"
          autoComplete="new-password"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />
      </div>
      <div className="space-y-2">
        <Checkbox label="Ricevi la newsletter" {...register('newsletter')} />
        <Checkbox label="Accetto i termini di servizio *" {...register('terms')} error={errors.terms?.message} />
      </div>

      {(errors.root?.server || signup.error) && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {errors.root?.server?.message ?? signup.error?.message}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Invio in corso…' : 'Registrati'}
        </Button>
        <Button variant="ghost" onClick={() => reset()} disabled={!isDirty || isSubmitting}>
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
