import { useEffect, useRef, type ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

type RenderTrackerProps = {
  label: string
  children: ReactNode
  className?: string
}

/**
 * Docs tool: wrap the output of a component to see when it re-renders.
 * Flashes a ring and counts renders. Everything happens in an effect
 * (writing to the DOM directly), so the tracker itself never causes renders.
 */
export function RenderTracker({ label, children, className }: RenderTrackerProps) {
  const boxRef = useRef<HTMLDivElement>(null)
  const countRef = useRef<HTMLSpanElement>(null)
  const renders = useRef(0)
  const lastRender = useRef<object | null>(null)
  // A new object on every render: lets the effect tell real renders apart
  // from StrictMode's extra mount/unmount/mount cycle
  const thisRender = {}

  useEffect(() => {
    if (lastRender.current === thisRender) return
    lastRender.current = thisRender
    renders.current += 1
    if (countRef.current) countRef.current.textContent = String(renders.current)
    // Web Animations API: missing in jsdom (tests) and very old browsers
    const box = boxRef.current
    if (typeof box?.animate === 'function') {
      box.animate(
        [{ boxShadow: '0 0 0 2px rgb(244 63 94)' }, { boxShadow: '0 0 0 2px rgb(244 63 94 / 0)' }],
        { duration: 700, easing: 'ease-out' },
      )
    }
  }) // no dependency array: runs after every render

  return (
    <div ref={boxRef} className={cn('rounded-lg p-3 ring-1 ring-zinc-200 dark:ring-zinc-800', className)}>
      <p className="mb-2 flex items-center justify-between gap-2 font-mono text-[11px] text-zinc-500">
        <span>{label}</span>
        <span>
          render: <span ref={countRef}>0</span>
        </span>
      </p>
      {children}
    </div>
  )
}
