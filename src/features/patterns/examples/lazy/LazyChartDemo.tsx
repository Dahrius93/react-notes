import { lazy, Suspense } from 'react'
import { useToggle } from '@/shared/hooks/useToggle'
import { sleep } from '@/shared/lib/sleep'
import { Button } from '@/shared/ui/Button'
import { Spinner } from '@/shared/ui/Spinner'

// One shared promise: preloading and lazy() reuse the same download.
// (The sleep only makes the download visible in the demo.)
let chartModule: Promise<typeof import('./SalesChart')> | undefined
const loadChart = () => (chartModule ??= sleep(1000).then(() => import('./SalesChart')))

// The import starts only the first time <SalesChart> is rendered (or on preload)
const SalesChart = lazy(loadChart)

export function LazyChartDemo() {
  const [isVisible, { toggle }] = useToggle()

  return (
    <div className="space-y-4">
      {/* Preload on hover: by the time the user clicks, the code may already be there */}
      <Button onClick={toggle} onMouseEnter={() => void loadChart()}>
        {isVisible ? 'Nascondi grafico' : 'Mostra grafico'}
      </Button>
      {isVisible && (
        <Suspense fallback={<Spinner label="Scaricamento del codice del grafico…" />}>
          <SalesChart />
        </Suspense>
      )}
    </div>
  )
}
