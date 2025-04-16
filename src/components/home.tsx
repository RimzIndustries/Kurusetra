import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import GameDashboard from "./game/GameDashboard";
import CombatInterface from "./game/CombatInterface";
import { Button } from "@/components/ui/button";

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
      <div className="bg-background min-h-screen p-6">
        <Button
          variant="outline"
          className="mb-4"
          onClick={() => setShowCombatInterface(false)}
        >
          Back to Kingdom
        </Button>
        <CombatInterface />
      </div>
    );
  }

  return <GameDashboard />;
};

export default Home;
