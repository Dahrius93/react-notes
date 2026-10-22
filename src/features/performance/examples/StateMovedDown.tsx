import { useState } from 'react'
import { Input } from '@/shared/ui/Input'
import { SlowPanel } from './SlowPanel'

// ✓ The state moved down into the only component that needs it
function SearchBox() {
  const [text, setText] = useState('')
  return <Input label="Scrivi velocemente" value={text} onChange={(e) => setText(e.target.value)} />
}

export function StateMovedDown() {
  // No state here anymore: typing re-renders SearchBox only
  return (
    <div className="space-y-3">
      <SearchBox />
      <SlowPanel />
    </div>
  )
}
