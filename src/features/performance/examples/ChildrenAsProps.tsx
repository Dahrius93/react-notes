import { useState, type PointerEvent, type ReactNode } from 'react'
import { RenderTracker } from '@/docs/RenderTracker'

function ExpensiveTree() {
  return (
    <RenderTracker label="<ExpensiveTree>">
      <p className="text-sm text-zinc-500">Immagina qui un albero di componenti pesante.</p>
    </RenderTracker>
  )
}

function usePointerPosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    setPosition({ x: Math.round(event.clientX - rect.left), y: Math.round(event.clientY - rect.top) })
  }
  return { position, onPointerMove }
}

// ✗ Renders ExpensiveTree itself: every pointer move re-renders it
function TrackerRendersTree() {
  const { position, onPointerMove } = usePointerPosition()
  return (
    <div onPointerMove={onPointerMove} className="space-y-2 rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900">
      <p className="font-mono text-xs">
        x: {position.x} y: {position.y}
      </p>
      <ExpensiveTree />
    </div>
  )
}

// ✓ Receives the tree as children: it was created by the parent,
// so it's the same element on every pointer move and React skips it
function TrackerWithChildren({ children }: { children: ReactNode }) {
  const { position, onPointerMove } = usePointerPosition()
  return (
    <div onPointerMove={onPointerMove} className="space-y-2 rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900">
      <p className="font-mono text-xs">
        x: {position.x} y: {position.y}
      </p>
      {children}
    </div>
  )
}

export function ChildrenAsProps() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <p className="mb-2 text-sm font-semibold text-red-600 dark:text-red-400">✗ Renderizza i figli da sé</p>
        <TrackerRendersTree />
      </div>
      <div>
        <p className="mb-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">✓ Riceve i figli come children</p>
        <TrackerWithChildren>
          <ExpensiveTree />
        </TrackerWithChildren>
      </div>
    </div>
  )
}
