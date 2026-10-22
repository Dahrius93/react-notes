import { Link, Route, Routes } from 'react-router'
import { AboutPage, HomePage, NotFoundPage } from './pages'

export function App() {
  return (
    <div className="space-y-4">
      {/* <Link> changes the URL without reloading the page (an <a href> would reload everything) */}
      <nav className="flex gap-4 text-sm font-medium text-sky-700 dark:text-sky-400">
        <Link to="/">Home</Link>
        <Link to="/about">Chi siamo</Link>
        <Link to="/non-esiste">Link rotto</Link>
      </nav>

      {/* <Routes> looks at the current URL and renders the matching <Route> */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        {/* "*" matches anything else: the 404 page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  )
}
