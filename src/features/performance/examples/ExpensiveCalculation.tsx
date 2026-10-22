import { useMemo, useState } from 'react'
import { Button } from '@/shared/ui/Button'
import { countPrimes } from './slow'

type Result = { primes: number; ms: number; at: string }

function computePrimes(limit: number): Result {
  const start = performance.now()
  const primes = countPrimes(limit)
  return {
    primes,
    ms: Math.round(performance.now() - start),
    at: new Date().toLocaleTimeString('it-IT', { hour12: false, fractionalSecondDigits: 3 } as Intl.DateTimeFormatOptions),
  }
}

const limits = [1_000_000, 5_000_000, 10_000_000]

export function ExpensiveCalculation() {
  const [limit, setLimit] = useState(limits[1])
  const [useMemoEnabled, setUseMemoEnabled] = useState(true)
  const [clicks, setClicks] = useState(0) // unrelated state, only to cause renders

  // Recomputed only when `limit` changes
  const memoized = useMemo(() => computePrimes(limit), [limit])
  // Demo switch: without useMemo the computation runs on every render
  const result = useMemoEnabled ? memoized : computePrimes(limit)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <label className="flex items-center gap-2">
          Numeri primi fino a
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="rounded-md bg-white px-2 py-1 ring-1 ring-zinc-300 dark:bg-zinc-900 dark:ring-zinc-700"
          >
            {limits.map((l) => (
              <option key={l} value={l}>
                {l.toLocaleString('it-IT')}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={useMemoEnabled} onChange={(e) => setUseMemoEnabled(e.target.checked)} />
          useMemo
        </label>
      </div>

      <Button variant="secondary" onClick={() => setClicks((c) => c + 1)}>
        Render non correlato ({clicks})
      </Button>

      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-mono text-sm">
        <dt className="text-zinc-500">primi</dt>
        <dd>{result.primes.toLocaleString('it-IT')}</dd>
        <dt className="text-zinc-500">durata</dt>
        <dd>{result.ms} ms</dd>
        <dt className="text-zinc-500">calcolato alle</dt>
        <dd>{result.at}</dd>
      </dl>
    </div>
  )
}
