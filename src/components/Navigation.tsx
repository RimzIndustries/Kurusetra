import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Castle,
  Building2,
  Coins,
  Sword,
  Users,
  Shield,
  LogOut,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";

const Navigation = () => {
  console.log("Navigation component rendered");
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user, updateNavigationTimestamp, userProfile } = useAuth();

  // Update navigation timestamp when location changes
  useEffect(() => {
    if (user && location.pathname) {
      console.log("Navigation path changed:", location.pathname);
      // Add a small delay to ensure the page has fully loaded
      const timer = setTimeout(() => {
        updateNavigationTimestamp(location.pathname);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [location.pathname, user, updateNavigationTimestamp]);

  const handleLogout = async () => {
    try {
      console.log("Logging out user...");
      // Clear any stored kingdom setup flags before signOut
      localStorage.removeItem("kingdomSetupCompleted");
      localStorage.removeItem("redirectedToSetup");
      localStorage.removeItem("setupCompleted");

      await signOut();

      // Force navigation to login page
      console.log("Navigating to login page after logout");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      // Even if there's an error, try to navigate to login
      navigate("/login", { replace: true });
    }
  };

  const navItems = [
    { path: "/", label: "Home", icon: <Home className="h-5 w-5" /> },
    {
      path: "/kingdom",
      label: "Kingdom",
      icon: <Castle className="h-5 w-5" />,
    },
    {
      path: "/building",
      label: "Building",
      icon: <Building2 className="h-5 w-5" />,
    },
    {
      path: "/resources",
      label: "Resources",
      icon: <Coins className="h-5 w-5" />,
    },
    {
      path: "/military",
      label: "Military",
      icon: <Sword className="h-5 w-5" />,
    },
    {
      path: "/alliance",
      label: "Dewan Raja",
      icon: <Users className="h-5 w-5" />,
    },
    { path: "/combat", label: "Combat", icon: <Shield className="h-5 w-5" /> },
    { path: "/map", label: "World Map", icon: <Shield className="h-5 w-5" /> },
  ];

  return (
    <header className="border-b bg-background sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="text-2xl font-bold bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent"
          >
            Kurusetra
          </Link>

          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors
                  ${
                    location.pathname === item.path
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            {user && (
              <>
                <Link
                  to="/profile"
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors
                    ${
                      location.pathname === "/profile"
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                >
                  <Users className="h-5 w-5" />
                  Profile
                </Link>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="ml-2 flex items-center gap-2"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            )}
          </nav>

          <div className="flex items-center gap-2">
            {user && (
              <>
                <Link
                  to="/profile"
                  className={`md:hidden px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors
                    ${
                      location.pathname === "/profile"
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                >
                  <Users className="h-5 w-5" />
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="md:hidden"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            )}
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="p-2 rounded-md hover:bg-accent">
                <span className="sr-only">Open menu</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile navigation - simplified version */}
        <div className="md:hidden overflow-x-auto pb-3 flex space-x-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`p-2 rounded-md flex flex-col items-center justify-center text-xs whitespace-nowrap
                ${
                  location.pathname === item.path
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navigation;
