import { useState } from 'react'
import { useInterval } from '@/shared/hooks/useInterval'
import { Button } from '@/shared/ui/Button'

const START = 30

export function Countdown() {
  const [seconds, setSeconds] = useState(START)
  const [isRunning, setIsRunning] = useState(false)
  const [speed, setSpeed] = useState(1)

  // null pauses the interval; changing the delay restarts it with the new speed
  useInterval(
    () => {
      // The callback always reads the latest `seconds`, no stale closure
      if (seconds <= 1) setIsRunning(false)
      setSeconds(Math.max(seconds - 1, 0))
    },
    isRunning ? 1000 / speed : null,
  )

  return (
    <div className="flex flex-col items-start gap-4">
      <p className="font-mono text-5xl font-bold tabular-nums">{seconds}s</p>
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={() => setIsRunning((r) => !r)} disabled={seconds === 0}>
          {isRunning ? 'Pausa' : 'Avvia'}
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            setIsRunning(false)
            setSeconds(START)
          }}
        >
          Reset
        </Button>
        <label className="ml-2 flex items-center gap-2 text-sm">
          Velocità
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="rounded-md bg-white px-2 py-1 ring-1 ring-zinc-300 dark:bg-zinc-900 dark:ring-zinc-700"
          >
            <option value={1}>1×</option>
            <option value={2}>2×</option>
            <option value={5}>5×</option>
          </select>
        </label>
      </div>
    </div>
  )
}
