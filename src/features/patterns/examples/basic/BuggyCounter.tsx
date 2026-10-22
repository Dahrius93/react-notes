import { useState } from 'react'
import { Button } from '@/shared/ui/Button'

// A component with a bug: at 3 it throws during render
export function BuggyCounter() {
  const [count, setCount] = useState(0)

  if (count === 3) {
    throw new Error('Il contatore è arrivato a 3 e si è rotto!')
  }

  return <Button onClick={() => setCount((c) => c + 1)}>Clic: {count} (si rompe a 3)</Button>
}
