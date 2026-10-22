/**
 * Docs tool: keeps the main thread busy for `ms` milliseconds,
 * to simulate a component with an expensive render in the demos.
 * Never use this in real code.
 */
export function blockFor(ms: number) {
  const end = performance.now() + ms
  while (performance.now() < end) {
    // busy wait
  }
}
