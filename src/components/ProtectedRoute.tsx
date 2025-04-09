import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

type ProtectedRouteProps = {
  redirectPath?: string;
};

export default function ProtectedRoute({
  redirectPath = "/login",
}: ProtectedRouteProps) {
  const { user, loading, hasCompletedSetup } = useAuth();
  const location = useLocation();

  console.log(
    "ProtectedRoute: User:",
    !!user,
    "Loading:",
    loading,
    "Path:",
    location.pathname,
  );

  // Add a timeout to prevent infinite loading
  const [timeoutLoading, setTimeoutLoading] = useState(true);

  useEffect(() => {
    // If still loading after 5 seconds, force continue
    const timer = setTimeout(() => {
      if (loading) {
        console.log(
          "ProtectedRoute: Loading timeout reached, forcing continue",
        );
        setTimeoutLoading(false);
      }
    }, 5000);

    // If not loading, update our state immediately
    if (!loading) {
      setTimeoutLoading(false);
    }

    return () => clearTimeout(timer);
  }, [loading]);

  // Show loading state while checking authentication, but respect the timeout
  if (loading && timeoutLoading) {
    console.log("ProtectedRoute: Still loading, showing loading screen");
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-neuro-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-foreground font-medium">Loading authentication...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    console.log("ProtectedRoute: No user, redirecting to login");
    return <Navigate to={redirectPath} replace />;
  }

  // Redirect to kingdom setup if user hasn't completed setup
  // Skip this check if already on the setup page to avoid redirect loops
  if (!hasCompletedSetup() && location.pathname !== "/setup-kingdom") {
    console.log("ProtectedRoute: Setup not completed, redirecting to setup");
    // Store a flag in localStorage to prevent multiple redirects
    localStorage.setItem("redirectedToSetup", "true");
    return <Navigate to="/setup-kingdom" replace state={{ from: location }} />;
  }

  // If we're on the setup page but setup is already completed, redirect to dashboard
  if (
    (hasCompletedSetup() ||
      localStorage.getItem("kingdomSetupCompleted") === "true") &&
    location.pathname === "/setup-kingdom"
  ) {
    console.log(
      "ProtectedRoute: Setup already completed, redirecting to dashboard",
    );
    return <Navigate to="/dashboard" replace />;
  }

  console.log("ProtectedRoute: All checks passed, rendering outlet");
  // Render children routes if authenticated
  return <Outlet />;
}
