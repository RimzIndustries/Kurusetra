import React, { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import {
  Building2,
  ArrowUp,
  Clock,
  Coins,
  Wheat,
  Hammer,
  Construction,
  Shield,
  Sword,
  Sparkles,
  Home,
  Store,
  Warehouse,
  Tractor,
  ShoppingBag,
  Loader2,
} from "lucide-react";

// Building type definition
type BuildingType = {
  id: string;
  kingdomId: string;
  name: string;
  level: number;
  description: string;
  goldCost: number;
  foodCost: number;
  timeToUpgrade: string;
  benefits: string;
  icon: string;
  constructionStatus?: string;
  completionTime?: number | null;
  health?: number;
};

// Map icon string to component
const getIconComponent = (iconName: string, className: string = "h-8 w-8") => {
  const iconMap: Record<string, JSX.Element> = {
    Sword: <Sword className={`${className} text-red-500`} />,
    Wheat: <Wheat className={`${className} text-green-500`} />,
    Coins: <Coins className={`${className} text-yellow-500`} />,
    Tractor: <Tractor className={`${className} text-amber-600`} />,
    ShoppingBag: <ShoppingBag className={`${className} text-purple-500`} />,
    Shield: <Shield className={`${className} text-blue-500`} />,
    Building2: <Building2 className={`${className} text-purple-500`} />,
  };

  return (
    iconMap[iconName] || <Building2 className={`${className} text-gray-500`} />
  );
};

// Default buildings data for new kingdoms
const defaultBuildings = [
  {
    name: "Barracks",
    level: 1,
    description: "Train military units and increase army capacity",
    goldCost: 2500,
    foodCost: 1200,
    timeToUpgrade: "8h",
    icon: "Sword",
    benefits: "Unlocks new unit types and increases training capacity",
  },
  {
    name: "Farm",
    level: 1,
    description: "Produces food resources for your kingdom",
    goldCost: 1800,
    foodCost: 800,
    timeToUpgrade: "6h",
    icon: "Wheat",
    benefits: "+15% food production and storage capacity",
  },
  {
    name: "Treasury",
    level: 1,
    description: "Stores and generates gold for your kingdom",
    goldCost: 3000,
    foodCost: 1500,
    timeToUpgrade: "10h",
    icon: "Coins",
    benefits: "+20% gold storage capacity and passive income",
  },
  {
    name: "Stable",
    level: 1,
    description: "Train and house cavalry units",
    goldCost: 3500,
    foodCost: 1800,
    timeToUpgrade: "9h",
    icon: "Tractor",
    benefits: "Unlocks advanced cavalry units and increases movement speed",
  },
  {
    name: "Market",
    level: 1,
    description: "Trade resources with other kingdoms",
    goldCost: 2800,
    foodCost: 1400,
    timeToUpgrade: "7h",
    icon: "ShoppingBag",
    benefits: "Improves trade rates and unlocks special merchants",
  },
];

// Custom hook for managing buildings
const useBuildingData = () => {
  const [buildings, setBuildings] = useState<BuildingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, supabase } = useAuth();
  const { toast } = useToast();

  // Fetch buildings from database
  const fetchBuildings = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // First, get the user's kingdom
      const { data: kingdomData, error: kingdomError } = await supabase
        .from("kingdoms")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (kingdomError) {
        console.error("Error fetching kingdom:", kingdomError);
        setError("Failed to fetch kingdom data");
        setLoading(false);
        return;
      }

      const kingdomId = kingdomData?.id;

      if (!kingdomId) {
        setError("No kingdom found for this user");
        setLoading(false);
        return;
      }

      // Fetch buildings for this kingdom
      const { data, error: buildingsError } = await supabase
        .from("buildings")
        .select("*")
        .eq("kingdom_id", kingdomId);

      if (buildingsError) {
        console.error("Error fetching buildings:", buildingsError);
        setError("Failed to fetch buildings data");
        setLoading(false);
        return;
      }

      if (data && data.length > 0) {
        // Transform database data to component format
        const formattedBuildings = data.map((b) => ({
          id: b.id,
          kingdomId: b.kingdom_id,
          name: b.name,
          level: b.level,
          description: b.description,
          goldCost: b.gold_cost,
          foodCost: b.food_cost,
          timeToUpgrade: b.time_to_upgrade,
          benefits: b.benefits,
          icon: b.icon,
          constructionStatus: b.construction_status,
          completionTime: b.completion_time,
          health: b.health,
        }));

        setBuildings(formattedBuildings);
      } else {
        // If no buildings found, create default buildings for this kingdom
        await createDefaultBuildings(kingdomId);
      }
    } catch (err) {
      console.error("Error in fetchBuildings:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  // Create default buildings for a new kingdom
  const createDefaultBuildings = async (kingdomId: string) => {
    try {
      const buildingsToInsert = defaultBuildings.map((building) => ({
        kingdom_id: kingdomId,
        name: building.name,
        level: building.level,
        description: building.description,
        gold_cost: building.goldCost,
        food_cost: building.foodCost,
        time_to_upgrade: building.timeToUpgrade,
        benefits: building.benefits,
        icon: building.icon,
        construction_status: "idle",
        health: 100,
      }));

      const { data, error } = await supabase
        .from("buildings")
        .insert(buildingsToInsert)
        .select();

      if (error) {
        console.error("Error creating default buildings:", error);
        setError("Failed to create default buildings");
        return;
      }

      // Fetch the newly created buildings
      await fetchBuildings();
    } catch (err) {
      console.error("Error in createDefaultBuildings:", err);
      setError("Failed to set up initial buildings");
    }
  };

  // Start building upgrade
  const startUpgrade = useCallback(
    async (buildingId: string) => {
      try {
        // Find the building to upgrade
        const building = buildings.find((b) => b.id === buildingId);
        if (!building) return;

        // In a real implementation, you would check if the user has enough resources
        // and deduct them before starting the upgrade

        // Calculate completion time (for demo purposes: 10 seconds per level)
        const upgradeTimeInSeconds = 10;
        const completionTime = Date.now() + upgradeTimeInSeconds * 1000;

        // Update the building in the database
        const { error } = await supabase
          .from("buildings")
          .update({
            construction_status: "upgrading",
            completion_time: completionTime,
          })
          .eq("id", buildingId);

        if (error) {
          console.error("Error starting upgrade:", error);
          toast({
            title: "Upgrade Failed",
            description: "Could not start the building upgrade.",
            variant: "destructive",
          });
          return;
        }

        // Update local state
        setBuildings((prev) =>
          prev.map((b) =>
            b.id === buildingId
              ? { ...b, constructionStatus: "upgrading", completionTime }
              : b,
          ),
        );

        toast({
          title: "Upgrade Started",
          description: `${building.name} upgrade has begun!`,
        });

        // For demo purposes, we'll complete the upgrade after the time
        setTimeout(() => {
          completeUpgrade(buildingId);
        }, upgradeTimeInSeconds * 1000);
      } catch (err) {
        console.error("Error in startUpgrade:", err);
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    },
    [buildings, supabase, toast],
  );

  // Complete a building upgrade
  const completeUpgrade = async (buildingId: string) => {
    try {
      // Find the building
      const building = buildings.find((b) => b.id === buildingId);
      if (!building) return;

      // Update the building in the database
      const { error } = await supabase
        .from("buildings")
        .update({
          level: building.level + 1,
          construction_status: "idle",
          completion_time: null,
          // Increase costs for next level
          gold_cost: Math.round(building.goldCost * 1.2),
          food_cost: Math.round(building.foodCost * 1.2),
        })
        .eq("id", buildingId);

      if (error) {
        console.error("Error completing upgrade:", error);
        return;
      }

      // Update local state
      setBuildings((prev) =>
        prev.map((b) =>
          b.id === buildingId
            ? {
                ...b,
                level: b.level + 1,
                constructionStatus: "idle",
                completionTime: null,
                goldCost: Math.round(b.goldCost * 1.2),
                foodCost: Math.round(b.foodCost * 1.2),
              }
            : b,
        ),
      );

      toast({
        title: "Upgrade Complete",
        description: `${building.name} is now level ${building.level + 1}!`,
      });
    } catch (err) {
      console.error("Error in completeUpgrade:", err);
    }
  };

  // Load buildings when component mounts
  useEffect(() => {
    if (user) {
      fetchBuildings();
    }
  }, [user, fetchBuildings]);

  return { buildings, loading, error, startUpgrade };
};

// Custom hook for managing construction in progress
const useConstructionData = (buildings: BuildingType[]) => {
  const [constructionInProgress, setConstructionInProgress] = useState<any[]>(
    [],
  );

  // Update construction in progress whenever buildings change
  useEffect(() => {
    const now = Date.now();
    const inProgress = buildings
      .filter(
        (b) =>
          b.constructionStatus === "upgrading" &&
          b.completionTime &&
          b.completionTime > now,
      )
      .map((b) => {
        const totalTime = b.completionTime! - (now - 10000); // Assuming upgrade started 10 seconds ago
        const timeLeft = b.completionTime! - now;
        const progress = Math.round(((totalTime - timeLeft) / totalTime) * 100);

        // Format time remaining
        const seconds = Math.floor(timeLeft / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        let timeRemaining = "";
        if (hours > 0) {
          timeRemaining = `${hours}h ${minutes % 60}m`;
        } else if (minutes > 0) {
          timeRemaining = `${minutes}m ${seconds % 60}s`;
        } else {
          timeRemaining = `${seconds}s`;
        }

        return {
          id: b.id,
          buildingName: `${b.name} (to Level ${b.level + 1})`,
          progress: progress,
          timeRemaining,
          icon: getIconComponent(b.icon, "h-6 w-6 text-blue-400"),
        };
      });

    setConstructionInProgress(inProgress);

    // Set up interval to update progress
    const interval = setInterval(() => {
      setConstructionInProgress((prev) => {
        const now = Date.now();
        return prev.map((item) => {
          const building = buildings.find((b) => b.id === item.id);
          if (!building || !building.completionTime) return item;

          const totalTime = building.completionTime - (now - 10000);
          const timeLeft = building.completionTime - now;
          const progress = Math.round(
            ((totalTime - timeLeft) / totalTime) * 100,
          );

          // Format time remaining
          const seconds = Math.floor(timeLeft / 1000);
          const minutes = Math.floor(seconds / 60);
          const hours = Math.floor(minutes / 60);

          let timeRemaining = "";
          if (hours > 0) {
            timeRemaining = `${hours}h ${minutes % 60}m`;
          } else if (minutes > 0) {
            timeRemaining = `${minutes}m ${seconds % 60}s`;
          } else {
            timeRemaining = `${seconds}s`;
          }

          return {
            ...item,
            progress,
            timeRemaining,
          };
        });
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [buildings]);

  return { constructionInProgress };
};

// Custom hook for managing available buildings
const useAvailableBuildingsData = () => {
  const [availableBuildings, setAvailableBuildings] = useState([
    {
      id: 6,
      name: "Watchtower",
      description: "Provides early warning of enemy attacks",
      goldCost: 4000,
      foodCost: 2000,
      timeToConstruct: "12h",
      requirements: "Barracks Level 5",
      icon: <Shield className="h-8 w-8 text-blue-500" />,
      benefits: "Increases defense and provides enemy movement visibility",
    },
    {
      id: 7,
      name: "Temple",
      description: "Provides spiritual guidance and special abilities",
      goldCost: 3500,
      foodCost: 1800,
      timeToConstruct: "8h",
      requirements: "Treasury Level 4",
      icon: <Building2 className="h-8 w-8 text-purple-500" />,
      benefits: "Unlocks special abilities and kingdom buffs",
    },
  ]);

  const startConstruction = useCallback((buildingId) => {
    console.log(`Starting construction for building ${buildingId}`);
    // In a real app, this would call an API to start the construction
  }, []);

  return { availableBuildings, startConstruction };
};

const Building = () => {
  // Use custom hooks to manage data
  const { buildings, loading, error, startUpgrade } = useBuildingData();
  const { constructionInProgress } = useConstructionData(buildings);
  const { availableBuildings, startConstruction } = useAvailableBuildingsData();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <div className="bg-background min-h-screen p-6 bg-gradient-to-b from-background to-background/95">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto"
      >
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-3 mb-8"
        >
          <div className="p-3 bg-primary/10 rounded-full">
            <Construction className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent">
              Building Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Construct and upgrade buildings to strengthen your kingdom
            </p>
          </div>
        </motion.div>

        {loading ? (
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center p-12"
          >
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading buildings...</span>
          </motion.div>
        ) : error ? (
          <motion.div
            variants={itemVariants}
            className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-600"
          >
            <p>Error: {error}</p>
            <p className="text-sm mt-2">Please try refreshing the page.</p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <motion.div variants={itemVariants}>
              <Card className="border border-primary/20 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 shadow-lg shadow-primary/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center">
                    <Building2 className="h-5 w-5 mr-2 text-primary" />
                    Total Buildings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{buildings.length}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Structures in your kingdom
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="border border-amber-500/20 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 shadow-lg shadow-amber-500/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center">
                    <Construction className="h-5 w-5 mr-2 text-amber-500" />
                    In Construction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">
                    {constructionInProgress.length}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Buildings being constructed
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="border border-blue-500/20 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 shadow-lg shadow-blue-500/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center">
                    <Hammer className="h-5 w-5 mr-2 text-blue-500" />
                    Available to Build
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">
                    {availableBuildings.length}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    New structures to construct
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}

        <motion.div variants={itemVariants}>
          <Tabs
            defaultValue="existing"
            className="w-full bg-card/30 p-6 rounded-lg border border-border/40 shadow-md backdrop-blur-sm"
          >
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-muted/50">
              <TabsTrigger
                value="existing"
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-md transition-all duration-300"
              >
                <Building2 className="h-4 w-4 mr-2" />
                Existing Buildings
              </TabsTrigger>
              <TabsTrigger
                value="construction"
                className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-500 data-[state=active]:shadow-md transition-all duration-300"
              >
                <Construction className="h-4 w-4 mr-2" />
                Construction
              </TabsTrigger>
              <TabsTrigger
                value="new"
                className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-500 data-[state=active]:shadow-md transition-all duration-300"
              >
                <Hammer className="h-4 w-4 mr-2" />
                New Buildings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="existing" className="space-y-6">
              <motion.div
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {buildings.map((building) => (
                  <motion.div
                    key={building.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50 bg-card/80 backdrop-blur-sm h-full">
                      <CardHeader className="border-b border-border/20 pb-4 bg-muted/30">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-background/50 rounded-full">
                              {typeof building.icon === "string"
                                ? getIconComponent(building.icon)
                                : building.icon}
                            </div>
                            <div>
                              <CardTitle className="text-xl">
                                {building.name}
                              </CardTitle>
                              <Badge
                                variant="outline"
                                className="mt-1 bg-primary/5"
                              >
                                Level {building.level}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-sm mb-4">{building.description}</p>

                        <div className="flex items-center gap-2 mb-4">
                          <Sparkles className="h-4 w-4 text-amber-400" />
                          <span className="text-sm font-medium">
                            {building.benefits}
                          </span>
                        </div>

                        <Separator className="my-4 bg-border/50" />

                        <div className="space-y-3 mb-4 p-4 bg-muted/30 rounded-lg border border-border/30">
                          <div className="flex justify-between text-sm">
                            <span className="flex items-center">
                              <Coins className="h-4 w-4 mr-1 text-yellow-500" />
                              Upgrade Cost:
                            </span>
                            <span className="font-medium">
                              {building.goldCost}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="flex items-center">
                              <Wheat className="h-4 w-4 mr-1 text-green-500" />
                              Food Cost:
                            </span>
                            <span className="font-medium">
                              {building.foodCost}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" /> Time:
                            </span>
                            <span className="font-medium">
                              {building.timeToUpgrade}
                            </span>
                          </div>
                        </div>
                        <Button
                          className="w-full py-5 text-base font-semibold transition-all duration-300 hover:bg-primary/90 hover:shadow-md group"
                          onClick={() => startUpgrade(building.id)}
                        >
                          <ArrowUp className="h-4 w-4 mr-2 group-hover:animate-bounce" />
                          Upgrade to Level {building.level + 1}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="construction" className="space-y-6">
              {constructionInProgress.length > 0 ? (
                <motion.div variants={containerVariants} className="space-y-6">
                  <motion.h2
                    variants={itemVariants}
                    className="text-xl font-semibold flex items-center gap-2"
                  >
                    <Construction className="h-5 w-5 text-amber-500" />
                    In Progress
                  </motion.h2>
                  {constructionInProgress.map((item) => (
                    <motion.div
                      key={item.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.01 }}
                    >
                      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-amber-500/30 bg-card/80 backdrop-blur-sm">
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-amber-500/10 rounded-full">
                                {item.icon}
                              </div>
                              <span className="text-lg font-medium">
                                {item.buildingName}
                              </span>
                            </div>
                            <Badge
                              variant="outline"
                              className="text-amber-500 border-amber-500 bg-amber-500/10"
                            >
                              {item.progress}%
                            </Badge>
                          </div>
                          <div className="relative mb-2">
                            <Progress value={item.progress} className="h-2" />
                            <motion.div
                              className="absolute top-0 left-0 h-2 w-2 bg-amber-500 rounded-full"
                              animate={{
                                left: `${item.progress}%`,
                                transition: {
                                  duration: 1.5,
                                  repeat: Infinity,
                                  repeatType: "reverse",
                                },
                              }}
                            />
                          </div>
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-3">
                            <Clock className="h-4 w-4" />
                            Completes in {item.timeRemaining}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  variants={itemVariants}
                  className="text-center py-16 bg-muted/20 rounded-lg border border-border/30"
                >
                  <Building2 className="h-16 w-16 mx-auto text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-xl font-medium">
                    No Construction in Progress
                  </h3>
                  <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                    Start a new building project from the New Buildings tab to
                    expand your kingdom.
                  </p>
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="new" className="space-y-6">
              <motion.div
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {availableBuildings.map((building) => (
                  <motion.div
                    key={building.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-blue-500/30 bg-card/80 backdrop-blur-sm h-full">
                      <CardHeader className="border-b border-border/20 pb-4 bg-muted/30">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-full">
                              {building.icon}
                            </div>
                            <CardTitle className="text-xl">
                              {building.name}
                            </CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-sm mb-4">{building.description}</p>

                        <div className="flex items-center gap-2 mb-4">
                          <Sparkles className="h-4 w-4 text-blue-400" />
                          <span className="text-sm font-medium">
                            {building.benefits}
                          </span>
                        </div>

                        <Separator className="my-4 bg-border/50" />

                        <div className="space-y-3 mb-4 p-4 bg-muted/30 rounded-lg border border-border/30">
                          <div className="flex justify-between text-sm">
                            <span className="flex items-center">
                              <Coins className="h-4 w-4 mr-1 text-yellow-500" />
                              Cost:
                            </span>
                            <span className="font-medium">
                              {building.goldCost}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="flex items-center">
                              <Wheat className="h-4 w-4 mr-1 text-green-500" />
                              Food Cost:
                            </span>
                            <span className="font-medium">
                              {building.foodCost}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" /> Time:
                            </span>
                            <span className="font-medium">
                              {building.timeToConstruct}
                            </span>
                          </div>
                          <Separator className="my-2" />
                          <div className="text-sm">
                            <span className="font-medium">Requirements:</span>{" "}
                            <Badge
                              variant="outline"
                              className="ml-1 bg-blue-500/5 text-blue-500 border-blue-500/30"
                            >
                              {building.requirements}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          className="w-full py-5 text-base font-semibold transition-all duration-300 bg-blue-600 hover:bg-blue-700 hover:shadow-md group"
                          onClick={() => startConstruction(building.id)}
                        >
                          <Construction className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
                          Construct
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Building;
