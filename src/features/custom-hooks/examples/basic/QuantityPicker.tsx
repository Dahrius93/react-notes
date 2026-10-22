import { Button } from '@/shared/ui/Button'
import { useCounter } from './useCounter'

export function QuantityPicker() {
  // Same hook, different component, its own independent count
  const { count, increment, decrement, reset } = useCounter(1)

  return (
    <div className="flex items-center gap-2">
      <Button size="sm" variant="secondary" onClick={decrement} disabled={count <= 1}>
        −
      </Button>
      <span className="w-8 text-center font-mono tabular-nums">{count}</span>
      <Button size="sm" variant="secondary" onClick={increment}>
        +
      </Button>
      <Button size="sm" variant="ghost" onClick={reset}>
        Reset
      </Button>
    </div>
  )
}
