import { useState, type FormEvent } from 'react'
import { isBlank, isEmail } from '@/shared/lib/validators'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'

type Mode = 'change' | 'blur' | 'submit'

const modes: { value: Mode; label: string }[] = [
  { value: 'change', label: 'Mentre scrivi' },
  { value: 'blur', label: 'Quando lasci il campo' },
  { value: 'submit', label: 'All’invio' },
]

function validateEmail(email: string): string | undefined {
  if (isBlank(email)) return 'L’email è obbligatoria'
  if (!isEmail(email)) return 'Formato email non valido'
  return undefined
}

export function ValidationTiming() {
  const [mode, setMode] = useState<Mode>('blur')
  const [email, setEmail] = useState('')
  const [isTouched, setIsTouched] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // The error always exists (derived)...
  const error = validateEmail(email)
  // ...the mode only decides WHEN to show it
  const isVisible =
    isSubmitted || (mode === 'change' && email !== '') || (mode === 'blur' && isTouched)

  function changeMode(next: Mode) {
    setMode(next)
    setEmail('')
    setIsTouched(false)
    setIsSubmitted(false)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitted(true)
    if (!error) alert(`Inviato: ${email}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {modes.map((m) => (
          <Button key={m.value} size="sm" variant={mode === m.value ? 'primary' : 'secondary'} onClick={() => changeMode(m.value)}>
            {m.label}
          </Button>
        ))}
      </div>
      <form onSubmit={handleSubmit} noValidate className="flex max-w-md items-start gap-2">
        <div className="flex-1">
          <Input
            type="email"
            aria-label="Email"
            placeholder="nome@esempio.it"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setIsTouched(true)}
            error={isVisible ? error : undefined}
          />
        </div>
        <Button type="submit">Invia</Button>
      </form>
    </div>
  )
}
