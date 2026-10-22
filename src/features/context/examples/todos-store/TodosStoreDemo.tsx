import { useState, type FormEvent } from 'react'
import { RenderTracker } from '@/docs/RenderTracker'
import { selectStats, selectVisibleTodos, type Filter } from '@/features/reducer/examples/todos/todosReducer'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/Button'
import { useTodosDispatch, useTodosState } from './todosContext'
import { TodosProvider } from './TodosProvider'

// Only dispatch → never re-renders because of the todos (only for its own input state)
function AddTodo() {
  const dispatch = useTodosDispatch()
  const [text, setText] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!text.trim()) return
    dispatch({ type: 'added', id: crypto.randomUUID(), text: text.trim() })
    setText('')
  }

  return (
    <RenderTracker label="<AddTodo> · solo dispatch">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-label="Nuova attività"
          placeholder="Nuova attività…"
          className="h-9 flex-1 rounded-md bg-white px-3 text-sm ring-1 ring-zinc-300 dark:bg-zinc-900 dark:ring-zinc-700"
        />
        <Button size="sm" type="submit">
          Aggiungi
        </Button>
      </form>
    </RenderTracker>
  )
}

function FilterBar() {
  const { filter } = useTodosState()
  const dispatch = useTodosDispatch()
  const filters: Filter[] = ['all', 'active', 'completed']

  return (
    <RenderTracker label="<FilterBar> · stato + dispatch">
      <div className="flex gap-1">
        {filters.map((f) => (
          <Button
            key={f}
            size="sm"
            variant={f === filter ? 'primary' : 'ghost'}
            onClick={() => dispatch({ type: 'filterChanged', filter: f })}
          >
            {f}
          </Button>
        ))}
      </div>
    </RenderTracker>
  )
}

function TodoList() {
  const state = useTodosState()
  const dispatch = useTodosDispatch()

  return (
    <RenderTracker label="<TodoList> · stato + dispatch">
      <ul className="space-y-1">
        {selectVisibleTodos(state).map((todo) => (
          <li key={todo.id} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => dispatch({ type: 'toggled', id: todo.id })}
              aria-label={todo.text}
              className="accent-sky-600"
            />
            <span className={cn(todo.done && 'text-zinc-400 line-through')}>{todo.text}</span>
          </li>
        ))}
      </ul>
    </RenderTracker>
  )
}

function Stats() {
  const { active, completed } = selectStats(useTodosState())
  return (
    <RenderTracker label="<Stats> · solo stato">
      <p className="text-sm">
        {active} da fare · {completed} completate
      </p>
    </RenderTracker>
  )
}

// Uses no context at all → never re-renders
function StaticHint() {
  return (
    <RenderTracker label="<StaticHint> · nessun context">
      <p className="text-sm text-zinc-500">Aggiungi o spunta un'attività e guarda quali riquadri lampeggiano.</p>
    </RenderTracker>
  )
}

export function TodosStoreDemo() {
  return (
    <TodosProvider>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-3">
          <AddTodo />
          <FilterBar />
          <StaticHint />
        </div>
        <div className="space-y-3">
          <TodoList />
          <Stats />
        </div>
      </div>
    </TodosProvider>
  )
}
