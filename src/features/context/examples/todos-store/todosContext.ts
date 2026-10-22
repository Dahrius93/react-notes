import type { Dispatch } from 'react'
import type { TodosAction, TodosState } from '@/features/reducer/examples/todos/todosReducer'
import { createStrictContext } from '@/shared/lib/createStrictContext'

// Two contexts instead of one: components that only send actions
// (dispatch never changes) don't re-render when the state changes
export const [TodosStateContext, useTodosState] = createStrictContext<TodosState>('TodosState')
export const [TodosDispatchContext, useTodosDispatch] = createStrictContext<Dispatch<TodosAction>>('TodosDispatch')
