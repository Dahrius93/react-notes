import { useEffect, useState } from 'react'

export function Clock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    // Setup: start a timer that updates the state every second
    const id = setInterval(() => setNow(new Date()), 1000)
    // Cleanup: stop it when the component disappears
    return () => clearInterval(id)
  }, []) // [] = run the setup only once, after the first render

  return <p className="font-mono text-4xl font-bold tabular-nums">{now.toLocaleTimeString('it-IT')}</p>
}
