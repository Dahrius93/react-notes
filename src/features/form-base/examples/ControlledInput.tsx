import { useState } from 'react'
import { Input } from '@/shared/ui/Input'

const MAX_LENGTH = 20

export function ControlledInput() {
  // React state is the single source of truth: the input shows exactly `username`
  const [username, setUsername] = useState('')

  return (
    <div className="max-w-sm space-y-3">
      <Input
        label="Username"
        value={username}
        // We can transform the value as the user types: lowercase, no spaces, max length
        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, '').slice(0, MAX_LENGTH))}
        hint={`${username.length}/${MAX_LENGTH} · minuscolo, senza spazi`}
      />
      <p className="text-sm text-zinc-500">
        Anteprima profilo: <strong>@{username || '…'}</strong>
      </p>
    </div>
  )
}
