import { describe, expect, it } from 'vitest'
import { signInSchema } from '../basic/signInSchema'
import { invoiceSchema } from '../invoice/invoiceSchema'
import { signupSchema } from '../signup/signupSchema'

// Schemas are plain values: test them with safeParse, no React needed
describe('signInSchema', () => {
  it('accepts valid data and rejects invalid fields with the messages', () => {
    expect(signInSchema.safeParse({ email: 'ada@example.com', password: '12345678' }).success).toBe(true)

    const result = signInSchema.safeParse({ email: 'ada', password: '123' })
    expect(result.success).toBe(false)
    expect(result.error?.issues.map((issue) => issue.message)).toEqual([
      'Inserisci un’email valida',
      'Almeno 8 caratteri',
    ])
  })
})

describe('signupSchema', () => {
  const valid = {
    name: 'Ada Lovelace',
    username: 'ada_l',
    email: 'ada@example.com',
    website: '',
    role: 'frontend',
    bio: '',
    password: 'password1',
    confirmPassword: 'password1',
    newsletter: false,
    terms: true,
  }

  it('accepts a valid signup with an empty website', () => {
    expect(signupSchema.safeParse(valid).success).toBe(true)
  })

  it('reports mismatching passwords on confirmPassword, even when other fields are invalid', () => {
    const result = signupSchema.safeParse({ ...valid, name: '', confirmPassword: 'different' })
    const paths = result.error?.issues.map((issue) => issue.path.join('.'))
    expect(paths).toEqual(expect.arrayContaining(['name', 'confirmPassword']))
  })

  it('accepts only http(s) URLs', () => {
    expect(signupSchema.safeParse({ ...valid, website: 'https://example.com' }).success).toBe(true)
    expect(signupSchema.safeParse({ ...valid, website: 'ftp://example.com' }).success).toBe(false)
  })
})

describe('invoiceSchema', () => {
  it('validates every line and requires at least one', () => {
    expect(invoiceSchema.safeParse({ customer: 'ACME', lines: [] }).error?.issues[0].message).toBe(
      'Aggiungi almeno una riga',
    )
    const result = invoiceSchema.safeParse({ customer: 'ACME', lines: [{ description: 'x', quantity: Number.NaN, price: 1 }] })
    expect(result.error?.issues[0].path).toEqual(['lines', 0, 'quantity'])
  })
})
