import { z } from 'zod'
import { createPost } from '@/shared/api/jsonplaceholder/posts'
import { sleep } from '@/shared/lib/sleep'

export type SubscribeState =
  | { status: 'idle' }
  | { status: 'error'; message: string; email: string }
  | { status: 'success'; message: string }

const emailSchema = z.email({ error: 'Inserisci un’email valida' })

/**
 * An action for useActionState: receives the PREVIOUS state and the form data,
 * returns the next state. It can be async: React tracks the pending phase.
 */
export async function subscribeAction(_previous: SubscribeState, formData: FormData): Promise<SubscribeState> {
  const email = String(formData.get('email') ?? '').trim()

  const parsed = emailSchema.safeParse(email)
  if (!parsed.success) return { status: 'error', message: parsed.error.issues[0].message, email }

  await sleep(1000) // slow server
  if (email.endsWith('@example.com')) {
    return { status: 'error', message: 'Il dominio example.com non è accettato (simulato)', email }
  }

  await createPost({ userId: 1, title: 'newsletter', body: email })
  return { status: 'success', message: `Iscrizione confermata per ${email}` }
}
