import { useAuth } from "../hooks/useAuth.js";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-4 border-secondary border-t-primary'></div>
      </div>
    );
  }

  return isAuthenticated ? (
    children
  ) : (
    <Navigate
      to='/login'
      replace
    />
  );
};

export const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-4 border-secondary border-t-primary'></div>
      </div>
    );
  }

  return isAuthenticated && user?.role === "admin" ? (
    children
  ) : (
    <Navigate
      to='/login'
      replace
    />
  );
};
