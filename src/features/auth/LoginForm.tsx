import type { User } from '@/shared/api/jsonplaceholder/types'
import { useSimpleForm, type FormErrors } from '@/shared/hooks/useSimpleForm'
import { isBlank } from '@/shared/lib/validators'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { useAuth } from './authContext'

type LoginValues = { username: string; password: string }

function validate(values: LoginValues): FormErrors<LoginValues> {
  const errors: FormErrors<LoginValues> = {}
  if (isBlank(values.username)) errors.username = 'Inserisci lo username'
  if (isBlank(values.password)) errors.password = 'Inserisci la password'
  return errors
}

type LoginFormProps = {
  /** Called after a successful login, e.g. to redirect. */
  onSuccess?: (user: User) => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { login } = useAuth()
  const form = useSimpleForm({
    initialValues: { username: '', password: '' },
    validate,
    onSubmit: async ({ username, password }) => {
      const user = await login(username, password)
      onSuccess?.(user)
    },
  })

  return (
    <form onSubmit={form.handleSubmit} noValidate className="max-w-sm space-y-4">
      <Input
        label="Username"
        autoComplete="username"
        hint="Prova Bret, Antonette o Samantha"
        {...form.getFieldProps('username')}
        error={form.getError('username')}
      />
      <Input
        label="Password"
        type="password"
        autoComplete="current-password"
        hint="Una qualsiasi: è un login finto"
        {...form.getFieldProps('password')}
        error={form.getError('password')}
      />
      {form.submitError && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {form.submitError}
        </p>
      )}
      <Button type="submit" disabled={form.isSubmitting}>
        {form.isSubmitting ? 'Accesso…' : 'Accedi'}
      </Button>
    </form>
  )
}
