import { useCallback, useEffect, useState } from 'react'

/**
 * Copies text to the clipboard and exposes a `copied` flag
 * that resets automatically after `resetAfterMs`.
 */
export function useCopyToClipboard(resetAfterMs = 2000) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => setCopied(false), resetAfterMs)
    return () => clearTimeout(id)
  }, [copied, resetAfterMs])

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      return true
    } catch {
      setCopied(false)
      return false
    }
  }, [])

  return { copied, copy }
}
