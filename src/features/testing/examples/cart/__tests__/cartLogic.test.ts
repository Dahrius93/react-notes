import { describe, expect, it } from 'vitest'
import { calculateTotals, formatEuro } from '../cartLogic'

describe('calculateTotals', () => {
  const items = [
    { id: 1, name: 'Tazza', price: 12, quantity: 1 },
    { id: 2, name: 'Maglietta', price: 25, quantity: 2 },
  ]

  it('sums price × quantity', () => {
    // Arrange (items above) → Act → Assert
    const totals = calculateTotals(items)
    expect(totals).toEqual({ subtotal: 62, discount: 0, total: 62 })
  })

  it('applies a percentage discount, rounded to cents', () => {
    expect(calculateTotals(items, 10)).toEqual({ subtotal: 62, discount: 6.2, total: 55.8 })
    expect(calculateTotals([{ id: 1, name: 'x', price: 0.1, quantity: 3 }], 0).total).toBe(0.3)
  })

  it('returns zero for an empty cart', () => {
    expect(calculateTotals([], 20).total).toBe(0)
  })
})

describe('formatEuro', () => {
  it('formats in Italian euro', () => {
    // Intl may use a non-breaking space between number and symbol
    const format = (value: number) => formatEuro(value).replace(/\s/g, ' ')
    expect(format(12345.5)).toBe('12.345,50 €')
    // Italian groups thousands only from 5 digits up (CLDR minimumGroupingDigits = 2):
    // this test caught a wrong assumption ("1.234,50 €") when it was first written
    expect(format(1234.5)).toBe('1234,50 €')
  })
})
