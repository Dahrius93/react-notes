import { useDocumentTitle } from '@/shared/hooks/useDocumentTitle'
import { Badge } from '@/shared/ui/Badge'

export function ComingSoonPage({ title, summary }: { title: string; summary: string }) {
  useDocumentTitle(`${title} · React Notes`)

  return (
    <div className="max-w-3xl">
      <Badge tone="warning">In arrivo</Badge>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">{title}</h1>
      <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400">{summary}</p>
    </div>
  )
}
