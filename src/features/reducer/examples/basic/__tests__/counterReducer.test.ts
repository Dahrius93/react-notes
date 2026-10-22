import { describe, expect, it } from 'vitest'
import { counterReducer, initialCounterState } from '../counterReducer'

describe('counterReducer', () => {
  it('increments and decrements by the current step', () => {
    const withStep = counterReducer(initialCounterState, { type: 'stepChanged', step: 5 })
    const incremented = counterReducer(withStep, { type: 'incremented' })
    expect(incremented.count).toBe(5)
    expect(counterReducer(incremented, { type: 'decremented' }).count).toBe(0)
  })

  it('resets to the initial state', () => {
    const state = { count: 42, step: 10 }
    expect(counterReducer(state, { type: 'reset' })).toEqual(initialCounterState)
  })
})
