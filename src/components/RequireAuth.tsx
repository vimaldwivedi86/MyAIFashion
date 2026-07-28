import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getUser } from '../lib/auth';

export default function RequireAuth({ children }: { children: ReactNode }) {
  const user = getUser();
  const location = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}
