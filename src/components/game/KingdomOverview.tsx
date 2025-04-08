import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Building,
  Castle,
  Coins,
  Swords,
  Shield,
  Clock,
  Users,
  Wheat,
  Crown,
  Sparkles,
  Star,
  Sun,
  Moon,
} from "lucide-react";

interface ResourceProps {
  gold: number;
  maxGold: number;
  food: number;
  maxFood: number;
  population: number;
  maxPopulation: number;
}

interface BuildingProps {
  id: string;
  name: string;
  level: number;
  description: string;
  icon: React.ReactNode;
}

interface ArmyProps {
  infantry: number;
  cavalry: number;
  archers: number;
  special: number;
  total: number;
}

interface ActivityProps {
  id: string;
  type: "building" | "training" | "research" | "attack" | "defense";
  name: string;
  description: string;
  timeRemaining: number; // in seconds
  totalTime: number; // in seconds
}

interface KingdomOverviewProps {
  kingdomName?: string;
  race?: string;
  resources?: ResourceProps;
  buildings?: BuildingProps[];
  army?: ArmyProps;
  activities?: ActivityProps[];
}

const KingdomOverview: React.FC<KingdomOverviewProps> = ({
  kingdomName = "Hastinapura",
  race = "Ksatriya",
  resources = {
    gold: 5000,
    maxGold: 10000,
    food: 3500,
    maxFood: 8000,
    population: 750,
    maxPopulation: 1000,
  },
  buildings = [
    {
      id: "1",
      name: "Castle",
      level: 3,
      description: "Your kingdom's main fortress",
      icon: <Castle className="h-5 w-5" />,
    },
    {
      id: "2",
      name: "Barracks",
      level: 2,
      description: "Train infantry units",
      icon: <Swords className="h-5 w-5" />,
    },
    {
      id: "3",
      name: "Farm",
      level: 4,
      description: "Produces food for your kingdom",
      icon: <Wheat className="h-5 w-5" />,
    },
    {
      id: "4",
      name: "Treasury",
      level: 2,
      description: "Stores gold and increases production",
      icon: <Coins className="h-5 w-5" />,
    },
    {
      id: "5",
      name: "Wall",
      level: 1,
      description: "Defends your kingdom from attacks",
      icon: <Shield className="h-5 w-5" />,
    },
  ],
  army = {
    infantry: 120,
    cavalry: 45,
    archers: 75,
    special: 10,
    total: 250,
  },
  activities = [
    {
      id: "1",
      type: "building",
      name: "Upgrading Treasury",
      description: "Treasury Level 2 → 3",
      timeRemaining: 3600,
      totalTime: 7200,
    },
    {
      id: "2",
      type: "training",
      name: "Training Infantry",
      description: "Training 50 infantry units",
      timeRemaining: 1800,
      totalTime: 3600,
    },
    {
      id: "3",
      type: "attack",
      name: "Attacking Enemy",
      description: "Army en route to Kurawa Kingdom",
      timeRemaining: 5400,
      totalTime: 7200,
    },
  ],
}) => {
  // Format time remaining in hours and minutes
  const formatTimeRemaining = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  // Calculate percentage for progress bars
  const calculateProgress = (current: number, max: number) => {
    return Math.min(Math.round((current / max) * 100), 100);
  };

  // Calculate activity progress (inverse of time remaining)
  const calculateActivityProgress = (
    timeRemaining: number,
    totalTime: number,
  ) => {
    return Math.round(((totalTime - timeRemaining) / totalTime) * 100);
  };

  return (
    <div className="bg-background min-h-screen p-6 bg-gradient-to-b from-background to-background/95 relative overflow-hidden">
      <div className="w-full h-full bg-white p-4 flex flex-col gap-4 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <motion.div
          className="absolute top-10 right-10 opacity-5 z-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
        >
          <Sun className="h-64 w-64 text-gray-300" />
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-10 opacity-3 z-0"
          animate={{ rotate: -360 }}
          transition={{ duration: 240, repeat: Infinity, ease: "linear" }}
        >
          <Moon className="h-48 w-48 text-gray-200" />
        </motion.div>

        {/* Floating stars */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute z-0"
            initial={{
              x: Math.random() * 100 - 50 + "%",
              y: Math.random() * 100 - 50 + "%",
              opacity: 0.05 + Math.random() * 0.1,
            }}
            animate={{
              y: [0, -15, 0, 15, 0],
              opacity: [0.05, 0.1, 0.05],
            }}
            transition={{
              duration: 3 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          >
            <Star
              className={`h-${Math.floor(Math.random() * 3) + 3} w-${Math.floor(Math.random() * 3) + 3} text-gray-300`}
            />
          </motion.div>
        ))}

        {/* Kingdom Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-200 shadow-[5px_5px_15px_#d9d9d9,-5px_-5px_15px_#ffffff] relative z-10"
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 5, 0, -5, 0], scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="relative"
            >
              <Crown className="h-8 w-8 text-amber-500" />
              <motion.div
                className="absolute -inset-1 opacity-50 blur-sm"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Sparkles className="h-10 w-10 text-amber-300" />
              </motion.div>
            </motion.div>
            <div>
              <motion.h1
                className="text-2xl font-bold text-gray-900"
                animate={{
                  backgroundPosition: ["0% center", "100% center", "0% center"],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                style={{ backgroundSize: "200% auto" }}
              >
                {kingdomName}
              </motion.h1>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-gray-300">
                  {race}
                </Badge>
                <span className="text-sm text-gray-500">
                  Day 127 of Kurusetra Age
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Badge className="bg-white shadow-[2px_2px_5px_#d9d9d9,-2px_-2px_5px_#ffffff] text-gray-900">
                Rank: 24
              </Badge>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Badge className="bg-white shadow-[2px_2px_5px_#d9d9d9,-2px_-2px_5px_#ffffff] text-gray-900">
                Dewan Raja: Pandawa
              </Badge>
            </motion.div>
          </div>
        </motion.div>

        <Separator className="bg-gray-200 h-[2px] rounded-full" />

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 relative z-10"
        >
          {/* Left Column - Resources */}
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="col-span-1 border-gray-200 shadow-[5px_5px_15px_#d9d9d9,-5px_-5px_15px_#ffffff] bg-white transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-white z-0"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: [0, 10, 0, -10, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 5,
                      ease: "easeInOut",
                    }}
                  >
                    <Coins className="h-5 w-5 text-amber-500" />
                  </motion.div>
                  <span className="text-gray-900">Resources</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                {/* Gold */}
                <motion.div
                  className="space-y-1 p-2 rounded-md hover:bg-amber-50 transition-colors"
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 10,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Coins className="h-4 w-4 text-amber-500" />
                      </motion.div>
                      <span className="font-medium text-gray-900">Gold</span>
                    </div>
                    <span className="font-bold text-amber-600">
                      {resources.gold} / {resources.maxGold}
                    </span>
                  </div>
                  <Progress
                    value={calculateProgress(resources.gold, resources.maxGold)}
                    className="h-2 bg-amber-100 overflow-hidden"
                  />
                  <div className="text-xs text-right text-amber-600 font-medium">
                    +120/hour
                  </div>
                </motion.div>

                {/* Food */}
                <motion.div
                  className="space-y-1 p-2 rounded-md hover:bg-green-50 transition-colors"
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ y: [0, -2, 0, 2, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <Wheat className="h-4 w-4 text-green-500" />
                      </motion.div>
                      <span className="font-medium text-gray-900">Food</span>
                    </div>
                    <span className="font-bold text-green-600">
                      {resources.food} / {resources.maxFood}
                    </span>
                  </div>
                  <Progress
                    value={calculateProgress(resources.food, resources.maxFood)}
                    className="h-2 bg-green-100 overflow-hidden"
                  />
                  <div className="text-xs text-right text-green-600 font-medium">
                    +85/hour
                  </div>
                </motion.div>

                {/* Population */}
                <motion.div
                  className="space-y-1 p-2 rounded-md hover:bg-blue-50 transition-colors"
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <Users className="h-4 w-4 text-blue-500" />
                      </motion.div>
                      <span className="font-medium text-gray-900">
                        Population
                      </span>
                    </div>
                    <span className="font-bold text-blue-600">
                      {resources.population} / {resources.maxPopulation}
                    </span>
                  </div>
                  <Progress
                    value={calculateProgress(
                      resources.population,
                      resources.maxPopulation,
                    )}
                    className="h-2 bg-blue-100 overflow-hidden"
                  />
                  <div className="text-xs text-right text-blue-600 font-medium">
                    +5/hour
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Middle Column - Buildings & Army */}
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="col-span-1 border-neuro-primary/20 shadow-neuro-flat bg-neuro-bg transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-neuro-bg z-0"></div>
              <Tabs defaultValue="buildings">
                <CardHeader className="relative z-10">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-neuro-primary">
                      Kingdom Assets
                    </CardTitle>
                    <TabsList className="bg-neuro-bg border border-neuro-primary/20 p-1 shadow-neuro-flat">
                      <TabsTrigger
                        value="buildings"
                        className="flex items-center gap-1 data-[state=active]:bg-neuro-primary/10 data-[state=active]:text-neuro-primary relative overflow-hidden group"
                      >
                        <motion.div
                          animate={{ rotate: [0, 5, 0, -5, 0] }}
                          transition={{
                            repeat: Infinity,
                            duration: 5,
                            ease: "easeInOut",
                          }}
                        >
                          <Building className="h-4 w-4 text-neuro-primary/70 group-data-[state=active]:text-neuro-primary" />
                        </motion.div>
                        <span>Buildings</span>
                        <motion.div
                          className="absolute bottom-0 left-0 h-[2px] bg-neuro-primary w-full scale-x-0 origin-left group-data-[state=active]:scale-x-100"
                          transition={{ duration: 0.2 }}
                        />
                      </TabsTrigger>
                      <TabsTrigger
                        value="army"
                        className="flex items-center gap-1 data-[state=active]:bg-neuro-primary/10 data-[state=active]:text-neuro-primary relative overflow-hidden group"
                      >
                        <motion.div
                          animate={{ rotate: [0, 5, 0, -5, 0] }}
                          transition={{
                            repeat: Infinity,
                            duration: 5,
                            ease: "easeInOut",
                          }}
                        >
                          <Swords className="h-4 w-4 text-neuro-primary/70 group-data-[state=active]:text-neuro-primary" />
                        </motion.div>
                        <span>Army</span>
                        <motion.div
                          className="absolute bottom-0 left-0 h-[2px] bg-neuro-primary w-full scale-x-0 origin-left group-data-[state=active]:scale-x-100"
                          transition={{ duration: 0.2 }}
                        />
                      </TabsTrigger>
                    </TabsList>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <TabsContent value="buildings" className="mt-0">
                    <ScrollArea className="h-[250px]">
                      <div className="space-y-2">
                        {buildings.map((building, index) => (
                          <TooltipProvider key={building.id}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <motion.div
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{
                                    duration: 0.3,
                                    delay: index * 0.1,
                                  }}
                                  whileHover={{ scale: 1.03, x: 5 }}
                                  className="flex justify-between items-center p-3 rounded-md hover:bg-neuro-primary/5 cursor-pointer border border-transparent hover:border-neuro-primary/30 bg-neuro-bg shadow-neuro-flat"
                                >
                                  <div className="flex items-center gap-2">
                                    <motion.div
                                      animate={{ rotate: [0, 10, 0, -10, 0] }}
                                      transition={{
                                        repeat: Infinity,
                                        duration: 5,
                                        ease: "easeInOut",
                                        delay: index * 0.5,
                                      }}
                                      className="text-neuro-primary"
                                    >
                                      {building.icon}
                                    </motion.div>
                                    <span className="font-medium">
                                      {building.name}
                                    </span>
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className="bg-neuro-primary/10 border-neuro-primary/30 text-neuro-primary"
                                  >
                                    Level {building.level}
                                  </Badge>
                                </motion.div>
                              </TooltipTrigger>
                              <TooltipContent className="bg-neuro-bg border-neuro-primary/30 shadow-neuro-flat">
                                <p>{building.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                  <TabsContent value="army" className="mt-0">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          whileHover={{ scale: 1.05, y: -3 }}
                          className="p-3 border border-red-500/20 rounded-md bg-gradient-to-br from-red-500/10 to-transparent backdrop-blur-sm transition-all duration-200 shadow-[0_5px_15px_rgba(0,0,0,0.1)]"
                        >
                          <div className="text-sm text-red-400 flex items-center gap-1">
                            <Swords className="h-3 w-3" />
                            Infantry
                          </div>
                          <div className="text-xl font-bold text-red-500">
                            {army.infantry}
                          </div>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                          whileHover={{ scale: 1.05, y: -3 }}
                          className="p-3 border border-blue-500/20 rounded-md bg-gradient-to-br from-blue-500/10 to-transparent backdrop-blur-sm transition-all duration-200 shadow-[0_5px_15px_rgba(0,0,0,0.1)]"
                        >
                          <div className="text-sm text-blue-400 flex items-center gap-1">
                            <Swords className="h-3 w-3" />
                            Cavalry
                          </div>
                          <div className="text-xl font-bold text-blue-500">
                            {army.cavalry}
                          </div>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                          whileHover={{ scale: 1.05, y: -3 }}
                          className="p-3 border border-green-500/20 rounded-md bg-gradient-to-br from-green-500/10 to-transparent backdrop-blur-sm transition-all duration-200 shadow-[0_5px_15px_rgba(0,0,0,0.1)]"
                        >
                          <div className="text-sm text-green-400 flex items-center gap-1">
                            <Swords className="h-3 w-3" />
                            Archers
                          </div>
                          <div className="text-xl font-bold text-green-500">
                            {army.archers}
                          </div>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.3 }}
                          whileHover={{ scale: 1.05, y: -3 }}
                          className="p-3 border border-purple-500/20 rounded-md bg-gradient-to-br from-purple-500/10 to-transparent backdrop-blur-sm transition-all duration-200 shadow-[0_5px_15px_rgba(0,0,0,0.1)]"
                        >
                          <div className="text-sm text-purple-400 flex items-center gap-1">
                            <Swords className="h-3 w-3" />
                            Special
                          </div>
                          <div className="text-xl font-bold text-purple-500">
                            {army.special}
                          </div>
                        </motion.div>
                      </div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                        whileHover={{ scale: 1.03 }}
                        className="flex justify-between items-center p-3 border border-amber-500/30 rounded-md bg-gradient-to-r from-amber-500/20 to-transparent backdrop-blur-sm shadow-[0_5px_15px_rgba(0,0,0,0.1)]"
                      >
                        <div className="text-sm font-medium flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-amber-500" />
                          Total Army Strength
                        </div>
                        <div className="text-xl font-bold text-amber-500">
                          {army.total}
                        </div>
                      </motion.div>
                    </div>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </motion.div>

          {/* Right Column - Activities */}
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="col-span-1 border-neuro-primary/20 shadow-neuro-flat bg-neuro-bg transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-neuro-bg z-0"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Clock className="h-5 w-5 text-neuro-primary" />
                  </motion.div>
                  <span className="text-neuro-primary">Current Activities</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <ScrollArea className="h-[250px]">
                  <div className="space-y-4">
                    {activities.length > 0 ? (
                      activities.map((activity, index) => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className={`space-y-2 p-3 rounded-md border shadow-md hover:shadow-lg
                        ${activity.type === "building" ? "border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-transparent" : ""}
                        ${activity.type === "training" ? "border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-transparent" : ""}
                        ${activity.type === "attack" ? "border-red-500/30 bg-gradient-to-r from-red-500/10 to-transparent" : ""}
                        ${activity.type === "defense" ? "border-green-500/30 bg-gradient-to-r from-green-500/10 to-transparent" : ""}
                        ${activity.type === "research" ? "border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-transparent" : ""}
                      `}
                          whileHover={{ scale: 1.03, y: -2 }}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{activity.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {activity.description}
                              </div>
                            </div>
                            <motion.div
                              animate={{ scale: [1, 1.05, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <Badge
                                variant="outline"
                                className={`
                              ${activity.type === "building" ? "border-yellow-500/50 text-yellow-500 bg-yellow-500/5" : ""}
                              ${activity.type === "training" ? "border-blue-500/50 text-blue-500 bg-blue-500/5" : ""}
                              ${activity.type === "attack" ? "border-red-500/50 text-red-500 bg-red-500/5" : ""}
                              ${activity.type === "defense" ? "border-green-500/50 text-green-500 bg-green-500/5" : ""}
                              ${activity.type === "research" ? "border-purple-500/50 text-purple-500 bg-purple-500/5" : ""}
                            `}
                              >
                                {formatTimeRemaining(activity.timeRemaining)}
                              </Badge>
                            </motion.div>
                          </div>
                          <div className="relative">
                            <Progress
                              value={calculateActivityProgress(
                                activity.timeRemaining,
                                activity.totalTime,
                              )}
                              className={`h-2 rounded-full overflow-hidden
                            ${activity.type === "building" ? "bg-yellow-500/10" : ""}
                            ${activity.type === "training" ? "bg-blue-500/10" : ""}
                            ${activity.type === "attack" ? "bg-red-500/10" : ""}
                            ${activity.type === "defense" ? "bg-green-500/10" : ""}
                            ${activity.type === "research" ? "bg-purple-500/10" : ""}
                          `}
                            />
                            <motion.div
                              className={`absolute top-0 h-2 rounded-full opacity-30 blur-sm
                            ${activity.type === "building" ? "bg-yellow-500" : ""}
                            ${activity.type === "training" ? "bg-blue-500" : ""}
                            ${activity.type === "attack" ? "bg-red-500" : ""}
                            ${activity.type === "defense" ? "bg-green-500" : ""}
                            ${activity.type === "research" ? "bg-purple-500" : ""}
                          `}
                              style={{
                                width: `${calculateActivityProgress(activity.timeRemaining, activity.totalTime)}%`,
                                boxShadow: `0 0 10px ${
                                  activity.type === "building"
                                    ? "rgba(234, 179, 8, 0.5)"
                                    : activity.type === "training"
                                      ? "rgba(59, 130, 246, 0.5)"
                                      : activity.type === "attack"
                                        ? "rgba(239, 68, 68, 0.5)"
                                        : activity.type === "defense"
                                          ? "rgba(34, 197, 94, 0.5)"
                                          : "rgba(168, 85, 247, 0.5)"
                                }`,
                              }}
                            />
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center justify-center h-[200px] text-center text-muted-foreground"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          <Clock className="h-10 w-10 mb-2 opacity-20" />
                        </motion.div>
                        <p>No active tasks</p>
                        <p className="text-sm">Your kingdom is idle</p>
                      </motion.div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default KingdomOverview;
