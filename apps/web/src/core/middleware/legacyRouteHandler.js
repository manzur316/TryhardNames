import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { LEGACY_ROUTE_MAP } from '../routing/legacyRoutes.js';
export { LEGACY_ROUTE_MAP } from '../routing/legacyRoutes.js';

export const useLegacyRouteRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    
    // Normalize path by removing trailing slash if present (except for root)
    const normalizedPath = currentPath.endsWith('/') && currentPath.length > 1 
      ? currentPath.slice(0, -1) 
      : currentPath;

    if (LEGACY_ROUTE_MAP[normalizedPath]) {
      // Perform a replace redirect to avoid filling up browser history with legacy routes
      navigate(LEGACY_ROUTE_MAP[normalizedPath], { replace: true });
    }
  }, [location, navigate]);
};
