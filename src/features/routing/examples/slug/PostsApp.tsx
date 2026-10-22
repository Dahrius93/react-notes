import { useEffect } from 'react'
import { Link, Navigate, Route, Routes, useParams } from 'react-router'
import { getPost, getPosts } from '@/shared/api/jsonplaceholder/posts'
import type { Post } from '@/shared/api/jsonplaceholder/types'
import { useAsync } from '@/shared/hooks/useAsync'
import { slugify } from '@/shared/lib/slugify'
import { Spinner } from '@/shared/ui/Spinner'

/** Canonical URL of a post: the id finds it, the slug makes it readable. */
function postPath(post: Post) {
  return `/posts/${post.id}/${slugify(post.title)}`
}

function PostsList() {
  const { data: posts, run } = useAsync<Post[]>()
  useEffect(() => void run(getPosts()), [run])

  if (!posts) return <Spinner />
  return (
    <ul className="space-y-1 text-sm">
      {posts.slice(0, 6).map((post) => (
        <li key={post.id}>
          <Link to={postPath(post)} className="text-sky-700 hover:underline dark:text-sky-400">
            {post.title}
          </Link>
        </li>
      ))}
    </ul>
  )
}

function PostDetail() {
  const { postId, slug } = useParams()
  const { data: post, error, run } = useAsync<Post>()

  useEffect(() => void run(getPost(Number(postId))), [postId, run])

  if (error) return <p className="text-red-600">Post non trovato</p>
  if (!post || post.id !== Number(postId)) return <Spinner />

  // Missing or outdated slug (e.g. the title changed): redirect to the canonical URL.
  // replace: the wrong URL doesn't stay in the history.
  const canonicalSlug = slugify(post.title)
  if (slug !== canonicalSlug) return <Navigate to={postPath(post)} replace />

  return (
    <article className="space-y-2 text-sm">
      <Link to="/posts" className="text-sky-700 hover:underline dark:text-sky-400">
        ← Tutti i post
      </Link>
      <h2 className="text-lg font-bold">{post.title}</h2>
      <p className="text-zinc-500">
        useParams() → <code>{JSON.stringify({ postId, slug })}</code>
      </p>
      <p>{post.body}</p>
    </article>
  )
}

export function PostsApp() {
  return (
    <Routes>
      <Route path="/posts" element={<PostsList />} />
      {/* "slug?" is optional: /posts/1 and /posts/1/any-text both match */}
      <Route path="/posts/:postId/:slug?" element={<PostDetail />} />
    </Routes>
  )
}
