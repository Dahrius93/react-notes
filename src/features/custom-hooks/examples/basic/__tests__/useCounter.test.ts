import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useCounter } from '../useCounter'

describe('useCounter', () => {
  it('increments, decrements and resets to the initial value', () => {
    const { result } = renderHook(() => useCounter(5))

    act(() => result.current.increment())
    act(() => result.current.increment())
    expect(result.current.count).toBe(7)

    act(() => result.current.decrement())
    expect(result.current.count).toBe(6)

    act(() => result.current.reset())
    expect(result.current.count).toBe(5)
  })
})
