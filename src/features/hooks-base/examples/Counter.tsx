import { useState } from 'react'
import { Button } from '@/shared/ui/Button'

export function Counter() {
  const [count, setCount] = useState(0)

  function addThreeWithValue() {
    // All three calls read the same `count` of this render → +1, not +3
    setCount(count + 1)
    setCount(count + 1)
    setCount(count + 1)
  }

  function addThreeWithUpdater() {
    // The updater receives the latest pending value → +3
    setCount((c) => c + 1)
    setCount((c) => c + 1)
    setCount((c) => c + 1)
  }

  return (
    <div className="flex flex-col items-start gap-4">
      <p className="text-5xl font-bold tabular-nums">{count}</p>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setCount(count + 1)}>+1</Button>
        <Button variant="secondary" onClick={addThreeWithValue}>
          +3 con valore
        </Button>
        <Button variant="secondary" onClick={addThreeWithUpdater}>
          +3 con funzione
        </Button>
        <Button variant="ghost" onClick={() => setCount(0)}>
          Azzera
        </Button>
      </div>
    </div>
  )
}
