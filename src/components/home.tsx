import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import GameDashboard from "./game/GameDashboard";
import CombatInterface from "./game/CombatInterface";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

/**
 * Home component - Main entry point after authentication
 * Handles routing based on user setup status and displays either
 * the GameDashboard or CombatInterface based on user selection
 */
const Home = () => {
  // Get auth context and navigation
  const { user, userProfile, hasCompletedSetup } = useAuth();
  const navigate = useNavigate();
  const [showCombatInterface, setShowCombatInterface] = React.useState(false);

  // Check if user has completed setup
  useEffect(() => {
    if (user && !hasCompletedSetup()) {
      console.log("Home: User has not completed setup, redirecting");
      navigate("/setup-kingdom");
    } else {
      console.log("Home: User has completed setup, showing dashboard");
      // Log user profile for debugging
      console.log("User profile:", userProfile);
    }
  }, [user, userProfile, hasCompletedSetup, navigate]);

  // If combat interface is active, show it
  if (showCombatInterface) {
    return (
      <div className="bg-neuro-bg min-h-screen p-6">
        <Button
          variant="outline"
          className="mb-4 shadow-neuro-flat hover:shadow-neuro-convex transition-all duration-300 flex items-center gap-2"
          onClick={() => setShowCombatInterface(false)}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Kingdom
        </Button>
        <CombatInterface />
      </div>
    );
  }

  return <GameDashboard />;
};

export default Home;
