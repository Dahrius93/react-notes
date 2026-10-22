import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { usePrevious } from '../usePrevious'

describe('usePrevious', () => {
  it('is undefined on the first render', () => {
    const { result } = renderHook(() => usePrevious(1))
    expect(result.current).toBeUndefined()
  })

  it('returns the previous distinct value', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 1 },
    })

    rerender({ value: 2 })
    expect(result.current).toBe(1)

    // Re-rendering with the same value keeps the previous one
    rerender({ value: 2 })
    expect(result.current).toBe(1)

    rerender({ value: 3 })
    expect(result.current).toBe(2)
  })
})
