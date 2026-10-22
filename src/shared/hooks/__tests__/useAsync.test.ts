import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { asyncReducer, useAsync } from '../useAsync'

/** A promise we resolve/reject by hand, to control the timing in tests. */
function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (error: Error) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

describe('asyncReducer', () => {
  it('keeps the previous data while pending and on error', () => {
    const success = asyncReducer<number>({ status: 'idle' }, { type: 'resolved', data: 1 })
    const pending = asyncReducer(success, { type: 'started' })
    const failed = asyncReducer(pending, { type: 'rejected', error: new Error('boom') })

    expect(pending).toEqual({ status: 'pending', data: 1 })
    expect(failed).toEqual({ status: 'error', data: 1, error: new Error('boom') })
  })
})

describe('useAsync', () => {
  it('goes idle → pending → success', async () => {
    const { result } = renderHook(() => useAsync<string>())
    const request = deferred<string>()
    expect(result.current.status).toBe('idle')

    let done!: Promise<void>
    act(() => {
      done = result.current.run(request.promise)
    })
    expect(result.current.status).toBe('pending')

    await act(async () => {
      request.resolve('ok')
      await done
    })
    expect(result.current).toMatchObject({ status: 'success', data: 'ok', isSuccess: true })
  })

  it('stores the error', async () => {
    const { result } = renderHook(() => useAsync<string>())

    await act(() => result.current.run(Promise.reject(new Error('Network down'))))

    expect(result.current.status).toBe('error')
    expect(result.current.error?.message).toBe('Network down')
  })

  it('does not treat an aborted request as an error', async () => {
    const { result } = renderHook(() => useAsync<string>())

    await act(() => result.current.run(Promise.reject(new DOMException('Aborted', 'AbortError'))))

    expect(result.current.status).toBe('pending')
    expect(result.current.error).toBeUndefined()
  })

  it('ignores a slow response that arrives after a newer one', async () => {
    const { result } = renderHook(() => useAsync<string>())
    const slow = deferred<string>()
    const fast = deferred<string>()

    let first!: Promise<void>
    let second!: Promise<void>
    act(() => {
      first = result.current.run(slow.promise)
      second = result.current.run(fast.promise)
    })

    await act(async () => {
      fast.resolve('new')
      await second
      slow.resolve('old')
      await first
    })

    expect(result.current.data).toBe('new')
  })
})
