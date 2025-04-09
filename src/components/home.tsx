import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useMultiplayer } from "../contexts/MultiplayerContext";
import {
  Shield,
  Building,
  Sword,
  Users,
  Clock,
  ChevronRight,
  Crown,
  Coins,
  Wheat,
  Star,
  Sparkles,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import KingdomOverview from "./game/KingdomOverview";
import ActionPanel from "./game/ActionPanel";
import RaceSelection from "./game/RaceSelection";
import CombatInterface from "./game/CombatInterface";
import OnlineUsers from "./game/OnlineUsers";
import GameIntegration from "./game/GameIntegration";

const Home = () => {
  // Get auth context and navigation
  const { user, userProfile, hasCompletedSetup } = useAuth();
  const { onlineUsers } = useMultiplayer();
  const navigate = useNavigate();

  // State for UI components
  const [showCombatInterface, setShowCombatInterface] = useState(false);

  // Game state management based on user's race and kingdom
  const [gameState, setGameState] = useState(() => {
    // Default values
    const baseState = {
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
    };

    // Apply race-specific bonuses
    if (userProfile.race) {
      switch (userProfile.race) {
        case "ksatriya":
          baseState.resources.gold = 6000;
          baseState.production.goldRate = 300;
          break;
        case "wanamarta":
          baseState.resources.researchPoints = 150;
          baseState.production.researchRate = 20;
          break;
        case "wirabumi":
          baseState.buildings.forEach((b) => (b.level += 1));
          break;
        case "jatayu":
          // Speed bonus would affect timers, not represented in initial state
          baseState.military.cavalry = 40;
          break;
        case "kurawa":
          // Espionage bonus
          baseState.resources.researchPoints = 130;
          break;
        case "tibrasara":
          baseState.military.archers = 75;
          break;
        case "raksasa":
          baseState.military.infantry = 150;
          baseState.military.specialUnits = 8;
          break;
        case "dedemit":
          baseState.resources.food = 2000; // Food penalty
          baseState.military.specialUnits = 10; // But more special units
          break;
        default:
          break;
      }
    }

    return baseState;
  });

  // Specialty bonuses based on user profile
  const getSpecialtyBonus = () => {
    if (!userProfile.specialty) return { type: "None", amount: "0%" };

    switch (userProfile.specialty) {
      case "warfare":
        return { type: "Military", amount: "+15%" };
      case "commerce":
        return { type: "Gold", amount: "+20%" };
      case "agriculture":
        return { type: "Food", amount: "+25%" };
      case "mysticism":
        return { type: "Research", amount: "+20%" };
      case "diplomacy":
        return { type: "Alliance", amount: "+30%" };
      default:
        return { type: "None", amount: "0%" };
    }
  };

  const specialtyBonus = getSpecialtyBonus();

  // Race-specific bonuses based on user profile
  const getRaceBonus = () => {
    if (!userProfile.race) return { type: "None", amount: "0%" };

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

  // Calculate total military strength
  const totalMilitaryStrength =
    gameState.military.infantry * 1 +
    gameState.military.archers * 1.5 +
    gameState.military.cavalry * 3 +
    gameState.military.specialUnits * 10;

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

  // Mock data for notifications - personalized based on user's kingdom
  const notifications = [
    {
      id: 1,
      type: "building",
      message:
        userProfile.race === "wirabumi"
          ? "Fortress upgraded"
          : "Barracks completed",
      time: "2 minutes ago",
    },
    {
      id: 2,
      type: "combat",
      message:
        userProfile.race === "raksasa"
          ? "Your warriors crushed the enemy"
          : "Your army returned victorious",
      time: "1 hour ago",
    },
    {
      id: 3,
      type: "alliance",
      message: "New message from Dewan Raja",
      time: "3 hours ago",
    },
  ];

  // Handle action selection
  const handleActionSelect = (action: string) => {
    if (action === "combat") {
      setShowCombatInterface(true);
    } else {
      setShowCombatInterface(false);
    }
  };

  // Check if user has completed setup
  useEffect(() => {
    if (user && !hasCompletedSetup()) {
      console.log("User has not completed setup, redirecting to setup page");
      navigate("/setup-kingdom");
    } else if (user && hasCompletedSetup()) {
      console.log("User profile loaded:", userProfile);
      // Refresh game state when user profile changes
      setGameState((prevState) => {
        const updatedState = { ...prevState };

        // Apply race-specific bonuses
        if (userProfile.race) {
          switch (userProfile.race) {
            case "ksatriya":
              updatedState.resources.gold = 6000;
              updatedState.production.goldRate = 300;
              break;
            case "wanamarta":
              updatedState.resources.researchPoints = 150;
              updatedState.production.researchRate = 20;
              break;
            case "wirabumi":
              updatedState.buildings.forEach((b) => (b.level += 1));
              break;
            case "jatayu":
              updatedState.military.cavalry = 40;
              break;
            case "kurawa":
              updatedState.resources.researchPoints = 130;
              break;
            case "tibrasara":
              updatedState.military.archers = 75;
              break;
            case "raksasa":
              updatedState.military.infantry = 150;
              updatedState.military.specialUnits = 8;
              break;
            case "dedemit":
              updatedState.resources.food = 2000;
              updatedState.military.specialUnits = 10;
              break;
          }
        }

        return updatedState;
      });
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

  return (
    <div className="bg-background min-h-screen bg-gradient-to-b from-background to-background/95 relative overflow-hidden">
      <motion.header
        className="border-b p-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">Kurusetra</h1>
            {userProfile.kingdomName && (
              <div className="flex items-center ml-4">
                <Crown className="h-5 w-5 text-amber-500 mr-2" />
                <span className="text-lg font-medium">
                  {userProfile.kingdomName}
                </span>
                {userProfile.race && (
                  <Badge className="ml-2 bg-neuro-bg shadow-neuro-flat">
                    {userProfile.race}
                  </Badge>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {userProfile.zodiac && (
              <div className="flex items-center mr-4">
                <Star className="h-4 w-4 text-amber-400 mr-1" />
                <span className="text-sm">{userProfile.zodiac}</span>
              </div>
            )}
            {userProfile.specialty && (
              <div className="flex items-center mr-4">
                <Sparkles className="h-4 w-4 text-blue-400 mr-1" />
                <span className="text-sm">{userProfile.specialty}</span>
              </div>
            )}
            <Button variant="outline" size="sm">
              <Users className="mr-2 h-4 w-4" />
              Dewan Raja
            </Button>
            <Button variant="outline" size="sm">
              <Clock className="mr-2 h-4 w-4" />
              Day 127
            </Button>
          </div>
        </div>
      </motion.header>

      <main className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              {/* Kingdom Welcome Banner */}
              <Card className="bg-neuro-bg shadow-neuro-flat hover:shadow-neuro-convex transition-all duration-300 neuro-glow mb-6">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">
                        Welcome to {userProfile.kingdomName || "Your Kingdom"}
                      </h2>
                      <p className="text-muted-foreground">
                        {userProfile.race === "ksatriya" &&
                          "Your noble Ksatriya warriors stand ready to expand your golden empire."}
                        {userProfile.race === "wanamarta" &&
                          "The mystical forests of Wanamarta grant you wisdom beyond measure."}
                        {userProfile.race === "wirabumi" &&
                          "Your Wirabumi engineers have fortified your kingdom with unmatched defenses."}
                        {userProfile.race === "jatayu" &&
                          "Swift as the wind, your Jatayu forces can strike anywhere with lightning speed."}
                        {userProfile.race === "kurawa" &&
                          "The shadows are your allies as Kurawa spies gather secrets from your enemies."}
                        {userProfile.race === "tibrasara" &&
                          "Your Tibrasara archers rain death upon any who dare challenge your rule."}
                        {userProfile.race === "raksasa" &&
                          "The mighty Raksasa warriors strike fear into the hearts of your enemies."}
                        {userProfile.race === "dedemit" &&
                          "The terrifying Dedemit hordes consume all in their path, hungry for conquest."}
                        {!userProfile.race &&
                          "Your kingdom awaits your command. What destiny will you forge?"}
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center">
                      <div className="mr-6">
                        <p className="text-sm font-medium">Race Bonus:</p>
                        <p className="text-lg font-bold">
                          {raceBonus.type} {raceBonus.amount}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Specialty:</p>
                        <p className="text-lg font-bold">
                          {specialtyBonus.type} {specialtyBonus.amount}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Resource Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="bg-neuro-bg shadow-neuro-flat hover:shadow-neuro-convex transition-all duration-300 neuro-glow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Coins className="h-8 w-8 text-yellow-500 mr-3" />
                        <div>
                          <p className="text-sm text-muted-foreground">Gold</p>
                          <p className="text-xl font-bold">
                            {Math.round(gameState.resources.gold)}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-neuro-bg shadow-neuro-flat">
                        +{gameState.production.goldRate}/hr
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-neuro-bg shadow-neuro-flat hover:shadow-neuro-convex transition-all duration-300 neuro-glow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Wheat className="h-8 w-8 text-green-500 mr-3" />
                        <div>
                          <p className="text-sm text-muted-foreground">Food</p>
                          <p className="text-xl font-bold">
                            {Math.round(gameState.resources.food)}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-neuro-bg shadow-neuro-flat">
                        +{gameState.production.foodRate}/hr
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-neuro-bg shadow-neuro-flat hover:shadow-neuro-convex transition-all duration-300 neuro-glow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Building className="h-8 w-8 text-stone-500 mr-3" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Materials
                          </p>
                          <p className="text-xl font-bold">
                            {Math.round(gameState.resources.materials)}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-neuro-bg shadow-neuro-flat">
                        +{gameState.production.materialsRate}/hr
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-neuro-bg shadow-neuro-flat hover:shadow-neuro-convex transition-all duration-300 neuro-glow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Shield className="h-8 w-8 text-blue-500 mr-3" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Military
                          </p>
                          <p className="text-xl font-bold">
                            {Math.round(totalMilitaryStrength)}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-neuro-bg shadow-neuro-flat">
                        {gameState.military.infantry +
                          gameState.military.archers +
                          gameState.military.cavalry +
                          gameState.military.specialUnits}{" "}
                        units
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <GameIntegration />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6"
            >
              <ActionPanel onActionSelect={handleActionSelect} />
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <Card className="bg-neuro-bg shadow-neuro-flat hover:shadow-neuro-convex transition-all duration-300 neuro-glow">
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Recent kingdom activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-start space-x-3"
                    >
                      {notification.type === "building" && (
                        <Building className="h-5 w-5 text-blue-500" />
                      )}
                      {notification.type === "combat" && (
                        <Sword className="h-5 w-5 text-red-500" />
                      )}
                      {notification.type === "alliance" && (
                        <Shield className="h-5 w-5 text-green-500" />
                      )}
                      <div>
                        <p className="text-sm font-medium">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full">
                  View all activities
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card className="mt-6 bg-neuro-bg shadow-neuro-flat hover:shadow-neuro-convex transition-all duration-300 neuro-glow">
              <CardHeader>
                <CardTitle>Active Tasks</CardTitle>
                <CardDescription>Time-based activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Building: Archery Range</span>
                      <span>67%</span>
                    </div>
                    <Progress value={67} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Completes in 2h 15m
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Training: Archers</span>
                      <span>34%</span>
                    </div>
                    <Progress value={34} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Completes in 4h 30m
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Research: Advanced Weapons</span>
                      <span>12%</span>
                    </div>
                    <Progress value={12} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Completes in 8h 45m
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6 bg-neuro-bg shadow-neuro-flat hover:shadow-neuro-convex transition-all duration-300 neuro-glow">
              <CardHeader>
                <CardTitle>Kingdom Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="resources">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                    <TabsTrigger value="military">Military</TabsTrigger>
                    <TabsTrigger value="buildings">Buildings</TabsTrigger>
                  </TabsList>
                  <TabsContent value="resources" className="space-y-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Gold:</span>
                      <span className="text-sm font-medium">
                        {Math.round(gameState.resources.gold).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Food:</span>
                      <span className="text-sm font-medium">
                        {Math.round(gameState.resources.food).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Materials:</span>
                      <span className="text-sm font-medium">
                        {Math.round(
                          gameState.resources.materials,
                        ).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Research Points:</span>
                      <span className="text-sm font-medium">
                        {Math.round(
                          gameState.resources.researchPoints,
                        ).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Production Rate:</span>
                      <span className="text-sm font-medium">
                        +{gameState.production.goldRate}/hr
                      </span>
                    </div>
                  </TabsContent>
                  <TabsContent value="military" className="space-y-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Infantry:</span>
                      <span className="text-sm font-medium">
                        {gameState.military.infantry}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Archers:</span>
                      <span className="text-sm font-medium">
                        {gameState.military.archers}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Cavalry:</span>
                      <span className="text-sm font-medium">
                        {gameState.military.cavalry}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Special Units:</span>
                      <span className="text-sm font-medium">
                        {gameState.military.specialUnits}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Total Strength:</span>
                      <span className="text-sm font-medium">
                        {Math.round(totalMilitaryStrength)}
                      </span>
                    </div>
                  </TabsContent>
                  <TabsContent value="buildings" className="space-y-2 mt-2">
                    {gameState.buildings.map((building) => (
                      <div key={building.id} className="flex justify-between">
                        <span className="text-sm">{building.name}:</span>
                        <span className="text-sm font-medium">
                          Level {building.level}
                          {building.underConstruction && " (Upgrading)"}
                        </span>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-6"
            >
              <OnlineUsers />
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
