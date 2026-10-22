import { startTransition, useOptimistic, useRef, useState } from 'react'
import { createComment } from '@/shared/api/jsonplaceholder/comments'
import { cn } from '@/shared/lib/cn'
import { sleep } from '@/shared/lib/sleep'
import { Button } from '@/shared/ui/Button'

type Message = { id: string; text: string; sending?: boolean }

export function MessageThread() {
  const formRef = useRef<HTMLFormElement>(null)
  const [messages, setMessages] = useState<Message[]>([{ id: 'welcome', text: 'Ciao! Scrivi un messaggio.' }])
  const [error, setError] = useState<string | null>(null)
  const [failNext, setFailNext] = useState(false)

  // optimisticMessages = messages + the optimistic additions of the running action.
  // When the action ends they disappear: what remains is the real `messages`.
  const [optimisticMessages, addOptimistic] = useOptimistic(messages, (current, newMessage: Message) => [
    ...current,
    newMessage,
  ])

  async function sendAction(formData: FormData) {
    const text = String(formData.get('text') ?? '').trim()
    if (!text) return
    setError(null)
    addOptimistic({ id: crypto.randomUUID(), text, sending: true }) // shown immediately
    formRef.current?.reset()

    try {
      await sleep(1200)
      if (failNext) throw new Error('Invio non riuscito (simulato): il messaggio è stato rimosso')
      const saved = await createComment({ postId: 1, name: 'Tu', email: 'tu@esempio.it', body: text })
      // Real state, wrapped in a transition because it comes after an await
      startTransition(() => setMessages((prev) => [...prev, { id: crypto.randomUUID(), text: saved.body }]))
    } catch (err) {
      startTransition(() => setError(err instanceof Error ? err.message : 'Errore'))
    }
  }

  return (
    <div className="max-w-md space-y-3">
      <ul className="space-y-2">
        {optimisticMessages.map((message) => (
          <li
            key={message.id}
            className={cn(
              'rounded-lg bg-sky-50 px-3 py-2 text-sm dark:bg-sky-950/40',
              message.sending && 'opacity-60',
            )}
          >
            {message.text}
            {message.sending && <span className="ml-2 text-xs text-zinc-500">invio…</span>}
          </li>
        ))}
      </ul>
      {error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      <form ref={formRef} action={sendAction} className="flex gap-2">
        <input
          name="text"
          aria-label="Messaggio"
          placeholder="Scrivi…"
          className="h-10 flex-1 rounded-lg bg-white px-3 text-sm ring-1 ring-zinc-300 dark:bg-zinc-900 dark:ring-zinc-700"
        />
        <Button type="submit">Invia</Button>
      </form>
      <label className="flex items-center gap-2 text-xs text-zinc-500">
        <input type="checkbox" checked={failNext} onChange={(e) => setFailNext(e.target.checked)} />
        Simula errore di invio
      </label>
    </div>
  )
}
