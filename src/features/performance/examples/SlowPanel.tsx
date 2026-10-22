import { blockFor } from '@/docs/blockFor'
import { RenderTracker } from '@/docs/RenderTracker'

/** A component that takes ~100ms to render (twice in dev, because of StrictMode). */
export function SlowPanel() {
  blockFor(100)

  return (
    <RenderTracker label="<SlowPanel> · 100ms per render">
      <p className="text-sm text-zinc-500">Un componente costoso: grafici, tabelle enormi, markdown…</p>
    </RenderTracker>
  )
}
