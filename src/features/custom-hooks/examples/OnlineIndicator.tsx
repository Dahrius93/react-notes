import { useOnlineStatus } from '@/shared/hooks/useOnlineStatus'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'

function StatusBadge() {
  const isOnline = useOnlineStatus()
  return <Badge tone={isOnline ? 'success' : 'danger'}>{isOnline ? '● Online' : '● Offline'}</Badge>
}

function SaveButton() {
  const isOnline = useOnlineStatus()
  return (
    <Button disabled={!isOnline} onClick={() => alert('Salvato!')}>
      {isOnline ? 'Salva' : 'Riconnessione…'}
    </Button>
  )
}

// Two unrelated components reuse the same logic with a single line each
export function OnlineIndicator() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <StatusBadge />
      <SaveButton />
    </div>
  )
}
