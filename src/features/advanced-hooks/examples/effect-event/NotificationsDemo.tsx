import { useEffect, useEffectEvent, useState, type Dispatch, type SetStateAction } from 'react'
import { Button } from '@/shared/ui/Button'

type RoomProps = {
  roomId: string
  muted: boolean
  setLog: Dispatch<SetStateAction<string[]>>
}

function Room({ roomId, muted, setLog }: RoomProps) {
  // An "effect event": reads the LATEST `muted`, but it is not reactive,
  // so it doesn't belong in the dependencies and doesn't restart the effect
  const onMessage = useEffectEvent((text: string) => {
    setLog((prev) => [...prev, muted ? `🔕 ${text} (silenziato)` : `🔔 ${text}`])
  })

  useEffect(() => {
    setLog((prev) => [...prev, `✅ Connesso a #${roomId}`])
    const id = setInterval(() => onMessage(`messaggio in #${roomId}`), 1500)
    return () => {
      clearInterval(id)
      setLog((prev) => [...prev, `❌ Disconnesso da #${roomId}`])
    }
  }, [roomId, setLog]) // `muted` is NOT here: changing it doesn't reconnect

  return null
}

export function NotificationsDemo() {
  const [roomId, setRoomId] = useState('generale')
  const [muted, setMuted] = useState(false)
  const [log, setLog] = useState<string[]>([])

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-3">
        <div className="flex gap-2">
          {['generale', 'react'].map((room) => (
            <Button key={room} size="sm" variant={room === roomId ? 'primary' : 'secondary'} onClick={() => setRoomId(room)}>
              #{room}
            </Button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={muted} onChange={(e) => setMuted(e.target.checked)} />
          Silenzia notifiche
        </label>
        <Room roomId={roomId} muted={muted} setLog={setLog} />
      </div>
      <ol className="h-40 overflow-auto rounded-lg bg-zinc-100 p-3 font-mono text-xs dark:bg-zinc-900">
        {log.slice(-12).map((entry, i) => (
          <li key={i}>{entry}</li>
        ))}
      </ol>
    </div>
  )
}
