import {
  AllCommunityModule,
  ModuleRegistry,
} from 'ag-grid-community'
import { Navigate, Route, Routes } from 'react-router-dom'
import { SnackbarApp } from './components/Snackbar/SnackbarApp'
import { AuthProvider } from './context/AuthProvider'
import { PrivateAppWrapper } from './layout/app/PrivateAppWrapper'
import { PublicAppWrapper } from './layout/app/PublicAppWrapper'
import { AppThemeProvider } from './layout/theme/ThemeProvider'
import { LoginPage } from './pages/public/LoginPage'
import { CadastrarSenhaPage } from './pages/public/CadastrarSenhaPage'
import { ComandaPublicaPage } from './pages/public/ComandaPublicaPage'
import { AppRoutePath, PublicRoutePath } from './routes/appRoutes'
import { privateRoutes } from './routes/privateRoutes'
import { PrivateRoutesProvider } from './routes/PrivateRoutesProvider'
import { RootRedirect } from './routes/RootRedirect'


ModuleRegistry.registerModules([
  AllCommunityModule,
]);

function App() {
  return (
    <AppThemeProvider>
      <AuthProvider>
        <Routes>
          <Route element={<PublicAppWrapper />}>
            <Route path={PublicRoutePath.Root} element={<RootRedirect />} />
            <Route path={PublicRoutePath.Login} element={<LoginPage />} />
            <Route path={PublicRoutePath.CadastrarSenha} element={<CadastrarSenhaPage />} />
            <Route path={PublicRoutePath.ComandaPublica} element={<ComandaPublicaPage />} />
          </Route>
          <Route element={<PrivateRoutesProvider />}>
            {privateRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <PrivateAppWrapper title={route.title}>
                    {route.component}
                  </PrivateAppWrapper>
                }
              />
            ))}
          </Route>
          <Route path={AppRoutePath.Wildcard} element={<Navigate to={PublicRoutePath.Login} replace />} />
        </Routes>
        <SnackbarApp />
      </AuthProvider>
    </AppThemeProvider>
  )
}

export default App
