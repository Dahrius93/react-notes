import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useEventListener } from '@/shared/hooks/useEventListener'

type ModalProps = {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  /** Buttons at the bottom, e.g. Cancel / Confirm */
  footer?: ReactNode
}

/**
 * Accessible modal dialog rendered in a portal (in <body>), so no parent
 * `overflow: hidden`, `transform` or `z-index` can clip or cover it.
 * Closes on Escape and backdrop click, moves the focus inside, locks the page scroll,
 * makes the rest of the app inert and gives the focus back on close.
 */
export function Modal({ open, onClose, title, children, footer }: ModalProps) {
  const titleId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)

  useEventListener('keydown', (event) => {
    if (open && event.key === 'Escape') onClose()
  })

  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    const appRoot = document.getElementById('root')
    const previousOverflow = document.body.style.overflow

    dialogRef.current?.focus()
    document.body.style.overflow = 'hidden' // no scrolling behind the modal
    if (appRoot) appRoot.inert = true // Tab can't reach the page behind: a focus trap for free

    return () => {
      document.body.style.overflow = previousOverflow
      if (appRoot) appRoot.inert = false
      previouslyFocused?.focus() // back to the button that opened the modal
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-zinc-950/50 p-4"
      // Close only when the click is on the backdrop itself, not inside the dialog
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="w-full max-w-md space-y-4 rounded-xl bg-white p-6 shadow-xl outline-none dark:bg-zinc-900"
      >
        <h2 id={titleId} className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {title}
        </h2>
        <div className="text-sm text-zinc-700 dark:text-zinc-300">{children}</div>
        {footer && <div className="flex justify-end gap-2">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}
