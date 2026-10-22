// 1. The shape of the state
export type CounterState = {
  count: number
  step: number
}

// 2. Everything that can happen, one variant per action
export type CounterAction =
  | { type: 'incremented' }
  | { type: 'decremented' }
  | { type: 'reset' }
  | { type: 'stepChanged'; step: number }

export const initialCounterState: CounterState = { count: 0, step: 1 }

// 3. Pure function: (current state, what happened) → next state
export function counterReducer(state: CounterState, action: CounterAction): CounterState {
  switch (action.type) {
    case 'incremented':
      return { ...state, count: state.count + state.step }
    case 'decremented':
      return { ...state, count: state.count - state.step }
    case 'reset':
      return initialCounterState
    case 'stepChanged':
      return { ...state, step: action.step }
  }
}
