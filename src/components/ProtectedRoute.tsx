
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Loading from "@/components/Loading";

interface ProtectedRouteProps {
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ requireAdmin = false }: ProtectedRouteProps) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!requireAdmin && isAdmin) {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
