// Small predicates for hand-written validation. For schemas, use Zod.

export function isBlank(value: string): boolean {
  return value.trim() === ''
}

// Pragmatic check (something@something.tld), not a full RFC 5322 parser
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function isEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim())
}

export function isUrl(value: string): boolean {
  try {
    const url = new URL(value.trim())
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export function hasMinLength(value: string, min: number): boolean {
  return value.trim().length >= min
}
