import { Suspense, use, useState } from 'react'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { Spinner } from '@/shared/ui/Spinner'
import { loadAfter } from './delayedResource'

function Widget({ title, promise }: { title: string; promise: Promise<string> }) {
  const content = use(promise) // suspends until the promise resolves
  return (
    <Card className="text-sm">
      <p className="font-semibold">{title}</p>
      <p className="text-zinc-500">{content}</p>
    </Card>
  )
}

export function SuspenseBoundaries() {
  const [round, setRound] = useState(1)
  const [mode, setMode] = useState<'single' | 'separate'>('separate')

  // New keys on every round = new requests
  const profile = loadAfter(`profile-${round}`, 500, 'Ada Lovelace · caricato in 0,5 s')
  const stats = loadAfter(`stats-${round}`, 2000, '42 post · caricato in 2 s')

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant={mode === 'separate' ? 'primary' : 'secondary'} onClick={() => setMode('separate')}>
          Due Suspense
        </Button>
        <Button size="sm" variant={mode === 'single' ? 'primary' : 'secondary'} onClick={() => setMode('single')}>
          Un solo Suspense
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setRound((r) => r + 1)}>
          ↻ Ricarica
        </Button>
      </div>

      {mode === 'separate' ? (
        // Each part appears as soon as it is ready
        <div className="grid gap-3 sm:grid-cols-2">
          <Suspense fallback={<Spinner label="Profilo…" />}>
            <Widget title="Profilo" promise={profile} />
          </Suspense>
          <Suspense fallback={<Spinner label="Statistiche…" />}>
            <Widget title="Statistiche" promise={stats} />
          </Suspense>
        </div>
      ) : (
        // Everything appears together, when the slowest part is ready
        <Suspense fallback={<Spinner label="Profilo e statistiche…" />}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Widget title="Profilo" promise={profile} />
            <Widget title="Statistiche" promise={stats} />
          </div>
        </Suspense>
      )}
    </div>
  )
}
