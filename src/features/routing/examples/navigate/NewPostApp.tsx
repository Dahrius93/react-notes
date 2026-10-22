import { useState, type FormEvent } from 'react'
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router'
import { createPost } from '@/shared/api/jsonplaceholder/posts'
import type { Post } from '@/shared/api/jsonplaceholder/types'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'

function Board() {
  return (
    <div className="space-y-2 text-sm">
      <p>La bacheca è vuota.</p>
      <Link to="/new" className="font-medium text-sky-700 hover:underline dark:text-sky-400">
        + Scrivi un post
      </Link>
    </div>
  )
}

function NewPost() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSaving(true)
    const post = await createPost({ userId: 1, title, body: '...' })
    // Navigate from code after the async work, passing data in `state`
    navigate('/created', { state: { post } })
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm space-y-3">
      <Input label="Titolo" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <div className="flex gap-2">
        <Button type="submit" disabled={isSaving || !title.trim()}>
          {isSaving ? 'Salvataggio…' : 'Pubblica'}
        </Button>
        {/* -1 = like the browser's Back button */}
        <Button variant="ghost" onClick={() => navigate(-1)}>
          Annulla
        </Button>
      </div>
    </form>
  )
}

function Created() {
  const location = useLocation()
  const post = (location.state as { post?: Post } | null)?.post

  // Opened directly (or after a reload of a page without state): nothing to show.
  // <Navigate> is the declarative version of navigate(), for use while rendering.
  if (!post) return <Navigate to="/" replace />

  return (
    <div className="space-y-2 text-sm">
      <p className="font-medium text-emerald-700 dark:text-emerald-400">
        ✓ Pubblicato “{post.title}” (id {post.id})
      </p>
      <Link to="/" className="text-sky-700 hover:underline dark:text-sky-400">
        Torna alla bacheca
      </Link>
    </div>
  )
}

export function NewPostApp() {
  return (
    <Routes>
      <Route path="/" element={<Board />} />
      <Route path="/new" element={<NewPost />} />
      <Route path="/created" element={<Created />} />
    </Routes>
  )
}
