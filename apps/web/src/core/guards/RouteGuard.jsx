
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { isLegacyRoute, sanitizePathname } from '../utils/routeValidator.js';
import { isValidSlug } from '../../utils/pageLoader.js';

// Define all valid static routes from App.jsx
const validStaticRoutes = [
  '/',
  '/stylish-text-generator',
  '/nickname-symbols',
  '/roblox-names',
  '/roblox-names/cool',
  '/roblox-names/funny',
  '/roblox-names/aesthetic',
  '/roblox-names/tryhard',
  '/gamer-names',
  '/gamer-names/cool',
  '/gamer-names/funny',
  '/gamer-names/pro',
  '/gamer-names/edgy',
  '/about',
  '/contact',
  '/privacy-policy',
  '/terms-of-service',
  '/leaderboards',
  '/favorites'
];

export const RouteGuard = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const path = sanitizePathname(location.pathname);
    
    // 1. If it's a legacy route, do nothing here. 
    // The LegacyRouteHandler component will catch it and perform a 301 redirect.
    if (isLegacyRoute(path)) {
      return;
    }

    // 2. Check if it's a valid static route
    if (validStaticRoutes.includes(path)) {
      return;
    }

    // 3. Check if it's a valid dynamic slug (multi-segment format: /category/keyword)
    // Remove leading slash and validate
    if (isValidSlug(path)) {
      return;
    }

    // 4. If neither static nor dynamic, it's invalid - redirect to 404
    console.warn(`[RouteGuard] Invalid route detected: "${path}". Redirecting to 404.`);
    navigate('/404', { replace: true });
  }, [location.pathname, navigate]);

  return <>{children}</>;
};
