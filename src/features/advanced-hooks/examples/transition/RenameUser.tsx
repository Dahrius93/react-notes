import { useState, useTransition } from 'react'
import { updateUser } from '@/shared/api/jsonplaceholder/users'
import { sleep } from '@/shared/lib/sleep'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'

export function RenameUser() {
  const [name, setName] = useState('Leanne Graham')
  const [draft, setDraft] = useState(name)
  const [error, setError] = useState<string | null>(null)
  // React 19: the function passed to startTransition can be async ("Action").
  // isPending stays true until the whole async function has finished.
  const [isPending, startTransition] = useTransition()

  function save() {
    startTransition(async () => {
      try {
        await sleep(800)
        const user = await updateUser(1, { name: draft })
        // State updates AFTER an await must be wrapped again to belong to the transition
        startTransition(() => {
          setName(user.name)
          setError(null)
        })
      } catch {
        startTransition(() => setError('Salvataggio non riuscito'))
      }
    })
  }

  return (
    <div className="max-w-md space-y-3">
      <p className="text-sm">
        Nome salvato: <strong>{name}</strong>
      </p>
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Input label="Nuovo nome" value={draft} onChange={(e) => setDraft(e.target.value)} error={error ?? undefined} />
        </div>
        <Button onClick={save} disabled={isPending || draft === name}>
          {isPending ? 'Salvataggio…' : 'Salva'}
        </Button>
      </div>
    </div>
  )
}
