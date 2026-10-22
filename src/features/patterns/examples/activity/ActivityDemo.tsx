import { Activity, useEffect, useState } from 'react'
import { Button } from '@/shared/ui/Button'

function DraftEditor() {
  const [text, setText] = useState('')
  return (
    <textarea
      value={text}
      onChange={(e) => setText(e.target.value)}
      rows={3}
      aria-label="Bozza"
      placeholder="Scrivi una bozza, poi cambia tab e torna qui…"
      className="w-full rounded-lg bg-white p-3 text-sm ring-1 ring-zinc-300 dark:bg-zinc-900 dark:ring-zinc-700"
    />
  )
}

function LiveClock() {
  const [seconds, setSeconds] = useState(0)
  useEffect(() => {
    // Hidden <Activity> = effects cleaned up: the timer stops, the state stays
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [])
  return <p className="font-mono text-2xl tabular-nums">{seconds}s visibili</p>
}

type Tab = 'draft' | 'clock'

export function ActivityDemo() {
  const [tab, setTab] = useState<Tab>('draft')
  const [useActivity, setUseActivity] = useState(true)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant={tab === 'draft' ? 'primary' : 'secondary'} onClick={() => setTab('draft')}>
          Bozza
        </Button>
        <Button size="sm" variant={tab === 'clock' ? 'primary' : 'secondary'} onClick={() => setTab('clock')}>
          Cronometro
        </Button>
        <label className="ml-auto flex items-center gap-2 text-sm">
          <input type="checkbox" checked={useActivity} onChange={(e) => setUseActivity(e.target.checked)} />
          usa {'<Activity>'}
        </label>
      </div>

      {useActivity ? (
        <>
          {/* hidden: kept in memory (state and DOM), not shown, effects paused */}
          <Activity mode={tab === 'draft' ? 'visible' : 'hidden'}>
            <DraftEditor />
          </Activity>
          <Activity mode={tab === 'clock' ? 'visible' : 'hidden'}>
            <LiveClock />
          </Activity>
        </>
      ) : (
        // Conditional rendering: the hidden tab is unmounted and its state is lost
        <>{tab === 'draft' ? <DraftEditor /> : <LiveClock />}</>
      )}
    </div>
  )
}
