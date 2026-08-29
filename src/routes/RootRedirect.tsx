import { Navigate } from 'react-router-dom'
import { useAuth } from '../hook/useAuth'
import { PrivateRoutePath, PublicRoutePath } from './appRoutes'

export function RootRedirect() {
  const { isLoggedIn } = useAuth()

  const destination = isLoggedIn
    ? PrivateRoutePath.Dashboard
    : PublicRoutePath.Login

  return <Navigate to={destination} replace />
}
