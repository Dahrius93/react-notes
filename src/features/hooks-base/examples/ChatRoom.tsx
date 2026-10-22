import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import { useToggle } from '@/shared/hooks/useToggle'
import { Button } from '@/shared/ui/Button'

// A fake "external system": in a real app this could be a WebSocket
function createConnection(roomId: string, log: (message: string) => void) {
  return {
    connect: () => log(`✅ Connesso a #${roomId}`),
    disconnect: () => log(`❌ Disconnesso da #${roomId}`),
  }
}

type RoomProps = {
  roomId: string
  setLog: Dispatch<SetStateAction<string[]>>
}

function Room({ roomId, setLog }: RoomProps) {
  useEffect(() => {
    const connection = createConnection(roomId, (message) => setLog((prev) => [...prev, message]))
    connection.connect()
    // Cleanup: runs before the next effect (roomId changed) and on unmount
    return () => connection.disconnect()
  }, [roomId, setLog]) // setLog is a state setter: stable, never re-triggers the effect

  return (
    <p className="text-sm">
      Sei nella stanza <strong>#{roomId}</strong>
    </p>
  )
}

const rooms = ['generale', 'react', 'off-topic']

export function ChatRoom() {
  const [roomId, setRoomId] = useState(rooms[0])
  const [isOpen, { toggle }] = useToggle(true)
  const [log, setLog] = useState<string[]>([])

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {rooms.map((room) => (
            <Button
              key={room}
              size="sm"
              variant={room === roomId ? 'primary' : 'secondary'}
              onClick={() => setRoomId(room)}
            >
              #{room}
            </Button>
          ))}
        </div>
        <Button variant="secondary" size="sm" onClick={toggle}>
          {isOpen ? 'Chiudi chat (unmount)' : 'Apri chat (mount)'}
        </Button>
        {isOpen && <Room roomId={roomId} setLog={setLog} />}
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Log degli effetti</p>
          <Button variant="ghost" size="sm" onClick={() => setLog([])}>
            Pulisci
          </Button>
        </div>
        <ol className="h-40 overflow-auto rounded-lg bg-zinc-100 p-3 font-mono text-xs dark:bg-zinc-900">
          {log.map((entry, i) => (
            <li key={i}>{entry}</li>
          ))}
        </ol>
      </div>
    </div>
  )
}
