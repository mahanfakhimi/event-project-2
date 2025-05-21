import { Navigate } from "react-router";
import { CircularProgress, Box } from "@mui/material";
import { useUser } from "../api/auth";

const ProtectedRoute = ({ children, isAdmin = false }) => {
  const { data: user, isLoading: isLoadingUser } = useUser();

  if (isLoadingUser) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (isAdmin && !user.isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
