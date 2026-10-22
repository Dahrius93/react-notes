import { memo, useMemo, useState, type CSSProperties } from 'react'
import { RenderTracker } from '@/docs/RenderTracker'
import { Button } from '@/shared/ui/Button'

function PlainChild({ label }: { label: string }) {
  return <RenderTracker label="senza memo">{label}</RenderTracker>
}

// memo: skips the render if every prop is Object.is-equal to the previous one
const MemoChild = memo(function MemoChild({ label }: { label: string }) {
  return <RenderTracker label="memo · prop stringa">{label}</RenderTracker>
})

const MemoStyledChild = memo(function MemoStyledChild({ label, style }: { label: string; style: CSSProperties }) {
  return (
    <RenderTracker label="memo · prop oggetto">
      <span style={style}>{label}</span>
    </RenderTracker>
  )
})

export function MemoDemo() {
  const [count, setCount] = useState(0)
  const [isBold, setIsBold] = useState(false)

  // A new object on every render → memo never skips
  const inlineStyle = { fontWeight: isBold ? 700 : 400 }
  // Same object until isBold changes → memo works
  const memoizedStyle = useMemo(() => ({ fontWeight: isBold ? 700 : 400 }), [isBold])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setCount((c) => c + 1)}>Render del padre ({count})</Button>
        <Button variant="secondary" onClick={() => setIsBold((b) => !b)}>
          Cambia grassetto
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <PlainChild label="Mi ri-renderizzo sempre" />
        <MemoChild label="Mi ri-renderizzo solo se cambia label" />
        <MemoStyledChild label="style={{ ... }} inline: memo inutile" style={inlineStyle} />
        <MemoStyledChild label="style con useMemo: memo funziona" style={memoizedStyle} />
      </div>
    </div>
  )
}
