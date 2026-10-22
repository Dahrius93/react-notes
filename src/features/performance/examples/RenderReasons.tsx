import { useState } from 'react'
import { RenderTracker } from '@/docs/RenderTracker'
import { Button } from '@/shared/ui/Button'

// No props, no state, no context... and it still re-renders with its parent
function Child() {
  return (
    <RenderTracker label="<Child> · nessuna prop">
      <p className="text-sm text-zinc-500">Non uso nulla del padre.</p>
    </RenderTracker>
  )
}

export function RenderReasons() {
  const [count, setCount] = useState(0)

  return (
    <RenderTracker label="<Parent> · stato count">
      <div className="space-y-3">
        <Button onClick={() => setCount((c) => c + 1)}>Incrementa: {count}</Button>
        <Child />
      </div>
    </RenderTracker>
  )
}
