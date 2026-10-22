import { startTransition, useState, ViewTransition } from 'react'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/Button'

const slides = [
  { title: 'Hook', text: 'Stato ed effetti nei componenti funzione.', color: 'bg-sky-500' },
  { title: 'Router', text: 'URL, parametri e navigazione.', color: 'bg-emerald-500' },
  { title: 'Query', text: 'Cache e sincronizzazione con il server.', color: 'bg-amber-500' },
]

export function ViewTransitionDemo() {
  const [index, setIndex] = useState(0)
  const [animate, setAnimate] = useState(true)
  const slide = slides[index]

  function next() {
    const update = () => setIndex((i) => (i + 1) % slides.length)
    // View Transitions run only for non-urgent updates (transitions, Suspense reveals)
    if (animate) startTransition(update)
    else update()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button onClick={next}>Avanti →</Button>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={animate} onChange={(e) => setAnimate(e.target.checked)} />
          usa startTransition
        </label>
      </div>
      {/* Snapshots the old and new DOM and cross-fades between them */}
      <ViewTransition>
        <div className={cn('max-w-sm rounded-xl p-6 text-white', slide.color)}>
          <p className="text-2xl font-bold">{slide.title}</p>
          <p className="text-sm opacity-90">{slide.text}</p>
        </div>
      </ViewTransition>
    </div>
  )
}
