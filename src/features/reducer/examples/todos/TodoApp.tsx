import { useEffect, useReducer, useState, type FormEvent } from 'react'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { TodoItem } from './TodoItem'
import {
  initialTodosState,
  selectStats,
  selectVisibleTodos,
  todosReducer,
  type Filter,
  type TodosState,
} from './todosReducer'

const STORAGE_KEY = 'react-notes:reducer-todos'

const filters: { value: Filter; label: string }[] = [
  { value: 'all', label: 'Tutte' },
  { value: 'active', label: 'Da fare' },
  { value: 'completed', label: 'Completate' },
]

// Third argument of useReducer: computes the initial state once, lazily
function loadState(fallback: TodosState): TodosState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? (JSON.parse(saved) as TodosState) : fallback
  } catch {
    return fallback
  }
}

export function TodoApp() {
  const [state, dispatch] = useReducer(todosReducer, initialTodosState, loadState)
  const [text, setText] = useState('')

  // Saving to localStorage is a sync with an external system: a legit effect
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const visibleTodos = selectVisibleTodos(state)
  const stats = selectStats(state)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    // Side effects (random id) happen here, in the event handler, not in the reducer
    dispatch({ type: 'added', id: crypto.randomUUID(), text: trimmed })
    setText('')
  }

  return (
    <div className="max-w-xl space-y-4">
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <div className="flex-1">
          <Input label="Nuova attività" value={text} onChange={(e) => setText(e.target.value)} />
        </div>
        <Button type="submit">Aggiungi</Button>
      </form>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div role="group" aria-label="Filtro" className="flex gap-1">
          {filters.map((f) => (
            <Button
              key={f.value}
              size="sm"
              variant={state.filter === f.value ? 'primary' : 'ghost'}
              aria-pressed={state.filter === f.value}
              onClick={() => dispatch({ type: 'filterChanged', filter: f.value })}
            >
              {f.label}
            </Button>
          ))}
        </div>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => dispatch({ type: 'allToggled', done: stats.active > 0 })}
          disabled={stats.total === 0}
        >
          {stats.active > 0 ? 'Completa tutte' : 'Riapri tutte'}
        </Button>
      </div>

      <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
        {visibleTodos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} dispatch={dispatch} />
        ))}
        {visibleTodos.length === 0 && <li className="py-4 text-sm text-zinc-500">Nessuna attività qui.</li>}
      </ul>

      <div className="flex items-center justify-between text-sm text-zinc-500">
        <span>
          {stats.active} da fare · {stats.completed} completate
        </span>
        <Button
          size="sm"
          variant="ghost"
          className={cn(stats.completed === 0 && 'invisible')}
          onClick={() => dispatch({ type: 'completedCleared' })}
        >
          Elimina completate
        </Button>
      </div>
    </div>
  )
}
