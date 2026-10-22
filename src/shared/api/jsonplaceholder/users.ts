import { request } from '../http'
import { API_URL } from './config'
import type { User } from './types'

type Options = { signal?: AbortSignal }

export type CreateUserInput = Pick<User, 'name' | 'username' | 'email'> & Partial<Pick<User, 'phone' | 'website'>>

export function getUsers({ signal }: Options = {}) {
  return request<User[]>(`${API_URL}/users`, { signal })
}

export function getUser(id: number, { signal }: Options = {}) {
  return request<User>(`${API_URL}/users/${id}`, { signal })
}

/** Exact (case-sensitive) username match, e.g. "Bret". Null when not found. */
export async function findUserByUsername(username: string, { signal }: Options = {}) {
  const users = await request<User[]>(`${API_URL}/users?username=${encodeURIComponent(username)}`, { signal })
  return users[0] ?? null
}

/** Fake write: answers with the merged user, nothing is saved. */
export function updateUser(id: number, changes: Partial<Omit<User, 'id'>>, { signal }: Options = {}) {
  return request<User>(`${API_URL}/users/${id}`, { method: 'PATCH', body: changes, signal })
}

/**
 * JSONPlaceholder fakes writes: it answers with the sent data plus `id: 11`,
 * but nothing is actually saved on the server.
 */
export function createUser(input: CreateUserInput, { signal }: Options = {}) {
  return request<CreateUserInput & { id: number }>(`${API_URL}/users`, { method: 'POST', body: input, signal })
}
