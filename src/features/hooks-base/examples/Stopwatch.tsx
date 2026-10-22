import { useEffect, useRef, useState } from 'react'
import { Button } from '@/shared/ui/Button'

export function Stopwatch() {
  const [elapsedMs, setElapsedMs] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  // Not shown on screen → refs, not state: changing them must not re-render
  const intervalRef = useRef<number | null>(null)
  const startedAtRef = useRef(0)

  function start() {
    if (intervalRef.current !== null) return
    startedAtRef.current = Date.now() - elapsedMs // resume from where we stopped
    intervalRef.current = window.setInterval(() => {
      setElapsedMs(Date.now() - startedAtRef.current)
    }, 10)
    setIsRunning(true)
  }

  function stop() {
    if (intervalRef.current !== null) window.clearInterval(intervalRef.current)
    intervalRef.current = null
    setIsRunning(false)
  }

  function reset() {
    stop()
    setElapsedMs(0)
  }

  // Safety net: stop the timer if the component unmounts while running
  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) window.clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <div className="flex flex-col items-start gap-4">
      <p className="font-mono text-5xl font-bold tabular-nums">{(elapsedMs / 1000).toFixed(2)}s</p>
      <div className="flex gap-2">
        {isRunning ? (
          <Button onClick={stop}>Stop</Button>
        ) : (
          <Button onClick={start}>{elapsedMs > 0 ? 'Riprendi' : 'Start'}</Button>
        )}
        <Button variant="secondary" onClick={reset}>
          Reset
        </Button>
      </div>
    </div>
  )
}
