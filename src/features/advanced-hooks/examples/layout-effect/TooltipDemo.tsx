import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { blockFor } from '@/docs/blockFor'
import { Button } from '@/shared/ui/Button'

type Anchor = { top: number; left: number; height: number }

// Same tooltip, built with either effect hook (hooks can't be swapped at runtime)
function createTooltip(useMeasureEffect: typeof useEffect) {
  return function Tooltip({ anchor, children }: { anchor: Anchor; children: ReactNode }) {
    const ref = useRef<HTMLDivElement>(null)
    const [height, setHeight] = useState(0)

    // Measure the tooltip after it is in the DOM, then reposition it
    useMeasureEffect(() => {
      setHeight(ref.current?.offsetHeight ?? 0)
    }, [])

    // Slow render: with useEffect the first (wrong) position stays visible meanwhile
    blockFor(150)

    // Above the button if there is room, otherwise below
    const above = anchor.top - height - 8
    const top = above >= 0 ? above : anchor.top + anchor.height + 8

    return (
      <div
        ref={ref}
        role="tooltip"
        style={{ top, left: anchor.left }}
        className="pointer-events-none absolute z-10 w-56 rounded-md bg-zinc-900 px-3 py-2 text-xs text-white shadow-lg dark:bg-zinc-100 dark:text-zinc-900"
      >
        {children}
      </div>
    )
  }
}

const TooltipWithLayoutEffect = createTooltip(useLayoutEffect)
const TooltipWithEffect = createTooltip(useEffect)

export function TooltipDemo() {
  const [anchor, setAnchor] = useState<Anchor | null>(null)
  const [mode, setMode] = useState<'layout' | 'effect'>('layout')
  const Tooltip = mode === 'layout' ? TooltipWithLayoutEffect : TooltipWithEffect

  function show(event: PointerEvent<HTMLButtonElement>) {
    const { offsetTop, offsetLeft, offsetHeight } = event.currentTarget
    setAnchor({ top: offsetTop, left: offsetLeft, height: offsetHeight })
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Button size="sm" variant={mode === 'layout' ? 'primary' : 'secondary'} onClick={() => setMode('layout')}>
          useLayoutEffect
        </Button>
        <Button size="sm" variant={mode === 'effect' ? 'primary' : 'secondary'} onClick={() => setMode('effect')}>
          useEffect
        </Button>
      </div>
      <div className="relative h-48 rounded-lg bg-zinc-50 dark:bg-zinc-900">
        <Button size="sm" variant="secondary" className="absolute left-4 top-3" onPointerEnter={show} onPointerLeave={() => setAnchor(null)}>
          In alto (tooltip sotto)
        </Button>
        <Button size="sm" variant="secondary" className="absolute bottom-3 left-48" onPointerEnter={show} onPointerLeave={() => setAnchor(null)}>
          In basso (tooltip sopra)
        </Button>
        {/* key: a new tooltip for every hover, so the measurement starts from scratch */}
        {anchor && (
          <Tooltip key={`${anchor.top}-${mode}`} anchor={anchor}>
            Tooltip misurato con {mode === 'layout' ? 'useLayoutEffect' : 'useEffect'}. Su questo testo un po' lungo, per avere
            un'altezza da misurare.
          </Tooltip>
        )}
      </div>
    </div>
  )
}
