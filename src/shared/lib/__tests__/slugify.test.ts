import { describe, expect, it } from 'vitest'
import { slugify } from '../slugify'

describe('slugify', () => {
  it.each([
    ['Hello World', 'hello-world'],
    ['Città & Caffè: 10 idee!', 'citta-caffe-10-idee'],
    ['  --già  pronto--  ', 'gia-pronto'],
    ['sunt aut facere repellat provident', 'sunt-aut-facere-repellat-provident'],
  ])('slugify(%j) → %j', (input, expected) => {
    expect(slugify(input)).toBe(expected)
  })
})
