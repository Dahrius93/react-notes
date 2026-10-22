/** Sieve of Eratosthenes: a real, CPU-heavy computation for the useMemo demo. */
export function countPrimes(limit: number): number {
  const isComposite = new Uint8Array(limit + 1)
  let count = 0
  for (let i = 2; i <= limit; i++) {
    if (isComposite[i]) continue
    count++
    for (let j = i * i; j <= limit; j += i) isComposite[j] = 1
  }
  return count
}
