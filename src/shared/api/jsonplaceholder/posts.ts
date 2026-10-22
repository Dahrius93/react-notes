import { request } from '../http'
import { API_URL } from './config'
import type { Post } from './types'

type Options = { signal?: AbortSignal }

export type CreatePostInput = Pick<Post, 'userId' | 'title' | 'body'>

/** All 100 posts (JSONPlaceholder has no real search: filter on the client). */
export function getPosts({ signal }: Options = {}) {
  return request<Post[]>(`${API_URL}/posts`, { signal })
}

export function getPost(id: number, { signal }: Options = {}) {
  return request<Post>(`${API_URL}/posts/${id}`, { signal })
}

export function getPostsByUser(userId: number, { signal }: Options = {}) {
  return request<Post[]>(`${API_URL}/posts?userId=${userId}`, { signal })
}

/** Fake write: the response has `id: 101`, but nothing is saved. */
export function createPost(input: CreatePostInput, { signal }: Options = {}) {
  return request<Post>(`${API_URL}/posts`, { method: 'POST', body: input, signal })
}
