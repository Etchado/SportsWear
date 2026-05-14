import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-light-bg dark:bg-dark-bg">
      <h1 className="text-8xl font-black" style={{ color: '#FF2D78' }}>404</h1>
      <p className="text-xl font-medium text-light-muted dark:text-dark-muted">Page not found</p>
      <Link to="/" className="mt-4 px-6 py-3 rounded-xl font-bold text-white" style={{ background: '#FF2D78' }}>
        Back to Home
      </Link>
    </div>
  )
}
