import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Castle,
  Building2,
  Coins,
  Sword,
  Users,
  Shield,
} from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", label: "Home", icon: <Home className="h-5 w-5" /> },
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
  ];

  return (
    <header className="border-b bg-background sticky top-0 z-10">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold">
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
          </nav>

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
