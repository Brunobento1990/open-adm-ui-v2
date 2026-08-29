import { useLocation, useNavigate } from 'react-router-dom';

export function useNavigationApp() {
  const usenavigate = useNavigate();
  const location = useLocation()

  function navigate(url?: string, replace?: boolean, state?: any) {
    if (url) usenavigate(url, { replace, state });
  }

  return {
    pathName: location.pathname,
    navigate
  }
}
