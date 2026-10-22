import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useToggle } from '../useToggle'

describe('useToggle', () => {
  it('starts from the initial value', () => {
    const { result } = renderHook(() => useToggle(true))
    expect(result.current[0]).toBe(true)
  })

  it('toggles, sets on and sets off', () => {
    const { result } = renderHook(() => useToggle())

    act(() => result.current[1].toggle())
    expect(result.current[0]).toBe(true)

    act(() => result.current[1].setOff())
    expect(result.current[0]).toBe(false)

    act(() => result.current[1].setOn())
    expect(result.current[0]).toBe(true)
  })

  it('keeps the actions stable between renders', () => {
    const { result, rerender } = renderHook(() => useToggle())
    const firstActions = result.current[1]

    act(() => result.current[1].toggle())
    rerender()

    expect(result.current[1].toggle).toBe(firstActions.toggle)
  })
})
