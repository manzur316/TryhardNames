import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Keep old generator links and their presentation prefill working.
export default function IdentityKitPage() {
  const { search } = useLocation();
  return <Navigate to={`/gaming-passport${search}`} replace />;
}
