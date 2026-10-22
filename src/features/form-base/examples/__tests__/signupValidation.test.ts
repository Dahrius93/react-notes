import { describe, expect, it } from 'vitest'
import { initialSignupValues, validateSignup, type SignupValues } from '../signupValidation'

const validValues: SignupValues = {
  ...initialSignupValues,
  name: 'Ada Lovelace',
  username: 'ada_l',
  email: 'ada@example.com',
  role: 'frontend',
  terms: true,
}

describe('validateSignup', () => {
  it('returns no errors for valid values', () => {
    expect(validateSignup(validValues)).toEqual({})
  })

  it('requires the mandatory fields', () => {
    expect(Object.keys(validateSignup(initialSignupValues))).toEqual(['name', 'username', 'email', 'role', 'terms'])
  })

  it('validates the website only when filled', () => {
    expect(validateSignup({ ...validValues, website: '' }).website).toBeUndefined()
    expect(validateSignup({ ...validValues, website: 'esempio.it' }).website).toBeDefined()
  })

  it('rejects usernames with uppercase letters or spaces', () => {
    expect(validateSignup({ ...validValues, username: 'Ada L' }).username).toBeDefined()
  })
})
