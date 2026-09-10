import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
export function PrivateRoute() {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/" replace state={{ from: location }} />;
  return <Outlet />;
}
export function TeacherRoute() {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/" replace state={{ from: location }} />;
  if (user.role !== 'professor') return <Navigate to="/posts" replace />;
  return <Outlet />;
}
