
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { isLegacyRoute, sanitizePathname } from '../utils/routeValidator.js';
import { isValidSlug } from '../../utils/pageLoader.js';
import { isAppRegisteredDynamicRoute, isAppRegisteredStaticRoute } from '../routing/routeCatalog.js';

export const RouteGuard = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const path = sanitizePathname(location.pathname);

    if (isLegacyRoute(path)) {
      return;
    }

    if (isAppRegisteredStaticRoute(path)) {
      return;
    }

    if (isAppRegisteredDynamicRoute(path)) {
      return;
    }

    if (isValidSlug(path)) {
      return;
    }

    console.warn(`[RouteGuard] Invalid route detected: "${path}". Redirecting to 404.`);
    navigate('/404', { replace: true });
  }, [location.pathname, navigate]);

  return <>{children}</>;
};
