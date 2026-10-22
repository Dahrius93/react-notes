import { useActionState } from 'react'
import { Input } from '@/shared/ui/Input'
import { subscribeAction, type SubscribeState } from './subscribeAction'
import { SubmitButton } from './SubmitButton'

const initialState: SubscribeState = { status: 'idle' }

export function NewsletterForm() {
  // [current state, action to pass to the form, is it running?]
  const [state, formAction, isPending] = useActionState(subscribeAction, initialState)

  if (state.status === 'success') {
    return <p className="font-medium text-emerald-700 dark:text-emerald-400">✓ {state.message}</p>
  }

  return (
    // action={...}: React calls it with the FormData, no onSubmit/preventDefault/useState per field.
    // After the action the form is reset: defaultValue puts back what the user typed on error.
    <form action={formAction} noValidate className="flex max-w-md items-start gap-2">
      <div className="flex-1">
        <Input
          name="email"
          type="email"
          aria-label="Email"
          placeholder="nome@dominio.it"
          defaultValue={state.status === 'error' ? state.email : ''}
          error={state.status === 'error' ? state.message : undefined}
          disabled={isPending}
        />
      </div>
      <SubmitButton pendingText="Iscrizione…">Iscriviti</SubmitButton>
    </form>
  )
}
