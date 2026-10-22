import { queryOptions } from '@tanstack/react-query'
import { getPost, getPosts, getPostsByUser } from './posts'
import { getTodosByUser } from './todos'
import { getUser, getUsers } from './users'

/*
 * Query keys and query functions in ONE place.
 * - Keys are hierarchical arrays: ['users'] ⊃ ['users', 'detail', 1]
 *   so invalidateQueries({ queryKey: userQueries.all() }) refreshes every user query.
 * - queryOptions() keeps key and fn together and gives typed data everywhere
 *   (useQuery, queryClient.query, getQueryData, setQueryData).
 */

export const userQueries = {
  all: () => ['users'] as const,
  list: () =>
    queryOptions({
      queryKey: [...userQueries.all(), 'list'],
      queryFn: ({ signal }) => getUsers({ signal }),
    }),
  detail: (id: number) =>
    queryOptions({
      queryKey: [...userQueries.all(), 'detail', id],
      queryFn: ({ signal }) => getUser(id, { signal }),
    }),
}

export const postQueries = {
  all: () => ['posts'] as const,
  list: () =>
    queryOptions({
      queryKey: [...postQueries.all(), 'list'],
      queryFn: ({ signal }) => getPosts({ signal }),
    }),
  detail: (id: number) =>
    queryOptions({
      queryKey: [...postQueries.all(), 'detail', id],
      queryFn: ({ signal }) => getPost(id, { signal }),
    }),
  byUser: (userId: number) =>
    queryOptions({
      queryKey: [...postQueries.all(), 'byUser', userId],
      queryFn: ({ signal }) => getPostsByUser(userId, { signal }),
    }),
}

export const todoQueries = {
  all: () => ['todos'] as const,
  byUser: (userId: number) =>
    queryOptions({
      queryKey: [...todoQueries.all(), 'byUser', userId],
      queryFn: ({ signal }) => getTodosByUser(userId, { signal }),
    }),
}
