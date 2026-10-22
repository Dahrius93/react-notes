import { useState, type Dispatch, type FormEvent } from 'react'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/Button'
import type { Todo, TodosAction } from './todosReducer'

type TodoItemProps = {
  todo: Todo
  // dispatch is stable: passing it down never causes extra renders
  dispatch: Dispatch<TodosAction>
}

export function TodoItem({ todo, dispatch }: TodoItemProps) {
  // UI-only state (is this row being edited?) stays local, not in the reducer
  const [draft, setDraft] = useState<string | null>(null)
  const isEditing = draft !== null

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = draft?.trim()
    if (text) dispatch({ type: 'edited', id: todo.id, text })
    setDraft(null)
  }

  return (
    <li className="flex min-h-12 items-center gap-3 py-2">
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => dispatch({ type: 'toggled', id: todo.id })}
        aria-label={`Completata: ${todo.text}`}
        className="size-4 accent-sky-600"
      />

      {isEditing ? (
        <form onSubmit={save} className="flex flex-1 gap-2">
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Escape' && setDraft(null)}
            aria-label="Modifica attività"
            className="h-8 flex-1 rounded-md bg-white px-2 text-sm ring-1 ring-sky-500 dark:bg-zinc-900"
          />
          <Button size="sm" type="submit">
            Salva
          </Button>
        </form>
      ) : (
        <>
          <span
            onDoubleClick={() => setDraft(todo.text)}
            className={cn('flex-1', todo.done && 'text-zinc-400 line-through')}
          >
            {todo.text}
          </span>
          <Button size="sm" variant="ghost" onClick={() => setDraft(todo.text)}>
            Modifica
          </Button>
          <Button size="sm" variant="ghost" onClick={() => dispatch({ type: 'deleted', id: todo.id })}>
            Elimina
          </Button>
        </>
      )}
    </li>
  )
}
