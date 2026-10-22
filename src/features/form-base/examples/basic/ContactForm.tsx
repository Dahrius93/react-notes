import { useState, type FormEvent } from 'react'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Textarea } from '@/shared/ui/Textarea'

export function ContactForm() {
  // 1. One state per field
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sentBy, setSentBy] = useState<string | null>(null)

  // Derived: no extra state needed
  const canSubmit = name.trim() !== '' && email.trim() !== ''

  // 3. Handle the submit
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault() // otherwise the browser reloads the page
    if (!canSubmit) return
    setSentBy(name)
    setName('')
    setEmail('')
    setMessage('')
  }

  if (sentBy) {
    return (
      <div className="space-y-3">
        <p>
          Grazie <strong>{sentBy}</strong>, messaggio inviato!
        </p>
        <Button variant="secondary" onClick={() => setSentBy(null)}>
          Scrivi un altro messaggio
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      {/* 2. value + onChange: the input always shows the state, every keystroke updates it */}
      <Input label="Nome *" value={name} onChange={(e) => setName(e.target.value)} />
      <Input label="Email *" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Textarea label="Messaggio" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />
      <Button type="submit" disabled={!canSubmit}>
        Invia
      </Button>
    </form>
  )
}
