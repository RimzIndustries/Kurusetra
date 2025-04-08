import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useMultiplayer } from "@/contexts/MultiplayerContext";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  AlertTriangle,
  Shield,
  Sword,
  Crown,
  Building,
  Coins,
  Wheat,
  Users,
  Flag,
} from "lucide-react";

// Game integration component to connect all game systems
const GameIntegration = () => {
  const { user, userProfile } = useAuth();
  const { onlineUsers } = useMultiplayer();

  // Game state management
  const [gameState, setGameState] = useState({
    resources: {
      gold: 5000,
      food: 3000,
      materials: 2000,
      researchPoints: 100,
    },
    production: {
      goldRate: 250,
      foodRate: 180,
      materialsRate: 120,
      researchRate: 15,
    },
    military: {
      infantry: 100,
      archers: 50,
      cavalry: 25,
      specialUnits: 5,
    },
    buildings: [
      { id: 1, name: "Barracks", level: 2, underConstruction: false },
      { id: 2, name: "Farm", level: 3, underConstruction: false },
      { id: 3, name: "Mine", level: 2, underConstruction: false },
      { id: 4, name: "Treasury", level: 1, underConstruction: true },
    ],
    events: [
      {
        id: 1,
        type: "construction",
        description: "Treasury upgrade",
        completionTime: "2h 15m",
      },
      {
        id: 2,
        type: "training",
        description: "Training archers",
        completionTime: "1h 30m",
      },
      {
        id: 3,
        type: "research",
        description: "Advanced weapons",
        completionTime: "4h",
      },
    ],
    notifications: [
      {
        id: 1,
        type: "combat",
        message: "Your scouts detected enemy movement near your borders",
        time: "5m ago",
        read: false,
      },
      {
        id: 2,
        type: "alliance",
        message: "Dewan Raja meeting scheduled for tomorrow",
        time: "30m ago",
        read: true,
      },
      {
        id: 3,
        type: "resource",
        message: "Gold storage is almost full",
        time: "1h ago",
        read: true,
      },
    ],
  });

  // Simulate real-time game updates
  useEffect(() => {
    const gameUpdateInterval = setInterval(() => {
      // Update resources based on production rates (scaled down for demo)
      setGameState((prevState) => ({
        ...prevState,
        resources: {
          gold: prevState.resources.gold + prevState.production.goldRate / 360,
          food: prevState.resources.food + prevState.production.foodRate / 360,
          materials:
            prevState.resources.materials +
            prevState.production.materialsRate / 360,
          researchPoints:
            prevState.resources.researchPoints +
            prevState.production.researchRate / 360,
        },
      }));
    }, 10000); // Update every 10 seconds

    return () => clearInterval(gameUpdateInterval);
  }, []);

  // Calculate total military strength
  const totalMilitaryStrength =
    gameState.military.infantry * 1 +
    gameState.military.archers * 1.5 +
    gameState.military.cavalry * 3 +
    gameState.military.specialUnits * 10;

  // Race-specific bonuses based on user profile
  const getRaceBonus = () => {
    switch (userProfile.race) {
      case "ksatriya":
        return { type: "Gold", amount: "+15%" };
      case "wanamarta":
        return { type: "Research", amount: "+20%" };
      case "wirabumi":
        return { type: "Building", amount: "+15%" };
      case "jatayu":
        return { type: "Speed", amount: "+30%" };
      case "kurawa":
        return { type: "Espionage", amount: "+25%" };
      case "tibrasara":
        return { type: "Ranged", amount: "+20%" };
      case "raksasa":
        return { type: "Strength", amount: "+30%" };
      case "dedemit":
        return { type: "Food", amount: "-25%" };
      default:
        return { type: "None", amount: "0%" };
    }
  };

  const raceBonus = getRaceBonus();

  return (
    <div className="space-y-6">
      {/* Game status overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Kingdom status */}
        <Card className="bg-neuro-bg shadow-neuro-flat hover:shadow-neuro-convex transition-all duration-300 neuro-glow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-500" />
              <span>{userProfile.kingdomName || "Your Kingdom"}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <Badge className="bg-neuro-bg shadow-neuro-flat">
                {userProfile.race || "Unknown Race"}
              </Badge>
              <div className="text-sm">
                <span className="font-medium">{raceBonus.type} Bonus:</span>{" "}
                {raceBonus.amount}
              </div>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between text-sm mt-2">
              <span>Military Strength:</span>
              <span className="font-medium">
                {Math.round(totalMilitaryStrength)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Resources summary */}
        <Card className="bg-neuro-bg shadow-neuro-flat hover:shadow-neuro-convex transition-all duration-300 neuro-glow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Coins className="h-5 w-5 text-yellow-500" />
              <span>Resources</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-1">
                <Coins className="h-3 w-3 text-yellow-500" />
                <span>Gold:</span>
                <span className="font-medium">
                  {Math.round(gameState.resources.gold)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Wheat className="h-3 w-3 text-green-500" />
                <span>Food:</span>
                <span className="font-medium">
                  {Math.round(gameState.resources.food)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Building className="h-3 w-3 text-stone-500" />
                <span>Materials:</span>
                <span className="font-medium">
                  {Math.round(gameState.resources.materials)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3 text-blue-500" />
                <span>Research:</span>
                <span className="font-medium">
                  {Math.round(gameState.resources.researchPoints)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active events */}
        <Card className="bg-neuro-bg shadow-neuro-flat hover:shadow-neuro-convex transition-all duration-300 neuro-glow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <span>Active Events</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {gameState.events.map((event) => (
                <div
                  key={event.id}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center gap-1">
                    {event.type === "construction" && (
                      <Building className="h-3 w-3 text-amber-500" />
                    )}
                    {event.type === "training" && (
                      <Sword className="h-3 w-3 text-red-500" />
                    )}
                    {event.type === "research" && (
                      <Shield className="h-3 w-3 text-blue-500" />
                    )}
                    <span>{event.description}</span>
                  </div>
                  <span className="text-xs">{event.completionTime}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Online players */}
        <Card className="bg-neuro-bg shadow-neuro-flat hover:shadow-neuro-convex transition-all duration-300 neuro-glow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-green-500" />
              <span>Online Players</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">Dewan Raja Members:</span>
              <Badge className="bg-neuro-bg shadow-neuro-flat">
                {onlineUsers.length} Online
              </Badge>
            </div>
            <div className="space-y-1 text-sm">
              {onlineUsers.slice(0, 3).map((user) => (
                <div key={user.id} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>{user.kingdomName || user.username}</span>
                </div>
              ))}
              {onlineUsers.length > 3 && (
                <div className="text-xs text-muted-foreground text-right">
                  +{onlineUsers.length - 3} more online
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-neuro-bg shadow-neuro-flat hover:shadow-neuro-convex transition-all duration-300 neuro-glow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <span>Recent Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {gameState.notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start gap-2 p-2 rounded-md bg-neuro-bg shadow-neuro-concave"
                >
                  {notification.type === "combat" && (
                    <Sword className="h-4 w-4 text-red-500 mt-0.5" />
                  )}
                  {notification.type === "alliance" && (
                    <Users className="h-4 w-4 text-blue-500 mt-0.5" />
                  )}
                  {notification.type === "resource" && (
                    <Coins className="h-4 w-4 text-yellow-500 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p
                      className={`text-sm ${!notification.read ? "font-medium" : ""}`}
                    >
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {notification.time}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1"></div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-wrap gap-2 justify-center"
      >
        <Button className="bg-neuro-bg shadow-neuro-flat hover:shadow-neuro-pressed transition-all duration-300 neuro-glow">
          <Building className="h-4 w-4 mr-2" /> Manage Buildings
        </Button>
        <Button className="bg-neuro-bg shadow-neuro-flat hover:shadow-neuro-pressed transition-all duration-300 neuro-glow">
          <Sword className="h-4 w-4 mr-2" /> Train Troops
        </Button>
        <Button className="bg-neuro-bg shadow-neuro-flat hover:shadow-neuro-pressed transition-all duration-300 neuro-glow">
          <Flag className="h-4 w-4 mr-2" /> View Map
        </Button>
        <Button className="bg-neuro-bg shadow-neuro-flat hover:shadow-neuro-pressed transition-all duration-300 neuro-glow">
          <Users className="h-4 w-4 mr-2" /> Dewan Raja
        </Button>
      </motion.div>
    </div>
  );
};

export default GameIntegration;
