import { describe, expect, it } from 'vitest'
import { hasMinLength, isBlank, isEmail, isUrl } from '../validators'

describe('validators', () => {
  it('isBlank ignores whitespace', () => {
    expect(isBlank('   ')).toBe(true)
    expect(isBlank(' a ')).toBe(false)
  })

  it.each([
    ['ada@example.com', true],
    ['ada.lovelace@mail.example.it', true],
    ['ada@example', false],
    ['ada example.com', false],
    ['@example.com', false],
  ])('isEmail(%s) → %s', (value, expected) => {
    expect(isEmail(value)).toBe(expected)
  })

  it.each([
    ['https://example.com', true],
    ['http://localhost:5173/path', true],
    ['example.com', false],
    ['ftp://example.com', false],
  ])('isUrl(%s) → %s', (value, expected) => {
    expect(isUrl(value)).toBe(expected)
  })

  it('hasMinLength trims the value', () => {
    expect(hasMinLength(' ab ', 2)).toBe(true)
    expect(hasMinLength(' a ', 2)).toBe(false)
  })
})
