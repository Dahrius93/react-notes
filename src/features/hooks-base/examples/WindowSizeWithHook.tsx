import { useWindowSize } from '@/shared/hooks/useWindowSize'

// Same behaviour as WindowSizeManual: the effect and its cleanup live in the hook
export function WindowSizeWithHook() {
  const { width, height } = useWindowSize()
  const device = width < 640 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop'

  return (
    <div>
      <p className="font-mono text-3xl font-bold tabular-nums">
        {width} × {height}
      </p>
      <p className="mt-2 text-sm text-zinc-500">
        Layout: <strong>{device}</strong>
      </p>
    </div>
  )
}
