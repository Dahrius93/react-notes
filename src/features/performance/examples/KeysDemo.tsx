import { useState } from 'react'
import { Button } from '@/shared/ui/Button'

type Person = { id: number; name: string }

const names = ['Ada', 'Grace', 'Linus', 'Margaret', 'Alan', 'Barbara', 'Dennis', 'Katherine']

// Each row has its own internal state (the uncontrolled input)
function PersonRow({ person }: { person: Person }) {
  return (
    <li className="flex items-center gap-2 text-sm">
      <span className="w-20 font-medium">{person.name}</span>
      <input
        placeholder={`Nota per ${person.name}`}
        className="h-8 flex-1 rounded-md bg-white px-2 ring-1 ring-zinc-300 dark:bg-zinc-900 dark:ring-zinc-700"
      />
    </li>
  )
}

export function KeysDemo() {
  const [people, setPeople] = useState<Person[]>([
    { id: 1, name: 'Ada' },
    { id: 2, name: 'Grace' },
  ])

  function addFirst() {
    setPeople((prev) => {
      const id = prev.length + 1
      return [{ id, name: names[(id - 1) % names.length] + ` #${id}` }, ...prev]
    })
  }

  return (
    <div className="space-y-4">
      <Button onClick={addFirst}>Aggiungi in cima</Button>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <p className="mb-2 text-sm font-semibold text-red-600 dark:text-red-400">✗ key = indice</p>
          <ul className="space-y-2">
            {people.map((person, index) => (
              <PersonRow key={index} person={person} />
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">✓ key = id</p>
          <ul className="space-y-2">
            {people.map((person) => (
              <PersonRow key={person.id} person={person} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
