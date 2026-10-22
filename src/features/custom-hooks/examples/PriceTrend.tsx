import { useState } from 'react'
import { usePrevious } from '@/shared/hooks/usePrevious'
import { Button } from '@/shared/ui/Button'

export function PriceTrend() {
  const [price, setPrice] = useState(100)
  const previous = usePrevious(price)

  const trend = previous === undefined || previous === price ? '–' : price > previous ? '▲' : '▼'
  const trendColor = trend === '▲' ? 'text-emerald-600' : trend === '▼' ? 'text-red-600' : 'text-zinc-400'

  return (
    <div className="flex flex-col items-start gap-4">
      <p className="flex items-baseline gap-3">
        <span className="font-mono text-5xl font-bold tabular-nums">{price} €</span>
        <span className={`text-2xl ${trendColor}`}>{trend}</span>
      </p>
      <p className="text-sm text-zinc-500">Prezzo precedente: {previous === undefined ? '—' : `${previous} €`}</p>
      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => setPrice((p) => p - 5)}>
          −5
        </Button>
        <Button variant="secondary" onClick={() => setPrice((p) => p + 5)}>
          +5
        </Button>
        <Button variant="ghost" onClick={() => setPrice(Math.round(50 + Math.random() * 100))}>
          Casuale
        </Button>
      </div>
    </div>
  )
}
