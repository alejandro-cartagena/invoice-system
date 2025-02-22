import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loading from './Loading';

export function RequireAdmin({ children }) {
  const { token, isAdmin, loading } = useAuth();

  if (loading) {
    return <Loading />; // Or use a proper loading component
  }

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
} 