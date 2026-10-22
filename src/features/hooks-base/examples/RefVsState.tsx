import { useRef, useState } from 'react'
import { Button } from '@/shared/ui/Button'

export function RefVsState() {
  const [stateClicks, setStateClicks] = useState(0)
  const refClicks = useRef(0)

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="space-y-2">
        <p className="text-sm text-zinc-500">useState</p>
        <p className="text-4xl font-bold tabular-nums">{stateClicks}</p>
        <Button onClick={() => setStateClicks((c) => c + 1)}>Incrementa (re-render)</Button>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-zinc-500">useRef</p>
        {/* Reading a ref during render only to show the effect: avoid it in real code */}
        {/* oxlint-disable-next-line react/refs */}
        <p className="text-4xl font-bold tabular-nums">{refClicks.current}</p>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => (refClicks.current += 1)}>
            Incrementa (nessun render)
          </Button>
          <Button variant="ghost" onClick={() => alert(`Valore reale del ref: ${refClicks.current}`)}>
            Leggi
          </Button>
        </div>
      </div>
    </div>
  )
}
