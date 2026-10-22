import { useMediaQuery } from '@/shared/hooks/useMediaQuery'
import { useWindowSize } from '@/shared/hooks/useWindowSize'
import { Badge } from '@/shared/ui/Badge'

function Row({ label, value }: { label: string; value: boolean }) {
  return (
    <li className="flex items-center justify-between gap-4 py-2">
      <code className="text-sm">{label}</code>
      <Badge tone={value ? 'success' : 'neutral'}>{value ? 'sì' : 'no'}</Badge>
    </li>
  )
}

export function MediaQueries() {
  const { width } = useWindowSize()
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const isTouch = useMediaQuery('(pointer: coarse)')

  return (
    <div className="max-w-md">
      <p className="mb-2 text-sm text-zinc-500">Larghezza finestra: {width}px</p>
      <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
        <Row label="(min-width: 1024px)" value={isDesktop} />
        <Row label="(prefers-color-scheme: dark)" value={prefersDark} />
        <Row label="(prefers-reduced-motion: reduce)" value={reducedMotion} />
        <Row label="(pointer: coarse)" value={isTouch} />
      </ul>
    </div>
  )
}
