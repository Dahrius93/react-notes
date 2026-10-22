/** Error thrown for non-2xx responses, keeps the HTTP status around. */
export class HttpError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
}

/** True when a request was cancelled through an AbortController. */
export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

type RequestOptions = Omit<RequestInit, 'body'> & { body?: unknown }

/**
 * Thin wrapper around fetch: JSON in, JSON out, throws HttpError on failure.
 *
 * @example
 * const user = await request<User>('/users/1', { signal })
 */
export async function request<T>(url: string, { body, headers, ...init }: RequestOptions = {}): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(body !== undefined && { 'Content-Type': 'application/json' }),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  if (!response.ok) {
    throw new HttpError(response.status, `${response.status} ${response.statusText || 'Request failed'}`)
  }

  // 204 No Content (e.g. DELETE) has no body to parse
  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}
