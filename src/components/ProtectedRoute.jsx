import { Navigate } from 'react-router-dom';
import useStore from '../store/useStore';

function ProtectedRoute({ children }) {
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
