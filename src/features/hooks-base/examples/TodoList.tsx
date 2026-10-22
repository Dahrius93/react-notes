import { useState, type FormEvent } from 'react'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'

type Todo = { id: string; text: string; done: boolean }

function createInitialTodos(): Todo[] {
  // Passed as `useState(createInitialTodos)`: runs only on the first render
  return [
    { id: crypto.randomUUID(), text: 'Studiare useState', done: true },
    { id: crypto.randomUUID(), text: 'Studiare useEffect', done: false },
  ]
}

export function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos)
  const [text, setText] = useState('')

  // Derived value: computed during render, no extra state needed
  const remaining = todos.filter((todo) => !todo.done).length

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    // New array (spread) instead of todos.push(...)
    setTodos((prev) => [...prev, { id: crypto.randomUUID(), text: trimmed, done: false }])
    setText('')
  }

  function toggle(id: string) {
    // New array (map) + new object (spread) for the changed item only
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo)))
  }

  function remove(id: string) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  return (
    <div className="max-w-md space-y-4">
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <div className="flex-1">
          <Input label="Nuova attività" value={text} onChange={(e) => setText(e.target.value)} />
        </div>
        <Button type="submit">Aggiungi</Button>
      </form>

      <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center gap-3 py-2">
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggle(todo.id)}
              aria-label={todo.text}
              className="size-4 accent-sky-600"
            />
            <span className={cn('flex-1', todo.done && 'text-zinc-400 line-through')}>{todo.text}</span>
            <Button variant="ghost" size="sm" onClick={() => remove(todo.id)}>
              Elimina
            </Button>
          </li>
        ))}
      </ul>

      <p className="text-sm text-zinc-500">
        {remaining} da fare su {todos.length}
      </p>
    </div>
  )
}
