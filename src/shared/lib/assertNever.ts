/**
 * Exhaustiveness check for discriminated unions.
 * If a `switch` forgets a case, `value` is not `never` and TypeScript reports an error.
 *
 * @example
 * switch (action.type) {
 *   case 'added': ...
 *   case 'deleted': ...
 *   default: return assertNever(action)
 * }
 */
export function assertNever(value: never): never {
  throw new Error(`Unhandled case: ${JSON.stringify(value)}`)
}
