import { renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useInterval } from '../useInterval'

describe('useInterval', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('calls the callback every `delay` ms', () => {
    const callback = vi.fn()
    renderHook(() => useInterval(callback, 1000))

    vi.advanceTimersByTime(3500)
    expect(callback).toHaveBeenCalledTimes(3)
  })

  it('does nothing when the delay is null', () => {
    const callback = vi.fn()
    renderHook(() => useInterval(callback, null))

    vi.advanceTimersByTime(5000)
    expect(callback).not.toHaveBeenCalled()
  })

  it('always calls the latest callback without restarting the timer', () => {
    const first = vi.fn()
    const second = vi.fn()
    const { rerender } = renderHook(({ cb }) => useInterval(cb, 1000), { initialProps: { cb: first } })

    vi.advanceTimersByTime(600)
    rerender({ cb: second })
    vi.advanceTimersByTime(400) // 1000ms since start: the timer was not reset

    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledTimes(1)
  })

  it('stops on unmount', () => {
    const callback = vi.fn()
    const { unmount } = renderHook(() => useInterval(callback, 1000))

    unmount()
    vi.advanceTimersByTime(5000)
    expect(callback).not.toHaveBeenCalled()
  })
})
