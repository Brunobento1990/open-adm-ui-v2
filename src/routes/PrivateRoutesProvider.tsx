import { Navigate, Outlet } from 'react-router-dom'
import { MenuProvider } from '../context/MenuProvider'
import { useAuth } from '../hook/useAuth'
import { PublicRoutePath } from './appRoutes'

export function PrivateRoutesProvider() {
  const { isLoggedIn } = useAuth()

  if (!isLoggedIn) {
    return <Navigate to={PublicRoutePath.Login} replace />
  }

  return (
    <MenuProvider>
      <Outlet />
    </MenuProvider>
  )
}
