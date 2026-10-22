import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { sleep } from '@/shared/lib/sleep'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { signInSchema, type SignInValues } from './signInSchema'

export function SignInForm() {
  const [signedIn, setSignedIn] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signInSchema), // validation = the Zod schema
    defaultValues: { email: '', password: '' },
  })

  // Called only with VALID and typed data
  async function onSubmit(values: SignInValues) {
    await sleep(600) // pretend to call an API
    setSignedIn(values.email)
  }

  if (signedIn) return <p>Accesso eseguito come <strong>{signedIn}</strong>.</p>

  return (
    // handleSubmit: preventDefault + validation + onSubmit if everything is valid
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-sm space-y-4">
      {/* register('email') returns { name, onChange, onBlur, ref } */}
      <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
      <Input label="Password" type="password" {...register('password')} error={errors.password?.message} />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Accesso…' : 'Accedi'}
      </Button>
    </form>
  )
}
