import { Spinner } from '@/shared/ui/Spinner'

/** Shown while the code of the first page is loading (initial lazy route). */
export function PageLoading() {
  return <Spinner className="m-10" />
}
