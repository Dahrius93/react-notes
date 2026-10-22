import { useEffect, useState } from 'react'

export function WindowSizeManual() {
  const [size, setSize] = useState(() => ({ width: window.innerWidth, height: window.innerHeight }))

  useEffect(() => {
    function handleResize() {
      setSize({ width: window.innerWidth, height: window.innerHeight })
    }

    window.addEventListener('resize', handleResize)
    // Without this cleanup every mount would add one more listener (memory leak)
    return () => window.removeEventListener('resize', handleResize)
  }, []) // [] = subscribe once on mount, unsubscribe on unmount

  return (
    <div>
      <p className="font-mono text-3xl font-bold tabular-nums">
        {size.width} × {size.height}
      </p>
      <p className="mt-2 text-sm text-zinc-500">Ridimensiona la finestra del browser.</p>
    </div>
  )
}
