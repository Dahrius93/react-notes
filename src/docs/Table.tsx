import type { ReactNode } from 'react'

type TableProps = {
  head: string[]
  /** Plain strings; text between backticks is rendered as inline code */
  rows: string[][]
}

/** 'use `[...arr, x]` here' → ['use ', <code>[...arr, x]</code>, ' here'] */
function renderInline(text: string): ReactNode {
  return text.split('`').map((part, i) => (i % 2 === 1 ? <code key={i}>{part}</code> : part))
}

export function Table({ head, rows }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-xl ring-1 ring-zinc-200 dark:ring-zinc-800">
      <table className="prose-notes w-full text-left text-sm">
        <thead className="bg-zinc-50 dark:bg-zinc-900">
          <tr>
            {head.map((cell, i) => (
              <th key={i} className="px-4 py-2 font-semibold text-zinc-900 dark:text-zinc-100">
                {renderInline(cell)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2 align-top">
                  {renderInline(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
