import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useUser } from "../api/auth";

const GuestGuard = ({ children }) => {
  const navigate = useNavigate();
  const { data: user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && user) {
      navigate("/profile");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return !user ? children : null;
};

export default GuestGuard;
