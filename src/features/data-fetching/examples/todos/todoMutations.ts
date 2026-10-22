import { useMutation, useQueryClient } from '@tanstack/react-query'
import { todoQueries } from '@/shared/api/jsonplaceholder/queries'
import { createTodo, updateTodo } from '@/shared/api/jsonplaceholder/todos'
import type { Todo } from '@/shared/api/jsonplaceholder/types'
import { sleep } from '@/shared/lib/sleep'

// JSONPlaceholder has ids 1..200 and doesn't really save new items
const isFakeNewTodo = (todo: Todo) => todo.id > 200

/** Adds a todo, then writes the server response into the cache. */
export function useAddTodo(userId: number) {
  const queryClient = useQueryClient()
  const { queryKey } = todoQueries.byUser(userId)

  return useMutation({
    mutationFn: (title: string) => createTodo({ userId, title, completed: false }),
    onSuccess: (created) => {
      // The fake API always answers id 201: give each new todo a unique id for the demo
      const todo = { ...created, id: Date.now() }
      // Update the cache directly with the response: no extra request
      queryClient.setQueryData(queryKey, (old) => (old ? [todo, ...old] : [todo]))
      // With a real API you would usually just refetch:
      // return queryClient.invalidateQueries({ queryKey })
    },
  })
}

/** Toggles `completed` optimistically: the UI changes at once, and rolls back on error. */
export function useToggleTodo(userId: number, { simulateError = false } = {}) {
  const queryClient = useQueryClient()
  const { queryKey } = todoQueries.byUser(userId)

  return useMutation({
    mutationFn: async (todo: Todo) => {
      await sleep(800) // slow server: the optimistic update is visible
      if (simulateError) throw new Error('Il server ha rifiutato la modifica (simulato)')
      if (isFakeNewTodo(todo)) return { ...todo, completed: !todo.completed }
      return updateTodo(todo.id, { completed: !todo.completed })
    },

    // 1. Before the request: update the cache as if it had already succeeded
    onMutate: async (todo) => {
      // Stop refetches in flight, or they could overwrite the optimistic value
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData(queryKey)
      queryClient.setQueryData(queryKey, (old) =>
        old?.map((t) => (t.id === todo.id ? { ...t, completed: !t.completed } : t)),
      )
      return { previous } // passed to onError as the third argument
    },

    // 2. If the request fails: put back the snapshot
    onError: (_error, _todo, result) => {
      if (result?.previous) queryClient.setQueryData(queryKey, result.previous)
    },

    // 3. With a real API, always resync with the server at the end:
    // onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })
}
