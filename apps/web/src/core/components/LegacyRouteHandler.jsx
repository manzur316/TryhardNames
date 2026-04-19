import React from 'react';
import { useLegacyRouteRedirect } from '../middleware/legacyRouteHandler.js';

export const LegacyRouteHandler = ({ children }) => {
  // This hook will automatically detect legacy routes and redirect them
  useLegacyRouteRedirect();
  
  // Render children normally
  return <>{children}</>;
};