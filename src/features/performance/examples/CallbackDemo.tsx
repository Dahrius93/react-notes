import { memo, useCallback, useState } from 'react'
import { RenderTracker } from '@/docs/RenderTracker'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/Button'

type Item = { id: number; label: string; done: boolean }

type RowProps = {
  item: Item
  onToggle: (id: number) => void
}

const Row = memo(function Row({ item, onToggle }: RowProps) {
  return (
    <RenderTracker label={`<Row id=${item.id}>`} className="p-2">
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={item.done} onChange={() => onToggle(item.id)} className="accent-sky-600" />
        <span className={cn(item.done && 'text-zinc-400 line-through')}>{item.label}</span>
      </label>
    </RenderTracker>
  )
})

const initialItems: Item[] = [
  { id: 1, label: 'Memo', done: false },
  { id: 2, label: 'useMemo', done: false },
  { id: 3, label: 'useCallback', done: false },
  { id: 4, label: 'React Compiler', done: false },
]

export function CallbackDemo() {
  const [items, setItems] = useState(initialItems)
  const [count, setCount] = useState(0)
  const [useCallbackEnabled, setUseCallbackEnabled] = useState(true)

  // Same function for the whole life of the component (setItems is stable)
  const stableToggle = useCallback((id: number) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item)))
  }, [])

  // A new function on every render → every memo(Row) re-renders
  const inlineToggle = (id: number) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item)))
  }

  const onToggle = useCallbackEnabled ? stableToggle : inlineToggle

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={() => setCount((c) => c + 1)}>Render del padre ({count})</Button>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={useCallbackEnabled} onChange={(e) => setUseCallbackEnabled(e.target.checked)} />
          useCallback
        </label>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <Row key={item.id} item={item} onToggle={onToggle} />
        ))}
      </div>
    </div>
  )
}
