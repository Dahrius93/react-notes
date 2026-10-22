import { describe, expect, it } from 'vitest'

/*
 * Architecture rules, checked on the real source files.
 * Allowed direction of imports:   app → features → shared,   docs → shared
 * `?raw` imports are ignored: pages show other files' source code, they don't depend on it.
 */

const sources = import.meta.glob<string>('/src/**/*.{ts,tsx}', { query: '?raw', import: 'default', eager: true })

/** Cross-feature imports we accept on purpose (documented in the Architecture page). */
const allowedFeatureDependencies: Record<string, string[]> = {
  context: ['auth', 'reducer'], // the Context page reuses the auth feature and the todos reducer
  routing: ['auth'], // protected routes use the auth feature
  architecture: ['bookmarks'], // the Architecture page demos the bookmarks feature
}

type ImportRecord = { file: string; target: string }

// Real import/export statements only (at the start of a line), not code shown as text in the pages.
// It's a text check, not a parser: good enough for this codebase, and much simpler.
const IMPORT_PATTERN = /^\s*(?:import|export)\s[^'"]*?from '(@\/[^']+)'/gm

function importsOf(folder: string): ImportRecord[] {
  return Object.entries(sources)
    .filter(([file]) => file.startsWith(`/src/${folder}/`))
    .flatMap(([file, code]) =>
      [...code.matchAll(IMPORT_PATTERN)]
        .map((match) => match[1])
        .filter((target) => !target.endsWith('?raw'))
        .map((target) => ({ file, target })),
    )
}

function violations(records: ImportRecord[], forbidden: RegExp) {
  return records.filter(({ target }) => forbidden.test(target)).map(({ file, target }) => `${file} → ${target}`)
}

describe('architecture', () => {
  it('finds the source files and their imports', () => {
    expect(Object.keys(sources).length).toBeGreaterThan(100)
    // Sanity check: a rule that finds no imports would always pass
    expect(importsOf('features').map((record) => record.target)).toContain('@/shared/ui/Button')
    expect(importsOf('context').length).toBe(0) // not a top-level folder
  })

  it('shared/ never imports from features/, app/ or docs/', () => {
    expect(violations(importsOf('shared'), /^@\/(features|app|docs)\//)).toEqual([])
  })

  it('docs/ never imports from features/ or app/', () => {
    expect(violations(importsOf('docs'), /^@\/(features|app)\//)).toEqual([])
  })

  it('features/ never import from app/', () => {
    expect(violations(importsOf('features'), /^@\/app\//)).toEqual([])
  })

  it('features import other features only through the allowed dependencies', () => {
    const unexpected = importsOf('features').filter(({ file, target }) => {
      const from = file.split('/')[3] // /src/features/<name>/...
      const to = target.match(/^@\/features\/([^/]+)/)?.[1]
      return to !== undefined && to !== from && !allowedFeatureDependencies[from]?.includes(to)
    })
    expect(unexpected.map(({ file, target }) => `${file} → ${target}`)).toEqual([])
  })
})
