import { useReducer } from 'react'
import { Button } from '@/shared/ui/Button'
import { counterReducer, initialCounterState } from './counterReducer'

export function Counter() {
  // state: the current value · dispatch: the function to send actions
  const [state, dispatch] = useReducer(counterReducer, initialCounterState)

  return (
    <div className="flex flex-col items-start gap-4">
      <p className="text-5xl font-bold tabular-nums">{state.count}</p>
      <div className="flex flex-wrap items-center gap-2">
        {/* The component only says WHAT happened; the reducer decides how the state changes */}
        <Button variant="secondary" onClick={() => dispatch({ type: 'decremented' })}>
          −{state.step}
        </Button>
        <Button onClick={() => dispatch({ type: 'incremented' })}>+{state.step}</Button>
        <Button variant="ghost" onClick={() => dispatch({ type: 'reset' })}>
          Reset
        </Button>
        <label className="ml-2 flex items-center gap-2 text-sm">
          Passo
          <select
            value={state.step}
            onChange={(e) => dispatch({ type: 'stepChanged', step: Number(e.target.value) })}
            className="rounded-md bg-white px-2 py-1 ring-1 ring-zinc-300 dark:bg-zinc-900 dark:ring-zinc-700"
          >
            {[1, 5, 10].map((step) => (
              <option key={step} value={step}>
                {step}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}
