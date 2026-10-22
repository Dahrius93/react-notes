import { useReducer, type ReactNode } from 'react'
import { initialTodosState, todosReducer } from '@/features/reducer/examples/todos/todosReducer'
import { TodosDispatchContext, TodosStateContext } from './todosContext'

// The same reducer of the useReducer page, now shared with the whole subtree
export function TodosProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(todosReducer, initialTodosState)

  return (
    <TodosStateContext value={state}>
      <TodosDispatchContext value={dispatch}>{children}</TodosDispatchContext>
    </TodosStateContext>
  )
}
