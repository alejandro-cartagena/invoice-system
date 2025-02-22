import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function PublicRoute({ children }) {
  const { token } = useAuth();
  
  if (token) {
    return <Navigate to="/admin" replace />;
  }

  return children;
} 