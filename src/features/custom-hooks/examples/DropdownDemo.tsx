import { useState } from 'react'
import { Dropdown } from '@/shared/ui/Dropdown'

export function DropdownDemo() {
  const [lastAction, setLastAction] = useState<string | null>(null)

  return (
    <div className="flex min-h-48 flex-col items-start gap-4">
      <Dropdown
        label="Azioni"
        items={[
          { label: 'Modifica', onSelect: () => setLastAction('Modifica') },
          { label: 'Duplica', onSelect: () => setLastAction('Duplica') },
          { label: 'Elimina', onSelect: () => setLastAction('Elimina'), danger: true },
        ]}
      />
      <p className="text-sm text-zinc-500">
        Ultima azione: <strong>{lastAction ?? 'nessuna'}</strong>. Prova a chiudere il menu cliccando fuori o con Esc.
      </p>
    </div>
  )
}
