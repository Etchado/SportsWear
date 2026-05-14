import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return null

  if (!user) {
    return (
      <Navigate
        to={`/auth?next=${encodeURIComponent(location.pathname + location.search)}`}
        replace
      />
    )
  }

  return children
}
