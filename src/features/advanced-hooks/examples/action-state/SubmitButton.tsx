import type { ReactNode } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/shared/ui/Button'

/**
 * Knows by itself whether its <form> is submitting: useFormStatus reads the
 * status of the PARENT form, so it must be rendered inside it. No props needed.
 */
export function SubmitButton({ children, pendingText }: { children: ReactNode; pendingText: string }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? pendingText : children}
    </Button>
  )
}
