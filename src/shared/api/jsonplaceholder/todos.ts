import { request } from '../http'
import { API_URL } from './config'
import type { Todo } from './types'

type Options = { signal?: AbortSignal }

export function getTodosByUser(userId: number, { signal }: Options = {}) {
  return request<Todo[]>(`${API_URL}/todos?userId=${userId}`, { signal })
}

/** Fake write: JSONPlaceholder answers with the merged todo but doesn't save it. */
export function updateTodo(id: number, changes: Partial<Omit<Todo, 'id'>>, { signal }: Options = {}) {
  return request<Todo>(`${API_URL}/todos/${id}`, { method: 'PATCH', body: changes, signal })
}

/** Fake write: the response always has `id: 201`. */
export function createTodo(input: Omit<Todo, 'id'>, { signal }: Options = {}) {
  return request<Todo>(`${API_URL}/todos`, { method: 'POST', body: input, signal })
}
