import React from "react";
import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-neuro-bg text-foreground">
      <Navigation />
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default Layout;
