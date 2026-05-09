import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const LEGACY_ROUTE_MAP = {
  '/cool-names': '/gamer-names/cool',
  '/funny-names': '/gamer-names/funny',
  '/valorant-names': '/gamer-names',
  '/fortnite-names': '/gamer-names',
  '/fortnite-tryhard-names': '/gamer-names',
  '/cool-gamer-bio': '/gamer-bio-generator',
  '/funny-gamer-bio': '/gamer-bio-generator',
  '/roblox-names-generator': '/roblox-names',
  '/roblox-cool-names': '/roblox-names/cool',
  '/roblox-funny-names': '/roblox-names/funny',
  '/roblox-aesthetic-names': '/roblox-names/aesthetic',
  '/roblox-tryhard-names': '/roblox-names/tryhard',
  '/gamer-names-generator': '/gamer-names',
  '/cool-gamer-names': '/gamer-names/cool',
  '/funny-gamer-names': '/gamer-names/funny',
  '/pro-gamer-names': '/gamer-names/pro',
  '/edgy-gamer-names': '/gamer-names/edgy',
  '/league-of-legends-names': '/league-of-legends',
};

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