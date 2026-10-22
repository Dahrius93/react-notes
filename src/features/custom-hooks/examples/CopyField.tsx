import { useState } from 'react'
import { useCopyToClipboard } from '@/shared/hooks/useCopyToClipboard'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'

export function CopyField() {
  const [text, setText] = useState('npm create vite@latest my-app -- --template react-ts')
  const { copied, copy } = useCopyToClipboard(1500)

  return (
    <div className="flex max-w-xl items-end gap-2">
      <div className="flex-1">
        <Input label="Testo da copiare" value={text} onChange={(e) => setText(e.target.value)} className="font-mono" />
      </div>
      <Button variant={copied ? 'secondary' : 'primary'} onClick={() => copy(text)} className="w-28">
        {copied ? 'Copiato ✓' : 'Copia'}
      </Button>
    </div>
  )
}
