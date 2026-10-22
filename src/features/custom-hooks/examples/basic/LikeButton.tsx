import { Button } from '@/shared/ui/Button'
import { useCounter } from './useCounter'

export function LikeButton() {
  const { count, increment } = useCounter()
  return <Button onClick={increment}>♥ Mi piace ({count})</Button>
}
