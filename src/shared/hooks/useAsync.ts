import { useCallback, useReducer, useRef } from 'react'
import { isAbortError } from '@/shared/api/http'
import { assertNever } from '@/shared/lib/assertNever'

/**
 * Every possible state of an async operation. Impossible combinations
 * (loading AND error, success WITHOUT data) cannot be represented.
 * `data` is kept while reloading or after an error, to avoid flashing empty UI.
 */
export type AsyncState<T> =
  | { status: 'idle'; data?: undefined; error?: undefined }
  | { status: 'pending'; data?: T; error?: undefined }
  | { status: 'success'; data: T; error?: undefined }
  | { status: 'error'; data?: T; error: Error }

export type AsyncAction<T> =
  | { type: 'started' }
  | { type: 'resolved'; data: T }
  | { type: 'rejected'; error: Error }
  | { type: 'reset' }

export function asyncReducer<T>(state: AsyncState<T>, action: AsyncAction<T>): AsyncState<T> {
  switch (action.type) {
    case 'started':
      return { status: 'pending', data: state.data }
    case 'resolved':
      return { status: 'success', data: action.data }
    case 'rejected':
      return { status: 'error', data: state.data, error: action.error }
    case 'reset':
      return { status: 'idle' }
    default:
      return assertNever(action)
  }
}

function toError(value: unknown): Error {
  return value instanceof Error ? value : new Error(String(value))
}

/**
 * Tracks the state of a promise with a reducer-based state machine.
 * Only the most recent `run` can update the state, so out-of-order
 * responses never overwrite newer ones.
 *
 * @example
 * const { status, data, error, run } = useAsync<User[]>()
 * <Button onClick={() => run(getUsers())}>Load</Button>
 */
export function useAsync<T>() {
  const [state, dispatch] = useReducer(asyncReducer<T>, { status: 'idle' })
  const lastCallId = useRef(0)

  const run = useCallback(async (promise: Promise<T>) => {
    const callId = ++lastCallId.current
    dispatch({ type: 'started' })
    try {
      const data = await promise
      if (callId === lastCallId.current) dispatch({ type: 'resolved', data })
    } catch (error) {
      // A request cancelled on purpose (AbortController) is not an error to show
      if (isAbortError(error)) return
      if (callId === lastCallId.current) dispatch({ type: 'rejected', error: toError(error) })
    }
  }, [])

  const reset = useCallback(() => {
    lastCallId.current++ // ignore any request still in flight
    dispatch({ type: 'reset' })
  }, [])

  return {
    ...state,
    isIdle: state.status === 'idle',
    isPending: state.status === 'pending',
    isSuccess: state.status === 'success',
    isError: state.status === 'error',
    run,
    reset,
  }
}
