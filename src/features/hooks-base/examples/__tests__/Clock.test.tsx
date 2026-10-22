import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Clock } from '../Clock'

describe('Clock', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 0, 1, 10, 0, 0))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('ticks every second', () => {
    render(<Clock />)
    expect(screen.getByText('10:00:00')).toBeInTheDocument()

    act(() => vi.advanceTimersByTime(2000))
    expect(screen.getByText('10:00:02')).toBeInTheDocument()
  })

  it('stops the timer on unmount (cleanup)', () => {
    const { unmount } = render(<Clock />)
    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
})
