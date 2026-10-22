import { LikeButton } from './LikeButton'
import { QuantityPicker } from './QuantityPicker'

export function BasicCustomHookDemo() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <LikeButton />
      <QuantityPicker />
    </div>
  )
}
