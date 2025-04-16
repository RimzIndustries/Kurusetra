import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useMultiplayer } from "@/contexts/MultiplayerContext";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Building,
  Sword,
  Users,
  Clock,
  ChevronRight,
  Crown,
  MapPin,
  Map,
  Bell,
  RefreshCw,
  Sparkles,
  Zap,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ActionPanel from "./ActionPanel";
import OnlineUsers from "./OnlineUsers";

/**
 * GameDashboard Component
 * Main dashboard interface for the Kurusetra game that displays:
 * - Kingdom information and race details
 * - Military, building, and alliance statistics
 * - Active tasks and their progress
 * - Recent notifications
 * - Kingdom stats (resources, military, buildings)
 * - Online users
 */
const GameDashboard = () => {
  const { userProfile } = useAuth();
  const { onlineUsers } = useMultiplayer();
  const navigate = useNavigate();
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simulate data refresh when refresh button is clicked
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Get race details based on selected race ID
  const getRaceDetails = () => {
    // This should match the race IDs from RaceSelection component
    const races = {
      ksatriya: {
        name: "Ksatriya",
        description:
          "The most intelligent beings who live prosperously in the lowlands.",
        color: "bg-amber-100 border-amber-300",
        textColor: "text-amber-800",
      },
      wanamarta: {
        name: "Wanamarta",
        description:
          "Mystical beings who live in dense forests filled with magical auras.",
        color: "bg-emerald-100 border-emerald-300",
        textColor: "text-emerald-800",
      },
      wirabumi: {
        name: "Wirabumi",
        description:
          "Hard-working beings who live in hidden areas, caves, and underground.",
        color: "bg-stone-100 border-stone-300",
        textColor: "text-stone-800",
      },
      jatayu: {
        name: "Jatayu",
        description:
          "Flying beings who live in highlands with incredible attack capabilities.",
        color: "bg-sky-100 border-sky-300",
        textColor: "text-sky-800",
      },
      kurawa: {
        name: "Kurawa",
        description:
          "The most cunning lowland beings in the Kurusetra universe.",
        color: "bg-purple-100 border-purple-300",
        textColor: "text-purple-800",
      },
      tibrasara: {
        name: "Tibrasara",
        description:
          "Mysterious beings who live in dark forests with unparalleled archery skills.",
        color: "bg-indigo-100 border-indigo-300",
        textColor: "text-indigo-800",
      },
      raksasa: {
        name: "Raksasa",
        description:
          "Enormous and terrifying beings who inhabit steep rocky hills.",
        color: "bg-red-100 border-red-300",
        textColor: "text-red-800",
      },
      dedemit: {
        name: "Dedemit",
        description:
          "Spectral beings who exist in the realm of wandering spirits.",
        color: "bg-slate-100 border-slate-300",
        textColor: "text-slate-800",
      },
    };

    return userProfile.race && races[userProfile.race as keyof typeof races]
      ? races[userProfile.race as keyof typeof races]
      : {
          name: "Unknown",
          description: "No race selected.",
          color: "bg-gray-100 border-gray-300",
          textColor: "text-gray-800",
        };
  };

  const raceDetails = getRaceDetails();

  // Mock data for notifications
  const notifications = [
    {
      id: 1,
      type: "building",
      message: "Barracks completed",
      time: "2 minutes ago",
    },
    {
      id: 2,
      type: "combat",
      message: "Your army returned victorious",
      time: "1 hour ago",
    },
    {
      id: 3,
      type: "alliance",
      message: "New message from Dewan Raja",
      time: "3 hours ago",
    },
  ];

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
      },
    },
  };

  return (
    <div className="bg-neuro-bg min-h-screen bg-gradient-to-b from-neuro-bg to-neuro-bg/95 relative overflow-hidden">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="container mx-auto py-6 px-4"
      >
        {/* Floating particles effect for visual enhancement */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-primary/5"
              style={{
                width: Math.random() * 100 + 50,
                height: Math.random() * 100 + 50,
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                x: [null, Math.random() * window.innerWidth],
                y: [null, Math.random() * window.innerHeight],
              }}
              transition={{
                duration: Math.random() * 60 + 60,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>
        <motion.div variants={itemVariants} className="mb-6">
          <Card
            className={`${raceDetails.color} shadow-neuro-flat-lg overflow-hidden transition-all duration-300`}
          >
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/50 rounded-full shadow-neuro-flat">
                    <Crown className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h1
                      className={`text-2xl font-bold ${raceDetails.textColor}`}
                    >
                      {userProfile.kingdomName || "Your Kingdom"}
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        className={`${raceDetails.color} ${raceDetails.textColor} border shadow-neuro-flat`}
                      >
                        {raceDetails.name} Race
                      </Badge>
                      {userProfile.kingdomCapital && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          Capital: {userProfile.kingdomCapital}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="shadow-neuro-flat bg-white/50 hover:shadow-neuro-convex transition-all duration-300"
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          Day 127
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Current game day</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="shadow-neuro-flat bg-white/50 hover:shadow-neuro-convex transition-all duration-300"
                        >
                          <Users className="mr-2 h-4 w-4" />
                          {onlineUsers.length} Online
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Players currently online</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="shadow-neuro-flat bg-white/50 hover:shadow-neuro-convex transition-all duration-300"
                          onClick={() => navigate("/map")}
                        >
                          <Map className="mr-2 h-4 w-4" />
                          World Map
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View the world map</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="shadow-neuro-flat bg-white/50 hover:shadow-neuro-convex transition-all duration-300"
                          onClick={handleRefresh}
                        >
                          <RefreshCw
                            className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                          />
                          Refresh
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Refresh kingdom data</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <motion.div variants={itemVariants} className="lg:col-span-3">
            <ActionPanel />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Card className="bg-neuro-bg shadow-neuro-flat hover:shadow-neuro-convex transition-all duration-300 neuro-glow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center">
                      <Sword className="h-5 w-5 mr-2 text-red-500" />
                      Military Power
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <p className="text-3xl font-bold text-red-500">1,850</p>
                      <Badge className="ml-2 bg-red-100 text-red-800 border-red-200">
                        +120
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Increased from last week
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Card className="bg-neuro-bg shadow-neuro-flat hover:shadow-neuro-convex transition-all duration-300 neuro-glow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center">
                      <Building className="h-5 w-5 mr-2 text-blue-500" />
                      Buildings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <p className="text-3xl font-bold text-blue-500">12</p>
                      <Badge className="ml-2 bg-blue-100 text-blue-800 border-blue-200">
                        +1
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      1 under construction
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Card className="bg-neuro-bg shadow-neuro-flat hover:shadow-neuro-convex transition-all duration-300 neuro-glow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-green-500" />
                      Alliances
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <p className="text-3xl font-bold text-green-500">3</p>
                      <Badge className="ml-2 bg-green-100 text-green-800 border-green-200">
                        Active
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      2 active trade agreements
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <Card className="mt-6 bg-neuro-bg shadow-neuro-flat hover:shadow-neuro-convex transition-all duration-300 neuro-glow">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-amber-500" />
                      Active Tasks
                    </CardTitle>
                    <CardDescription>Time-based activities</CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-amber-100 text-amber-800 border-amber-300"
                  >
                    3 In Progress
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="p-3 rounded-lg hover:bg-accent/10 transition-colors"
                  >
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium flex items-center gap-2">
                        <Building className="h-4 w-4 text-blue-500" />
                        Building: Archery Range
                      </span>
                      <span className="font-bold">67%</span>
                    </div>
                    <Progress value={67} className="h-2 bg-blue-100">
                      <div className="h-full bg-blue-500 rounded-full" />
                    </Progress>
                    <p className="text-xs text-muted-foreground mt-1 flex justify-between">
                      <span>Started: 4h ago</span>
                      <span className="font-medium">Completes in 2h 15m</span>
                    </p>
                  </motion.div>

                  <Separator />

                  <motion.div
                    whileHover={{ x: 5 }}
                    className="p-3 rounded-lg hover:bg-accent/10 transition-colors"
                  >
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium flex items-center gap-2">
                        <Sword className="h-4 w-4 text-red-500" />
                        Training: Archers
                      </span>
                      <span className="font-bold">34%</span>
                    </div>
                    <Progress value={34} className="h-2 bg-red-100">
                      <div className="h-full bg-red-500 rounded-full" />
                    </Progress>
                    <p className="text-xs text-muted-foreground mt-1 flex justify-between">
                      <span>Started: 2h ago</span>
                      <span className="font-medium">Completes in 4h 30m</span>
                    </p>
                  </motion.div>

                  <Separator />

                  <motion.div
                    whileHover={{ x: 5 }}
                    className="p-3 rounded-lg hover:bg-accent/10 transition-colors"
                  >
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-purple-500" />
                        Research: Advanced Weapons
                      </span>
                      <span className="font-bold">12%</span>
                    </div>
                    <Progress value={12} className="h-2 bg-purple-100">
                      <div className="h-full bg-purple-500 rounded-full" />
                    </Progress>
                    <p className="text-xs text-muted-foreground mt-1 flex justify-between">
                      <span>Started: 1h ago</span>
                      <span className="font-medium">Completes in 8h 45m</span>
                    </p>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="lg:col-span-1">
            <Card className="bg-neuro-bg shadow-neuro-flat hover:shadow-neuro-convex transition-all duration-300 neuro-glow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Notifications
                  </CardTitle>
                  <CardDescription>Recent kingdom activities</CardDescription>
                </div>
                <Badge variant="outline" className="bg-primary/10">
                  {notifications.length} New
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <AnimatePresence>
                    {(showAllNotifications
                      ? notifications
                      : notifications.slice(0, 3)
                    ).map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        className="flex items-start space-x-3 p-3 rounded-md hover:bg-accent/10 transition-colors cursor-pointer border border-transparent hover:border-accent/20"
                      >
                        <div className="p-2 rounded-full bg-accent/10">
                          {notification.type === "building" && (
                            <Building className="h-5 w-5 text-blue-500" />
                          )}
                          {notification.type === "combat" && (
                            <Sword className="h-5 w-5 text-red-500" />
                          )}
                          {notification.type === "alliance" && (
                            <Shield className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {notification.time}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full hover:bg-accent/10 transition-colors"
                  onClick={() => setShowAllNotifications(!showAllNotifications)}
                >
                  <motion.div
                    className="flex items-center justify-center w-full"
                    whileHover={{ x: showAllNotifications ? -5 : 5 }}
                  >
                    {showAllNotifications ? "Show Less" : "View All Activities"}
                    <motion.div
                      animate={{ rotate: showAllNotifications ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </motion.div>
                  </motion.div>
                </Button>
              </CardFooter>
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
                      <span className="text-sm font-medium">12,450</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Food:</span>
                      <span className="text-sm font-medium">8,320</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Production Rate:</span>
                      <span className="text-sm font-medium">+245/hr</span>
                    </div>
                  </TabsContent>
                  <TabsContent value="military" className="space-y-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Infantry:</span>
                      <span className="text-sm font-medium">450</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Archers:</span>
                      <span className="text-sm font-medium">320</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Cavalry:</span>
                      <span className="text-sm font-medium">120</span>
                    </div>
                  </TabsContent>
                  <TabsContent value="buildings" className="space-y-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Barracks:</span>
                      <span className="text-sm font-medium">Level 4</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Farm:</span>
                      <span className="text-sm font-medium">Level 5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Treasury:</span>
                      <span className="text-sm font-medium">Level 3</span>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <motion.div variants={itemVariants} className="mt-6">
              <OnlineUsers />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default GameDashboard;
