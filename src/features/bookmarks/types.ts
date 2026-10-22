/** A saved note page. */
export type Bookmark = {
  /** Route path, e.g. "/routing" — also the unique key */
  path: string
  title: string
  /** Epoch milliseconds */
  addedAt: number
}
