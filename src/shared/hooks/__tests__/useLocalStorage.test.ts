import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useLocalStorage } from '../useLocalStorage'

describe('useLocalStorage', () => {
  it('uses the initial value when nothing is stored', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'default'))
    expect(result.current[0]).toBe('default')
  })

  it('reads an existing value and writes updates as JSON', () => {
    localStorage.setItem('count', '5')
    const { result } = renderHook(() => useLocalStorage('count', 0))
    expect(result.current[0]).toBe(5)

    act(() => result.current[1]((c) => c + 1))

    expect(result.current[0]).toBe(6)
    expect(localStorage.getItem('count')).toBe('6')
  })

  it('falls back to the initial value on invalid JSON', () => {
    localStorage.setItem('broken', '{not json')
    const { result } = renderHook(() => useLocalStorage('broken', 'fallback'))
    expect(result.current[0]).toBe('fallback')
  })
})
