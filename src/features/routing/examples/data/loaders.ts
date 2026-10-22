import { data, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from 'react-router'
import { HttpError } from '@/shared/api/http'
import { createPost, getPostsByUser } from '@/shared/api/jsonplaceholder/posts'
import { getUser, getUsers } from '@/shared/api/jsonplaceholder/users'
import { sleep } from '@/shared/lib/sleep'

const DEMO_LATENCY = 600 // makes the pending state visible

// A loader runs BEFORE the route renders. `request.signal` aborts it if the user navigates away.
export async function usersLoader({ request }: LoaderFunctionArgs) {
  await sleep(DEMO_LATENCY, request.signal)
  const users = await getUsers({ signal: request.signal })
  return { users }
}

export async function userLoader({ params, request }: LoaderFunctionArgs) {
  const id = Number(params.userId)
  // Throwing a Response/data() renders the nearest ErrorBoundary with that status
  if (!Number.isInteger(id)) throw data('Id non valido', { status: 400 })

  await sleep(DEMO_LATENCY, request.signal)
  try {
    // Parallel requests: the page renders only when both are ready
    const [user, posts] = await Promise.all([
      getUser(id, { signal: request.signal }),
      getPostsByUser(id, { signal: request.signal }),
    ])
    return { user, posts }
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) throw data('Utente non trovato', { status: 404 })
    throw error
  }
}

export type NewPostErrors = { title?: string; body?: string }

// An action handles a <Form method="post">: it receives the form data as a Request
export async function newPostAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const title = String(formData.get('title') ?? '').trim()
  const body = String(formData.get('body') ?? '').trim()

  const errors: NewPostErrors = {}
  if (title.length < 3) errors.title = 'Almeno 3 caratteri'
  if (!body) errors.body = 'Il testo è obbligatorio'
  // Returned data → useActionData() in the component
  if (Object.keys(errors).length > 0) return { errors }

  await sleep(DEMO_LATENCY)
  const post = await createPost({ userId: 1, title, body })
  // After a successful action: redirect. Loaders of the target page run again.
  return redirect(`/?created=${post.id}`)
}
