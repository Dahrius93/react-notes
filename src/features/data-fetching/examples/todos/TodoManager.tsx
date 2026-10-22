import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { todoQueries } from '@/shared/api/jsonplaceholder/queries'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Spinner } from '@/shared/ui/Spinner'
import { useAddTodo, useToggleTodo } from './todoMutations'

const USER_ID = 1

export function TodoManager() {
  const queryClient = useQueryClient()
  const [title, setTitle] = useState('')
  const [simulateError, setSimulateError] = useState(false)

  const { data: todos, isPending, isFetching } = useQuery({
    ...todoQueries.byUser(USER_ID),
    select: (all) => all.slice(0, 8),
  })
  const addTodo = useAddTodo(USER_ID)
  const toggleTodo = useToggleTodo(USER_ID, { simulateError })

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!title.trim()) return
    // mutate(variables, callbacks): the callbacks here run only for this call
    addTodo.mutate(title.trim(), { onSuccess: () => setTitle('') })
  }

  return (
    <div className="max-w-xl space-y-4">
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <div className="flex-1">
          <Input label="Nuova attività" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <Button type="submit" disabled={addTodo.isPending}>
          {addTodo.isPending ? 'Salvataggio…' : 'Aggiungi'}
        </Button>
      </form>
      {addTodo.error && <p className="text-sm text-red-600">{addTodo.error.message}</p>}

      <div className="flex flex-wrap items-center gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={simulateError} onChange={(e) => setSimulateError(e.target.checked)} />
          Simula errore del server sulle spunte
        </label>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => queryClient.invalidateQueries({ queryKey: todoQueries.all() })}
        >
          ↻ Ricarica dal server {isFetching && '…'}
        </Button>
      </div>

      {toggleTodo.error && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {toggleTodo.error.message}: modifica annullata.
        </p>
      )}

      {isPending ? (
        <Spinner />
      ) : (
        <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {todos?.map((todo) => {
            // The todo currently being saved (variables of the running mutation)
            const isSaving = toggleTodo.isPending && toggleTodo.variables?.id === todo.id
            return (
              <li key={todo.id} className="flex items-center gap-3 py-2 text-sm">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo.mutate(todo)}
                  aria-label={todo.title}
                  className="size-4 accent-sky-600"
                />
                <span className={cn('flex-1', todo.completed && 'text-zinc-400 line-through')}>{todo.title}</span>
                {isSaving && <span className="text-xs text-amber-600">salvataggio…</span>}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
