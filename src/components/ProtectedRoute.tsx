import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

type ProtectedRouteProps = {
  redirectPath?: string;
};

export default function ProtectedRoute({
  redirectPath = "/login",
}: ProtectedRouteProps) {
  const { user, userProfile, loading, hasCompletedSetup } = useAuth();
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

  // Use the hasCompletedSetup function directly which already checks both localStorage and profile data
  const setupCompleted = hasCompletedSetup();

  console.log("ProtectedRoute: Setup completion check result:", setupCompleted);

  // Redirect to kingdom setup if user hasn't completed setup
  // Skip this check if already on the setup page to avoid redirect loops
  if (!setupCompleted && location.pathname !== "/setup-kingdom") {
    // Check if we should force a direct check of the database
    const shouldCheckDatabase = !userProfile?.race && !userProfile?.kingdomName;

    if (shouldCheckDatabase) {
      // We'll do a direct database check in the component
      console.log(
        "ProtectedRoute: Will check database directly for setup status",
      );
    } else {
      console.log("ProtectedRoute: Setup not completed, redirecting to setup");
      // Remove any flags that might prevent redirection
      localStorage.removeItem("redirectedToSetup");
      return (
        <Navigate to="/setup-kingdom" replace state={{ from: location }} />
      );
    }
  }

  // If setup is already completed, redirect to dashboard from setup page
  if (setupCompleted) {
    // If user is on setup page, redirect to dashboard
    if (location.pathname === "/setup-kingdom") {
      console.log(
        "ProtectedRoute: Setup already completed, redirecting to dashboard",
      );
      // Store in localStorage to prevent future redirects
      localStorage.setItem("setupCompleted", "true");
      return <Navigate to="/dashboard" replace />;
    }
    // If user just logged in (coming from login), redirect to dashboard
    if (location.state?.from?.pathname === "/login") {
      console.log(
        "ProtectedRoute: User logged in and setup already completed, redirecting to dashboard",
      );
      // Store in localStorage to prevent future redirects
      localStorage.setItem("setupCompleted", "true");
      return <Navigate to="/dashboard" replace />;
    }
  }

  console.log("ProtectedRoute: All checks passed, rendering outlet");
  // Render children routes if authenticated
  return <Outlet />;
}
