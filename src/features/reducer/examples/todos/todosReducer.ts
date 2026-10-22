import { assertNever } from '@/shared/lib/assertNever'

export type Todo = {
  id: string
  text: string
  done: boolean
}

export type Filter = 'all' | 'active' | 'completed'

export type TodosState = {
  todos: Todo[]
  filter: Filter
}

// Actions describe WHAT HAPPENED (past tense), not how to change the state
export type TodosAction =
  | { type: 'added'; id: string; text: string }
  | { type: 'toggled'; id: string }
  | { type: 'edited'; id: string; text: string }
  | { type: 'deleted'; id: string }
  | { type: 'allToggled'; done: boolean }
  | { type: 'completedCleared' }
  | { type: 'filterChanged'; filter: Filter }

export const initialTodosState: TodosState = {
  todos: [
    { id: 'seed-1', text: 'Leggere la pagina su useReducer', done: true },
    { id: 'seed-2', text: 'Scrivere un reducer con azioni tipizzate', done: false },
    { id: 'seed-3', text: 'Testarlo come funzione pura', done: false },
  ],
  filter: 'all',
}

export function todosReducer(state: TodosState, action: TodosAction): TodosState {
  switch (action.type) {
    case 'added':
      // The id comes from the action: a reducer must not generate random values
      return { ...state, todos: [...state.todos, { id: action.id, text: action.text, done: false }] }

    case 'toggled':
      return {
        ...state,
        todos: state.todos.map((todo) => (todo.id === action.id ? { ...todo, done: !todo.done } : todo)),
      }

    case 'edited':
      return {
        ...state,
        todos: state.todos.map((todo) => (todo.id === action.id ? { ...todo, text: action.text } : todo)),
      }

    case 'deleted':
      return { ...state, todos: state.todos.filter((todo) => todo.id !== action.id) }

    case 'allToggled':
      return { ...state, todos: state.todos.map((todo) => ({ ...todo, done: action.done })) }

    case 'completedCleared':
      return { ...state, todos: state.todos.filter((todo) => !todo.done) }

    case 'filterChanged':
      // Same value → same object: React can skip the re-render
      return action.filter === state.filter ? state : { ...state, filter: action.filter }

    default:
      // Adding an action to TodosAction without handling it here is a compile error
      return assertNever(action)
  }
}

// Selectors: derived data computed from the state, never stored in it

export function selectVisibleTodos({ todos, filter }: TodosState): Todo[] {
  if (filter === 'active') return todos.filter((todo) => !todo.done)
  if (filter === 'completed') return todos.filter((todo) => todo.done)
  return todos
}

export function selectStats({ todos }: TodosState) {
  const completed = todos.filter((todo) => todo.done).length
  return { total: todos.length, completed, active: todos.length - completed }
}
