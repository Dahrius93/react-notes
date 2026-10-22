import { useState, type FormEvent } from 'react'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { calculateTotals, formatEuro, type CartItem } from './cartLogic'
import { validateCoupon, type Coupon } from './couponService'

const initialItems: CartItem[] = [
  { id: 1, name: 'Tazza React', price: 12, quantity: 1 },
  { id: 2, name: 'Maglietta Vitest', price: 25, quantity: 2 },
]

export function CartSummary() {
  const [items, setItems] = useState(initialItems)
  const [code, setCode] = useState('')
  const [coupon, setCoupon] = useState<Coupon | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  const totals = calculateTotals(items, coupon?.percent)

  function changeQuantity(id: number, delta: number) {
    setItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0),
    )
  }

  async function applyCoupon(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsChecking(true)
    setError(null)
    try {
      setCoupon(await validateCoupon(code))
      setCode('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore')
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <section aria-label="Carrello" className="max-w-md space-y-4">
      {items.length === 0 ? (
        <p className="text-sm text-zinc-500">Il carrello è vuoto.</p>
      ) : (
        <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-2 py-2 text-sm">
              <span className="flex-1">{item.name}</span>
              <Button size="sm" variant="ghost" aria-label={`Diminuisci ${item.name}`} onClick={() => changeQuantity(item.id, -1)}>
                −
              </Button>
              <span aria-label={`Quantità di ${item.name}`} className="w-6 text-center tabular-nums">
                {item.quantity}
              </span>
              <Button size="sm" variant="ghost" aria-label={`Aumenta ${item.name}`} onClick={() => changeQuantity(item.id, 1)}>
                +
              </Button>
              <span className="w-20 text-right tabular-nums">{formatEuro(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={applyCoupon} className="flex items-start gap-2">
        <div className="flex-1">
          <Input
            label="Codice sconto"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            hint="Prova REACT10 o VITEST20"
            error={error ?? undefined}
          />
        </div>
        <Button type="submit" className="mt-6.5" disabled={isChecking || !code.trim()}>
          {isChecking ? 'Verifica…' : 'Applica'}
        </Button>
      </form>

      <dl className="grid grid-cols-[1fr_auto] gap-1 text-sm">
        <dt>Subtotale</dt>
        <dd className="text-right tabular-nums">{formatEuro(totals.subtotal)}</dd>
        {coupon && (
          <>
            <dt>Sconto {coupon.code} (−{coupon.percent}%)</dt>
            <dd className="text-right tabular-nums">−{formatEuro(totals.discount)}</dd>
          </>
        )}
        <dt className="font-semibold">Totale</dt>
        <dd className="text-right font-semibold tabular-nums" data-testid="cart-total">
          {formatEuro(totals.total)}
        </dd>
      </dl>
    </section>
  )
}
