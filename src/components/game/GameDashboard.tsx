import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useMultiplayer } from "@/contexts/MultiplayerContext";
import {
  Shield,
  Building,
  Sword,
  Users,
  Clock,
  ChevronRight,
  Crown,
  MapPin,
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
import ActionPanel from "./ActionPanel";
import OnlineUsers from "./OnlineUsers";

const GameDashboard = () => {
  const { userProfile } = useAuth();
  const { onlineUsers } = useMultiplayer();

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
    <div className="bg-background min-h-screen bg-gradient-to-b from-background to-background/95 relative overflow-hidden">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="container mx-auto py-6 px-4"
      >
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
                  <Button
                    variant="outline"
                    size="sm"
                    className="shadow-neuro-flat bg-white/50"
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Day 127
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="shadow-neuro-flat bg-white/50"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    {onlineUsers.length} Online
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <motion.div variants={itemVariants} className="lg:col-span-3">
            <ActionPanel />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <Card className="bg-neuro-bg shadow-neuro-flat hover:shadow-neuro-convex transition-all duration-300 neuro-glow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center">
                    <Sword className="h-5 w-5 mr-2 text-red-500" />
                    Military Power
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-red-500">1,850</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    +120 from last week
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-neuro-bg shadow-neuro-flat hover:shadow-neuro-convex transition-all duration-300 neuro-glow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center">
                    <Building className="h-5 w-5 mr-2 text-blue-500" />
                    Buildings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-blue-500">12</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    1 under construction
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-neuro-bg shadow-neuro-flat hover:shadow-neuro-convex transition-all duration-300 neuro-glow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-green-500" />
                    Alliances
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-500">3</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    2 active trade agreements
                  </p>
                </CardContent>
              </Card>
            </div>

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
          </motion.div>

          <motion.div variants={itemVariants} className="lg:col-span-1">
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
