import { Navigate } from "react-router";
import { useUser } from "../api/auth";

const AdminRoute = ({ children }) => {
  const { user, loading } = useUser();

  if (loading) {
    return null;
  }

  if (!user || !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
