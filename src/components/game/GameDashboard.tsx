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
import { NeumorphicCard, NeumorphicButton, NeumorphicContainer, NeumorphicBadge, NeumorphicProgress } from "@/styles/components";
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
    <NeumorphicContainer className="min-h-screen relative overflow-hidden">
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
          <NeumorphicCard className={`${raceDetails.color} overflow-hidden transition-all duration-300`}>
            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/50 rounded-full">
                    <Crown className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h1 className={`text-2xl font-bold ${raceDetails.textColor}`}>
                      {userProfile.kingdomName || "Your Kingdom"}
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                      <NeumorphicBadge type="info" className={`${raceDetails.textColor}`}>
                        {raceDetails.name} Race
                      </NeumorphicBadge>
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
                  <NeumorphicButton onClick={handleRefresh} disabled={isRefreshing}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </NeumorphicButton>
                  <NeumorphicButton onClick={() => navigate('/map')}>
                    <Map className="h-4 w-4 mr-2" />
                    View Map
                  </NeumorphicButton>
                </div>
              </div>
            </div>
          </NeumorphicCard>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <motion.div variants={itemVariants} className="mb-6">
              <NeumorphicCard>
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">Kingdom Overview</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Resources</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span>Gold</span>
                            <span className="font-medium">12,450</span>
                          </div>
                          <NeumorphicProgress value={75} />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span>Food</span>
                            <span className="font-medium">8,320</span>
                          </div>
                          <NeumorphicProgress value={60} />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Military</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span>Infantry</span>
                            <span className="font-medium">450</span>
                          </div>
                          <NeumorphicProgress value={45} />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span>Archers</span>
                            <span className="font-medium">320</span>
                          </div>
                          <NeumorphicProgress value={32} />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span>Cavalry</span>
                            <span className="font-medium">120</span>
                          </div>
                          <NeumorphicProgress value={12} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </NeumorphicCard>
            </motion.div>

            <motion.div variants={itemVariants}>
              <NeumorphicCard>
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">Active Tasks</h2>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Building Barracks</span>
                        <span className="font-medium">45%</span>
                      </div>
                      <NeumorphicProgress value={45} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Training Infantry</span>
                        <span className="font-medium">30%</span>
                      </div>
                      <NeumorphicProgress value={30} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Researching Technology</span>
                        <span className="font-medium">15%</span>
                      </div>
                      <NeumorphicProgress value={15} />
                    </div>
                  </div>
                </div>
              </NeumorphicCard>
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <motion.div variants={itemVariants} className="mb-6">
              <NeumorphicCard>
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">Notifications</h2>
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <Bell className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{notification.message}</p>
                          <p className="text-sm text-muted-foreground">{notification.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </NeumorphicCard>
            </motion.div>

            <motion.div variants={itemVariants}>
              <NeumorphicCard>
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">Online Users</h2>
                  <OnlineUsers />
                </div>
              </NeumorphicCard>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </NeumorphicContainer>
  );
};

export default GameDashboard;
