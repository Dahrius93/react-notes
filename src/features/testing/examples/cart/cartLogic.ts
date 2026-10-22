export type CartItem = {
  id: number
  name: string
  price: number // euro
  quantity: number
}

export type CartTotals = {
  subtotal: number
  discount: number
  total: number
}

/** Pure function: the easiest thing in the world to test. */
export function calculateTotals(items: readonly CartItem[], discountPercent = 0): CartTotals {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  // Round to cents to avoid 0.1 + 0.2 = 0.30000000000000004
  const discount = Math.round(subtotal * discountPercent) / 100
  return { subtotal, discount, total: Math.round((subtotal - discount) * 100) / 100 }
}

const euroFormatter = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' })

export function formatEuro(value: number): string {
  return euroFormatter.format(value)
}
