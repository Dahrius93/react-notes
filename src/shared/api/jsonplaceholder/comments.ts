import { request } from '../http'
import { API_URL } from './config'
import type { Comment } from './types'

type Options = { signal?: AbortSignal }

export function getCommentsByPost(postId: number, { signal }: Options = {}) {
  return request<Comment[]>(`${API_URL}/comments?postId=${postId}`, { signal })
}

/** Fake write: the response always has `id: 501`. */
export function createComment(input: Omit<Comment, 'id'>, { signal }: Options = {}) {
  return request<Comment>(`${API_URL}/comments`, { method: 'POST', body: input, signal })
}
