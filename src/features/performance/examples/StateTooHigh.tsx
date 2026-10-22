import { useState } from 'react'
import { Input } from '@/shared/ui/Input'
import { SlowPanel } from './SlowPanel'

// ✗ The text state lives in the parent of SlowPanel:
// every keystroke re-renders SlowPanel too → typing lags
export function StateTooHigh() {
  const [text, setText] = useState('')

  return (
    <div className="space-y-3">
      <Input label="Scrivi velocemente" value={text} onChange={(e) => setText(e.target.value)} />
      <SlowPanel />
    </div>
  )
}
