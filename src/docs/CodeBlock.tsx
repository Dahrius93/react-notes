import { Highlight, themes } from 'prism-react-renderer'
import { useCopyToClipboard } from '@/shared/hooks/useCopyToClipboard'
import { cn } from '@/shared/lib/cn'

type CodeBlockProps = {
  code: string
  language?: 'tsx' | 'ts' | 'jsx' | 'bash' | 'json' | 'css'
  filename?: string
  className?: string
}

export function CodeBlock({ code, language = 'tsx', filename, className }: CodeBlockProps) {
  const { copied, copy } = useCopyToClipboard()
  const source = code.trim()

  return (
    <div className={cn('overflow-hidden rounded-xl bg-[#011627] ring-1 ring-zinc-800', className)}>
      <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-2">
        <span className="truncate font-mono text-xs text-zinc-400">{filename ?? language}</span>
        <button
          type="button"
          onClick={() => copy(source)}
          className="rounded px-2 py-1 text-xs text-zinc-400 hover:bg-white/10 hover:text-white"
        >
          {copied ? 'Copiato ✓' : 'Copia'}
        </button>
      </div>
      <Highlight code={source} language={language} theme={themes.nightOwl}>
        {({ className: highlightClass, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={cn(highlightClass, 'max-h-[36rem] overflow-auto py-3 font-mono text-[13px] leading-6')}
            style={{ ...style, background: 'transparent' }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })} className="px-4">
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  )
}

/** Side-by-side "don't / do" comparison of two snippets. */
export function CodeCompare({ bad, good, language }: { bad: string; good: string; language?: CodeBlockProps['language'] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div>
        <p className="mb-2 text-sm font-semibold text-red-600 dark:text-red-400">✗ Da evitare</p>
        <CodeBlock code={bad} language={language} />
      </div>
      <div>
        <p className="mb-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">✓ Meglio così</p>
        <CodeBlock code={good} language={language} />
      </div>
    </div>
  )
}
