import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { faIR } from "date-fns/locale";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import { SnackbarProvider } from "notistack";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import PollDetails from "./pages/PollDetails";
import CreatePoll from "./pages/CreatePoll";
import Profile from "./pages/Profile";
import AdminPanel from "./pages/AdminPanel";

// Components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./guards/ProtectedRoute";
import GuestGuard from "./guards/GuestGuard";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const rtlCache = createCache({
  key: "mui-rtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <CacheProvider value={rtlCache}>
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={faIR}
          >
            <SnackbarProvider
              maxSnack={3}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <Router>
                <div className="min-h-screen bg-gray-50">
                  <Navbar />
                  <Routes>
                    {/* Public Routes */}
                    <Route
                      path="/login"
                      element={
                        <GuestGuard>
                          <Login />
                        </GuestGuard>
                      }
                    />
                    <Route
                      path="/register"
                      element={
                        <GuestGuard>
                          <Register />
                        </GuestGuard>
                      }
                    />
                    <Route
                      path="/forgot-password"
                      element={
                        <GuestGuard>
                          <ForgotPassword />
                        </GuestGuard>
                      }
                    />
                    <Route
                      path="/reset-password"
                      element={
                        <GuestGuard>
                          <ResetPassword />
                        </GuestGuard>
                      }
                    />

                    {/* Protected Routes */}
                    <Route
                      path="/"
                      element={
                        <ProtectedRoute>
                          <Home />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/polls/:id"
                      element={
                        <ProtectedRoute>
                          <PollDetails />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/create"
                      element={
                        <ProtectedRoute isAdmin>
                          <CreatePoll />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute isAdmin>
                          <AdminPanel />
                        </ProtectedRoute>
                      }
                    />

                    {/* Fallback Route */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </div>
              </Router>
            </SnackbarProvider>
          </LocalizationProvider>
        </CacheProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
