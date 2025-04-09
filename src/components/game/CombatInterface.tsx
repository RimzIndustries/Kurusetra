import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Shield,
  Sword,
  Eye,
  Clock,
  Users,
  ArrowRight,
  Target,
  Skull,
  Flag,
  Flame,
  Compass,
  Wifi,
  WifiOff,
  Building,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Types for client-side prediction and reconciliation
type AttackAction = {
  id: string;
  targetKingdomId: string;
  combatType: string;
  troops: Record<string, number>;
  spies: Record<string, number>;
  attackTime: number;
  tactic?: "direct" | "flanking" | "siege" | "guerrilla";
  status: "pending" | "confirmed" | "rejected" | "completed";
  timestamp: number;
  prediction?: {
    travelTime: string;
    successProbability: number;
    estimatedCompletionTime: number;
  };
  serverResponse?: any;
};

type ScoutAction = {
  id: string;
  targetKingdomId: string;
  spies: Record<string, number>;
  scoutTime: number;
  scoutType: "basic" | "detailed" | "infiltration";
  status: "pending" | "confirmed" | "rejected" | "completed";
  timestamp: number;
  prediction?: {
    travelTime: string;
    successProbability: number;
    estimatedCompletionTime: number;
  };
  serverResponse?: any;
};

interface CombatInterfaceProps {
  kingdoms?: Array<{
    id: string;
    name: string;
    race: string;
    strength: number;
    distance: number;
    resources?: {
      gold: number;
      food: number;
      population: number;
    };
    defenses?: {
      walls: number;
      towers: number;
      traps: number;
    };
    activity?: {
      lastActive: string;
      buildingInProgress?: string;
      militaryActivity?: string;
    };
    scoutingReport?: {
      timestamp: string;
      accuracy: number;
      details: string;
    };
  }>;
  troops?: Array<{
    id: string;
    name: string;
    type: string;
    count: number;
    power: number;
    speed: number;
  }>;
  spies?: Array<{
    id: string;
    name: string;
    skill: number;
    count: number;
  }>;
  onAttackLaunched?: (attackData: AttackAction) => Promise<any>;
  onScoutLaunched?: (scoutData: ScoutAction) => Promise<any>;
}

const CombatInterface: React.FC<CombatInterfaceProps> = ({
  kingdoms = [
    {
      id: "1",
      name: "Hastinapura",
      race: "Ksatriya",
      strength: 85,
      distance: 12,
      resources: { gold: 8500, food: 7200, population: 950 },
      defenses: { walls: 4, towers: 6, traps: 8 },
      activity: {
        lastActive: "2 hours ago",
        buildingInProgress: "Upgrading Treasury",
        militaryActivity: "Training Infantry",
      },
    },
    {
      id: "2",
      name: "Indraprastha",
      race: "Wanamarta",
      strength: 72,
      distance: 8,
      resources: { gold: 6200, food: 5800, population: 720 },
      defenses: { walls: 3, towers: 4, traps: 5 },
      activity: {
        lastActive: "30 minutes ago",
        buildingInProgress: "Upgrading Barracks",
      },
    },
    {
      id: "3",
      name: "Dwaraka",
      race: "Wirabumi",
      strength: 65,
      distance: 15,
      resources: { gold: 5500, food: 6300, population: 680 },
      defenses: { walls: 2, towers: 3, traps: 7 },
      activity: {
        lastActive: "1 day ago",
        militaryActivity: "Recruiting Archers",
      },
    },
    {
      id: "4",
      name: "Matsya",
      race: "Jatayu",
      strength: 60,
      distance: 10,
      resources: { gold: 4800, food: 5200, population: 590 },
      defenses: { walls: 2, towers: 2, traps: 4 },
      activity: {
        lastActive: "3 hours ago",
      },
    },
    {
      id: "5",
      name: "Magadha",
      race: "Kurawa",
      strength: 78,
      distance: 14,
      resources: { gold: 7800, food: 6800, population: 850 },
      defenses: { walls: 3, towers: 5, traps: 6 },
      activity: {
        lastActive: "5 hours ago",
        buildingInProgress: "Constructing Wall",
        militaryActivity: "Training Cavalry",
      },
    },
    {
      id: "6",
      name: "Ayodhya",
      race: "Ksatriya",
      strength: 82,
      distance: 18,
      resources: { gold: 8200, food: 7500, population: 920 },
      defenses: { walls: 4, towers: 5, traps: 7 },
      activity: {
        lastActive: "1 hour ago",
        militaryActivity: "Training War Elephants",
      },
    },
    {
      id: "7",
      name: "Kamboja",
      race: "Wirabumi",
      strength: 75,
      distance: 22,
      resources: { gold: 7100, food: 6500, population: 780 },
      defenses: { walls: 3, towers: 4, traps: 6 },
      activity: {
        lastActive: "6 hours ago",
        buildingInProgress: "Upgrading Farm",
      },
    },
    {
      id: "8",
      name: "Gandhara",
      race: "Jatayu",
      strength: 68,
      distance: 25,
      resources: { gold: 6400, food: 5900, population: 710 },
      defenses: { walls: 2, towers: 3, traps: 5 },
      activity: {
        lastActive: "2 days ago",
      },
    },
    {
      id: "9",
      name: "Pancala",
      race: "Wanamarta",
      strength: 79,
      distance: 13,
      resources: { gold: 7600, food: 7000, population: 830 },
      defenses: { walls: 3, towers: 5, traps: 7 },
      activity: {
        lastActive: "4 hours ago",
        buildingInProgress: "Upgrading Castle",
        militaryActivity: "Training Infantry",
      },
    },
    {
      id: "10",
      name: "Kasi",
      race: "Kurawa",
      strength: 70,
      distance: 16,
      resources: { gold: 6800, food: 6200, population: 740 },
      defenses: { walls: 3, towers: 3, traps: 5 },
      activity: {
        lastActive: "8 hours ago",
      },
    },
    {
      id: "11",
      name: "Anga",
      race: "Ksatriya",
      strength: 63,
      distance: 20,
      resources: { gold: 5900, food: 5500, population: 650 },
      defenses: { walls: 2, towers: 2, traps: 4 },
      activity: {
        lastActive: "1 day ago",
      },
    },
    {
      id: "12",
      name: "Kalinga",
      race: "Jatayu",
      strength: 77,
      distance: 24,
      resources: { gold: 7400, food: 6700, population: 810 },
      defenses: { walls: 3, towers: 4, traps: 6 },
      activity: {
        lastActive: "12 hours ago",
        militaryActivity: "Training Archers",
      },
    },
    {
      id: "13",
      name: "Sindhu",
      race: "Wirabumi",
      strength: 81,
      distance: 19,
      resources: { gold: 8000, food: 7300, population: 890 },
      defenses: { walls: 4, towers: 5, traps: 7 },
      activity: {
        lastActive: "3 hours ago",
        buildingInProgress: "Upgrading Treasury",
      },
    },
    {
      id: "14",
      name: "Vidarbha",
      race: "Wanamarta",
      strength: 67,
      distance: 17,
      resources: { gold: 6300, food: 5800, population: 700 },
      defenses: { walls: 2, towers: 3, traps: 5 },
      activity: {
        lastActive: "9 hours ago",
      },
    },
    {
      id: "15",
      name: "Surastra",
      race: "Kurawa",
      strength: 73,
      distance: 21,
      resources: { gold: 7000, food: 6400, population: 760 },
      defenses: { walls: 3, towers: 4, traps: 6 },
      activity: {
        lastActive: "5 hours ago",
        militaryActivity: "Training Cavalry",
      },
    },
  ],
  troops = [
    {
      id: "1",
      name: "Infantry",
      type: "Ground",
      count: 500,
      power: 5,
      speed: 2,
    },
    {
      id: "2",
      name: "Archers",
      type: "Ranged",
      count: 300,
      power: 8,
      speed: 3,
    },
    {
      id: "3",
      name: "Cavalry",
      type: "Mounted",
      count: 150,
      power: 12,
      speed: 5,
    },
    {
      id: "4",
      name: "War Elephants",
      type: "Heavy",
      count: 50,
      power: 20,
      speed: 1,
    },
  ],
  spies = [
    { id: "1", name: "Scout", skill: 60, count: 10 },
    { id: "2", name: "Infiltrator", skill: 75, count: 5 },
    { id: "3", name: "Saboteur", skill: 85, count: 3 },
  ],
  onAttackLaunched = async (attackData: AttackAction) => {
    // Mock server response with a delay to simulate network latency
    return new Promise((resolve) => {
      setTimeout(
        () => {
          resolve({
            success: Math.random() > 0.1, // 90% success rate for demo
            attackId: attackData.id,
            message: "Attack processed by server",
            actualTravelTime: attackData.prediction?.travelTime,
            actualSuccessProbability: attackData.prediction?.successProbability,
          });
        },
        800 + Math.random() * 1200,
      ); // Random delay between 800-2000ms
    });
  },
}) => {
  const { user, supabase } = useAuth();
  const [combatType, setCombatType] = useState("warfare");
  const [selectedKingdom, setSelectedKingdom] = useState("");
  const [selectedTroops, setSelectedTroops] = useState<Record<string, number>>(
    {},
  );
  const [selectedSpies, setSelectedSpies] = useState<Record<string, number>>(
    {},
  );
  const [attackTime, setAttackTime] = useState<number>(0);
  const [selectedTactic, setSelectedTactic] = useState<
    "direct" | "flanking" | "siege" | "guerrilla"
  >("direct");
  const [scoutType, setScoutType] = useState<
    "basic" | "detailed" | "infiltration"
  >("basic");
  const [showScoutingInterface, setShowScoutingInterface] = useState(false);
  const [scoutingReports, setScoutingReports] = useState<Record<string, any>>(
    {},
  );

  // Client-side prediction states
  const [pendingAttacks, setPendingAttacks] = useState<AttackAction[]>([]);
  const [confirmedAttacks, setConfirmedAttacks] = useState<AttackAction[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState<
    "synced" | "syncing" | "offline"
  >("synced");

  // Queue for storing actions when offline
  const offlineActionsQueue = useRef<AttackAction[]>([]);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      processPendingActions();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus("offline");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Process any pending actions when coming back online
  const processPendingActions = useCallback(async () => {
    if (offlineActionsQueue.current.length > 0) {
      setSyncStatus("syncing");

      // Process each action in the queue
      for (const action of [...offlineActionsQueue.current]) {
        try {
          const response = await onAttackLaunched(action);

          // Remove from offline queue
          offlineActionsQueue.current = offlineActionsQueue.current.filter(
            (a) => a.id !== action.id,
          );

          // Update confirmed attacks
          if (response.success) {
            setConfirmedAttacks((prev) => [
              ...prev,
              { ...action, status: "confirmed", serverResponse: response },
            ]);

            // Remove from pending
            setPendingAttacks((prev) => prev.filter((a) => a.id !== action.id));
          } else {
            // Handle rejected attack
            setPendingAttacks((prev) =>
              prev.map((a) =>
                a.id === action.id
                  ? { ...a, status: "rejected", serverResponse: response }
                  : a,
              ),
            );
          }
        } catch (error) {
          console.error("Error processing offline action:", error);
          // Keep in queue to retry later
        }
      }

      setSyncStatus("synced");
    }
  }, [onAttackLaunched]);

  // Calculate estimated travel time based on distance and troop speed
  const calculateTravelTime = () => {
    if (!selectedKingdom) return "Select a target kingdom";

    const kingdom = kingdoms.find((k) => k.id === selectedKingdom);
    if (!kingdom) return "Unknown";

    // For warfare, calculate based on slowest troop
    if (combatType === "warfare") {
      const selectedTroopIds = Object.keys(selectedTroops).filter(
        (id) => selectedTroops[id] > 0,
      );
      if (selectedTroopIds.length === 0) return "Select troops";

      const slowestTroop = troops
        .filter((t) => selectedTroopIds.includes(t.id))
        .reduce(
          (slowest, current) =>
            current.speed < slowest.speed ? current : slowest,
          troops[0],
        );

      const hours = Math.ceil(kingdom.distance / slowestTroop.speed);
      return `${hours} hours`;
    }
    // For espionage, calculate based on mission type
    else {
      // Assume spies are faster than troops
      const baseHours = Math.ceil(kingdom.distance / 4);
      return `${baseHours} hours`;
    }
  };

  // Calculate success probability
  const calculateSuccessProbability = () => {
    if (!selectedKingdom) return 0;

    const kingdom = kingdoms.find((k) => k.id === selectedKingdom);
    if (!kingdom) return 0;

    if (combatType === "warfare") {
      let totalPower = 0;
      Object.keys(selectedTroops).forEach((troopId) => {
        const troop = troops.find((t) => t.id === troopId);
        if (troop) {
          totalPower += troop.power * selectedTroops[troopId];
        }
      });

      // Simple formula: power vs kingdom strength
      const ratio = totalPower / kingdom.strength;
      return Math.min(Math.floor(ratio * 100), 95); // Cap at 95%
    } else {
      let totalSkill = 0;
      Object.keys(selectedSpies).forEach((spyId) => {
        const spy = spies.find((s) => s.id === spyId);
        if (spy) {
          totalSkill += spy.skill * selectedSpies[spyId];
        }
      });

      // Simple formula: skill vs kingdom strength
      const ratio = totalSkill / (kingdom.strength * 2);
      return Math.min(Math.floor(ratio * 100), 90); // Cap at 90%
    }
  };

  const handleTroopSelection = (troopId: string, value: number) => {
    setSelectedTroops((prev) => ({
      ...prev,
      [troopId]: value,
    }));
  };

  const handleSpySelection = (spyId: string, value: number) => {
    setSelectedSpies((prev) => ({
      ...prev,
      [spyId]: value,
    }));
  };

  // Enhanced attack handler with client-side prediction
  const handleLaunchAttack = async () => {
    if (!selectedKingdom) return;

    // Generate a unique ID for this attack
    const attackId = `attack_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create the attack action with prediction
    const attackAction: AttackAction = {
      id: attackId,
      targetKingdomId: selectedKingdom,
      combatType,
      troops: { ...selectedTroops },
      spies: { ...selectedSpies },
      attackTime,
      tactic: selectedTactic,
      status: "pending",
      timestamp: Date.now(),
      prediction: {
        travelTime: calculateTravelTime(),
        successProbability: calculateSuccessProbability(),
        estimatedCompletionTime: Date.now() + attackTime * 60 * 60 * 1000,
      },
    };

    // Immediately update UI with predicted result (optimistic update)
    setPendingAttacks((prev) => [...prev, attackAction]);

    // Clear selection for next attack
    setSelectedKingdom("");
    setSelectedTroops({});
    setSelectedSpies({});
    setAttackTime(0);

    try {
      if (isOnline) {
        // Send to server
        const response = await onAttackLaunched(attackAction);

        // Update with server response
        if (response.success) {
          // Move from pending to confirmed
          setPendingAttacks((prev) => prev.filter((a) => a.id !== attackId));
          setConfirmedAttacks((prev) => [
            ...prev,
            {
              ...attackAction,
              status: "confirmed",
              serverResponse: response,
            },
          ]);
        } else {
          // Server rejected the attack
          setPendingAttacks((prev) =>
            prev.map((a) =>
              a.id === attackId
                ? { ...a, status: "rejected", serverResponse: response }
                : a,
            ),
          );
        }
      } else {
        // Store in offline queue to process when back online
        offlineActionsQueue.current.push(attackAction);
      }
    } catch (error) {
      console.error("Error launching attack:", error);
      // Mark as failed in UI
      setPendingAttacks((prev) =>
        prev.map((a) =>
          a.id === attackId
            ? {
                ...a,
                status: "rejected",
                serverResponse: { error: "Network error" },
              }
            : a,
        ),
      );
    }
  };

  // Handle scouting mission
  const handleLaunchScout = async () => {
    if (!selectedKingdom) return;

    // Generate a unique ID for this scouting mission
    const scoutId = `scout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create the scout action with prediction
    const scoutAction: ScoutAction = {
      id: scoutId,
      targetKingdomId: selectedKingdom,
      spies: { ...selectedSpies },
      scoutTime: 0, // Immediate scouting
      scoutType,
      status: "pending",
      timestamp: Date.now(),
      prediction: {
        travelTime: calculateTravelTime(),
        successProbability: calculateSuccessProbability() + 10, // Scouting has higher success rate
        estimatedCompletionTime:
          Date.now() +
          (calculateTravelTime().includes("hours")
            ? parseInt(calculateTravelTime().split(" ")[0]) * 60 * 60 * 1000
            : 3600000),
      },
    };

    // Update UI with predicted result
    setPendingAttacks((prev) => [...prev, scoutAction as any]);

    // Clear selection for next scouting mission
    setSelectedSpies({});
    setShowScoutingInterface(false);

    try {
      if (isOnline) {
        // Mock scouting response for now
        setTimeout(() => {
          // Update kingdom with scouting report
          const kingdom = kingdoms.find((k) => k.id === selectedKingdom);
          if (kingdom) {
            const accuracy =
              scoutType === "basic" ? 70 : scoutType === "detailed" ? 85 : 95;
            const scoutingReport = {
              timestamp: new Date().toLocaleString(),
              accuracy,
              details: `Our spies have gathered ${scoutType} intelligence on ${kingdom.name}. Their defenses are ${kingdom.defenses?.walls ? `Level ${kingdom.defenses.walls}` : "unknown"} and they have approximately ${kingdom.resources?.gold ? kingdom.resources.gold : "unknown"} gold.`,
            };

            // Store scouting report
            setScoutingReports((prev) => ({
              ...prev,
              [selectedKingdom]: scoutingReport,
            }));

            // Move from pending to confirmed
            setPendingAttacks((prev) => prev.filter((a) => a.id !== scoutId));
            setConfirmedAttacks((prev) => [
              ...prev,
              {
                ...scoutAction,
                status: "confirmed",
                serverResponse: {
                  success: true,
                  message: "Scouting mission successful",
                },
              } as any,
            ]);
          }
        }, 2000);
      } else {
        // Store in offline queue
        offlineActionsQueue.current.push(scoutAction as any);
      }
    } catch (error) {
      console.error("Error launching scouting mission:", error);
      // Mark as failed in UI
      setPendingAttacks((prev) =>
        prev.map((a) =>
          a.id === scoutId
            ? {
                ...a,
                status: "rejected",
                serverResponse: { error: "Network error" },
              }
            : a,
        ),
      );
    }
  };

  return (
    <div className="bg-background min-h-screen p-6 bg-gradient-to-b from-background to-background/95 relative overflow-hidden">
      <div className="w-full max-w-6xl mx-auto p-8 bg-neuro-bg rounded-xl shadow-neuro-flat-lg relative overflow-hidden">
        {/* Enhanced background decorative elements */}
        <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&q=80')] bg-cover opacity-20"></div>
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1,
            }}
            className="absolute -bottom-24 -right-24 w-96 h-96 bg-red-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 2,
            }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl"
          />
        </div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-red-500 via-primary to-amber-500 bg-clip-text text-transparent flex items-center justify-center gap-3 drop-shadow-sm"
        >
          <motion.div
            animate={{ rotate: [0, 5, 0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          >
            <Flame className="h-8 w-8 text-red-500" />
          </motion.div>
          Kurusetra Combat Command
          <motion.div
            animate={{ rotate: [0, -5, 0, 5, 0] }}
            transition={{
              repeat: Infinity,
              duration: 5,
              ease: "easeInOut",
              delay: 0.5,
            }}
          >
            <Flame className="h-8 w-8 text-red-500" />
          </motion.div>
        </motion.h1>

        {/* Network status indicator */}
        <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-neuro-bg shadow-neuro-pressed">
          {isOnline ? (
            <>
              <Wifi className="h-4 w-4 text-green-500" />
              <span className="text-xs font-medium">
                {syncStatus === "synced" ? "Online" : "Syncing..."}
              </span>
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4 text-red-500" />
              <span className="text-xs font-medium">Offline</span>
            </>
          )}
        </div>

        <Tabs
          defaultValue="warfare"
          className="w-full relative z-10"
          onValueChange={setCombatType}
        >
          <TabsList className="grid w-full grid-cols-2 mb-10 p-1 bg-neuro-bg shadow-neuro-concave rounded-xl overflow-hidden relative">
            <TabsTrigger
              value="warfare"
              className="flex items-center justify-center gap-2 py-4 transition-all duration-300 data-[state=active]:bg-neuro-primary/10 data-[state=active]:text-neuro-primary data-[state=active]:shadow-neuro-flat hover:bg-neuro-primary/5 neuro-hover"
            >
              <motion.div
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Sword className="h-5 w-5 text-red-500" />
              </motion.div>
              <span className="font-medium">Direct Warfare</span>
            </TabsTrigger>
            <TabsTrigger
              value="espionage"
              className="flex items-center justify-center gap-2 py-4 transition-all duration-300 data-[state=active]:bg-neuro-primary/10 data-[state=active]:text-neuro-primary data-[state=active]:shadow-neuro-flat hover:bg-neuro-primary/5 neuro-hover"
            >
              <motion.div
                whileHover={{ scale: 1.2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Eye className="h-5 w-5 text-blue-500" />
              </motion.div>
              <span className="font-medium">Covert Operations</span>
            </TabsTrigger>
          </TabsList>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Left Column - Target Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="md:col-span-1 bg-neuro-bg shadow-neuro-flat hover:shadow-neuro-convex transition-all duration-300 hover:translate-y-[-5px]">
                <CardHeader className="border-b border-neuro-shadow/10 pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Target className="h-6 w-6 text-primary" />
                    <span>Target Selection</span>
                  </CardTitle>
                  <CardDescription className="mt-1.5">
                    Choose a kingdom to attack
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="kingdom">Target Kingdom</Label>
                      <Select
                        value={selectedKingdom}
                        onValueChange={setSelectedKingdom}
                      >
                        <SelectTrigger id="kingdom">
                          <SelectValue placeholder="Select a kingdom" />
                        </SelectTrigger>
                        <SelectContent>
                          {kingdoms.map((kingdom) => (
                            <SelectItem key={kingdom.id} value={kingdom.id}>
                              {kingdom.name} ({kingdom.race})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedKingdom && (
                      <div className="space-y-4 mt-6 p-4 bg-neuro-bg rounded-lg shadow-neuro-pressed transition-all duration-300 hover:shadow-neuro-concave">
                        {(() => {
                          const kingdom = kingdoms.find(
                            (k) => k.id === selectedKingdom,
                          );
                          if (!kingdom) return null;

                          return (
                            <>
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">
                                  Kingdom:
                                </span>
                                <span className="font-bold text-primary">
                                  {kingdom.name}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">
                                  Race:
                                </span>
                                <Badge
                                  variant="outline"
                                  className="font-medium border-primary/30"
                                >
                                  {kingdom.race}
                                </Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">
                                  Strength:
                                </span>
                                <div className="flex items-center gap-2">
                                  <Progress
                                    value={kingdom.strength}
                                    className="w-24 h-2.5"
                                  />
                                  <span className="font-medium">
                                    {kingdom.strength}%
                                  </span>
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">
                                  Distance:
                                </span>
                                <span className="font-medium">
                                  {kingdom.distance} units
                                </span>
                              </div>

                              {/* Enhanced kingdom information */}
                              {kingdom.resources && (
                                <div className="mt-4">
                                  <h4 className="text-sm font-semibold mb-2 text-primary">
                                    Resources
                                  </h4>
                                  <div className="grid grid-cols-3 gap-2 text-xs">
                                    <div className="flex flex-col items-center p-1.5 bg-neuro-bg shadow-neuro-pressed rounded-md">
                                      <span className="text-amber-500 font-medium">
                                        Gold
                                      </span>
                                      <span>{kingdom.resources.gold}</span>
                                    </div>
                                    <div className="flex flex-col items-center p-1.5 bg-neuro-bg shadow-neuro-pressed rounded-md">
                                      <span className="text-green-500 font-medium">
                                        Food
                                      </span>
                                      <span>{kingdom.resources.food}</span>
                                    </div>
                                    <div className="flex flex-col items-center p-1.5 bg-neuro-bg shadow-neuro-pressed rounded-md">
                                      <span className="text-blue-500 font-medium">
                                        Population
                                      </span>
                                      <span>
                                        {kingdom.resources.population}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {kingdom.defenses && (
                                <div className="mt-4">
                                  <h4 className="text-sm font-semibold mb-2 text-primary">
                                    Defenses
                                  </h4>
                                  <div className="grid grid-cols-3 gap-2 text-xs">
                                    <div className="flex flex-col items-center p-1.5 bg-neuro-bg shadow-neuro-pressed rounded-md">
                                      <span className="text-stone-500 font-medium">
                                        Walls
                                      </span>
                                      <span>
                                        Level {kingdom.defenses.walls}
                                      </span>
                                    </div>
                                    <div className="flex flex-col items-center p-1.5 bg-neuro-bg shadow-neuro-pressed rounded-md">
                                      <span className="text-stone-500 font-medium">
                                        Towers
                                      </span>
                                      <span>
                                        Level {kingdom.defenses.towers}
                                      </span>
                                    </div>
                                    <div className="flex flex-col items-center p-1.5 bg-neuro-bg shadow-neuro-pressed rounded-md">
                                      <span className="text-stone-500 font-medium">
                                        Traps
                                      </span>
                                      <span>
                                        Level {kingdom.defenses.traps}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {kingdom.activity && (
                                <div className="mt-4">
                                  <h4 className="text-sm font-semibold mb-2 text-primary">
                                    Recent Activity
                                  </h4>
                                  <div className="space-y-1 text-xs">
                                    <div className="flex justify-between">
                                      <span>Last Active:</span>
                                      <span className="font-medium">
                                        {kingdom.activity.lastActive}
                                      </span>
                                    </div>
                                    {kingdom.activity.buildingInProgress && (
                                      <div className="flex justify-between">
                                        <span>Building:</span>
                                        <span className="font-medium">
                                          {kingdom.activity.buildingInProgress}
                                        </span>
                                      </div>
                                    )}
                                    {kingdom.activity.militaryActivity && (
                                      <div className="flex justify-between">
                                        <span>Military:</span>
                                        <span className="font-medium">
                                          {kingdom.activity.militaryActivity}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Scouting report if available */}
                              {kingdom.scoutingReport && (
                                <div className="mt-4 p-2 border border-blue-500/30 rounded-md bg-blue-500/5">
                                  <h4 className="text-sm font-semibold mb-1 text-blue-500">
                                    Scouting Report
                                  </h4>
                                  <div className="space-y-1 text-xs">
                                    <div className="flex justify-between">
                                      <span>Timestamp:</span>
                                      <span className="font-medium">
                                        {kingdom.scoutingReport.timestamp}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Accuracy:</span>
                                      <span className="font-medium">
                                        {kingdom.scoutingReport.accuracy}%
                                      </span>
                                    </div>
                                    <p className="text-xs mt-1">
                                      {kingdom.scoutingReport.details}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {/* Scout button */}
                              <div className="mt-4">
                                <Button
                                  size="sm"
                                  className="w-full text-xs flex items-center justify-center gap-1 bg-neuro-bg text-neuro-primary shadow-neuro-flat hover:shadow-neuro-pressed border-neuro-primary/20"
                                  onClick={() =>
                                    setShowScoutingInterface(
                                      !showScoutingInterface,
                                    )
                                  }
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  {showScoutingInterface
                                    ? "Hide Scouting"
                                    : "Scout Kingdom"}
                                </Button>
                              </div>

                              {/* Scouting interface */}
                              {showScoutingInterface && (
                                <div className="mt-4 p-3 border border-blue-500/20 rounded-md bg-blue-500/5">
                                  <h4 className="text-sm font-semibold mb-2 text-blue-500">
                                    Scouting Mission
                                  </h4>

                                  <div className="space-y-3">
                                    <div className="space-y-1">
                                      <Label
                                        htmlFor="scout-type"
                                        className="text-xs"
                                      >
                                        Scout Type
                                      </Label>
                                      <Select
                                        value={scoutType}
                                        onValueChange={(value: any) =>
                                          setScoutType(value)
                                        }
                                      >
                                        <SelectTrigger
                                          id="scout-type"
                                          className="h-8 text-xs"
                                        >
                                          <SelectValue placeholder="Select scout type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="basic">
                                            Basic Reconnaissance
                                          </SelectItem>
                                          <SelectItem value="detailed">
                                            Detailed Intelligence
                                          </SelectItem>
                                          <SelectItem value="infiltration">
                                            Deep Infiltration
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div className="space-y-1">
                                      <Label className="text-xs">
                                        Select Spies
                                      </Label>
                                      <div className="space-y-2">
                                        {spies.map((spy) => (
                                          <div
                                            key={spy.id}
                                            className="flex justify-between items-center text-xs"
                                          >
                                            <span>
                                              {spy.name} (Skill: {spy.skill})
                                            </span>
                                            <div className="flex items-center gap-2">
                                              <Input
                                                type="number"
                                                min="0"
                                                max={spy.count}
                                                value={
                                                  selectedSpies[spy.id] || 0
                                                }
                                                onChange={(e) =>
                                                  handleSpySelection(
                                                    spy.id,
                                                    parseInt(e.target.value) ||
                                                      0,
                                                  )
                                                }
                                                className="w-16 h-6 text-xs"
                                              />
                                              <span>/ {spy.count}</span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    <Button
                                      size="sm"
                                      className="w-full mt-2 text-xs flex items-center justify-center gap-1 bg-neuro-bg text-neuro-primary shadow-neuro-flat hover:shadow-neuro-pressed border-neuro-primary/20"
                                      disabled={
                                        Object.values(selectedSpies).reduce(
                                          (sum, val) => sum + val,
                                          0,
                                        ) === 0
                                      }
                                      onClick={() => handleLaunchScout()}
                                    >
                                      <Eye className="h-3.5 w-3.5" />
                                      Launch Scouting Mission
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Middle Column - Force Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="md:col-span-1 bg-neuro-bg shadow-neuro-flat hover:shadow-neuro-convex transition-all duration-300 hover:translate-y-[-5px]">
                <CardHeader className="border-b border-neuro-shadow/10 pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    {combatType === "warfare" ? (
                      <>
                        <Users className="h-6 w-6 text-primary" />
                        <span>Troop Selection</span>
                      </>
                    ) : (
                      <>
                        <Eye className="h-6 w-6 text-primary" />
                        <span>Spy Selection</span>
                      </>
                    )}
                  </CardTitle>
                  <CardDescription className="mt-1.5">
                    {combatType === "warfare"
                      ? "Select troops to send into battle"
                      : "Select spies for your covert mission"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {combatType === "warfare"
                      ? // Troop selection for warfare
                        troops.map((troop) => (
                          <motion.div
                            key={troop.id}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98, y: 0 }}
                            className="space-y-3 p-3 rounded-lg bg-neuro-bg shadow-neuro-flat hover:shadow-neuro-pressed transition-all duration-300 neuro-glow"
                          >
                            <div className="flex justify-between items-center">
                              <Label
                                htmlFor={`troop-${troop.id}`}
                                className="font-semibold text-sm"
                              >
                                {troop.name}
                              </Label>
                              <Badge
                                variant="outline"
                                className="border-primary/30"
                              >
                                {troop.type}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4">
                              <Slider
                                id={`troop-${troop.id}`}
                                max={troop.count}
                                step={1}
                                value={[selectedTroops[troop.id] || 0]}
                                onValueChange={([value]) =>
                                  handleTroopSelection(troop.id, value)
                                }
                                className="cursor-pointer"
                              />
                              <span className="w-16 text-right font-medium text-sm">
                                {selectedTroops[troop.id] || 0}/{troop.count}
                              </span>
                            </div>
                            <div className="flex justify-between text-xs bg-neuro-bg shadow-neuro-pressed p-1.5 rounded-md">
                              <span className="flex items-center gap-1">
                                <Sword className="h-3.5 w-3.5" /> Power:{" "}
                                {troop.power}
                              </span>
                              <span className="flex items-center gap-1">
                                <ArrowRight className="h-3.5 w-3.5" /> Speed:{" "}
                                {troop.speed}
                              </span>
                            </div>
                          </motion.div>
                        ))
                      : // Spy selection for espionage
                        spies.map((spy) => (
                          <motion.div
                            key={spy.id}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98, y: 0 }}
                            className="space-y-3 p-3 rounded-lg bg-neuro-bg shadow-neuro-flat hover:shadow-neuro-pressed transition-all duration-300 neuro-glow"
                          >
                            <div className="flex justify-between items-center">
                              <Label
                                htmlFor={`spy-${spy.id}`}
                                className="font-semibold text-sm"
                              >
                                {spy.name}
                              </Label>
                              <Badge
                                variant="outline"
                                className="border-primary/30"
                              >
                                Skill: {spy.skill}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4">
                              <Slider
                                id={`spy-${spy.id}`}
                                max={spy.count}
                                step={1}
                                value={[selectedSpies[spy.id] || 0]}
                                onValueChange={([value]) =>
                                  handleSpySelection(spy.id, value)
                                }
                                className="cursor-pointer"
                              />
                              <span className="w-16 text-right font-medium text-sm">
                                {selectedSpies[spy.id] || 0}/{spy.count}
                              </span>
                            </div>
                            <div className="flex justify-center text-xs bg-neuro-bg shadow-neuro-pressed p-1.5 rounded-md">
                              <span className="flex items-center gap-1">
                                <Eye className="h-3.5 w-3.5" /> Infiltration
                                Skill: {spy.skill}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Right Column - Attack Planning */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card className="md:col-span-1 bg-neuro-bg shadow-neuro-flat hover:shadow-neuro-convex transition-all duration-300 hover:translate-y-[-5px]">
                <CardHeader className="border-b border-neuro-shadow/10 pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Clock className="h-6 w-6 text-primary" />
                    <span>Attack Planning</span>
                  </CardTitle>
                  <CardDescription className="mt-1.5">
                    Plan your attack timing and review details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="attack-time">Attack Delay (hours)</Label>
                      <div className="flex items-center gap-4">
                        <Slider
                          id="attack-time"
                          max={24}
                          step={1}
                          value={[attackTime]}
                          onValueChange={([value]) => setAttackTime(value)}
                        />
                        <span className="w-12 text-right">{attackTime}h</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Set to 0 for immediate attack or delay up to 24 hours
                      </p>
                    </div>

                    {combatType === "warfare" && (
                      <div className="space-y-2">
                        <Label htmlFor="combat-tactic">Combat Tactic</Label>
                        <Select
                          value={selectedTactic}
                          onValueChange={(value: any) =>
                            setSelectedTactic(value)
                          }
                        >
                          <SelectTrigger id="combat-tactic">
                            <SelectValue placeholder="Select a tactic" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="direct">
                              <div className="flex items-center gap-2">
                                <Sword className="h-4 w-4 text-red-500" />
                                <div>
                                  <span className="font-medium">
                                    Direct Assault
                                  </span>
                                  <p className="text-xs text-muted-foreground">
                                    Balanced approach
                                  </p>
                                </div>
                              </div>
                            </SelectItem>
                            <SelectItem value="flanking">
                              <div className="flex items-center gap-2">
                                <ArrowRight className="h-4 w-4 text-blue-500" />
                                <div>
                                  <span className="font-medium">
                                    Flanking Maneuver
                                  </span>
                                  <p className="text-xs text-muted-foreground">
                                    Speed bonus, defense penalty
                                  </p>
                                </div>
                              </div>
                            </SelectItem>
                            <SelectItem value="siege">
                              <div className="flex items-center gap-2">
                                <Building className="h-4 w-4 text-amber-500" />
                                <div>
                                  <span className="font-medium">
                                    Siege Warfare
                                  </span>
                                  <p className="text-xs text-muted-foreground">
                                    Building damage bonus, speed penalty
                                  </p>
                                </div>
                              </div>
                            </SelectItem>
                            <SelectItem value="guerrilla">
                              <div className="flex items-center gap-2">
                                <Flame className="h-4 w-4 text-green-500" />
                                <div>
                                  <span className="font-medium">
                                    Guerrilla Tactics
                                  </span>
                                  <p className="text-xs text-muted-foreground">
                                    Resource damage bonus, strength penalty
                                  </p>
                                </div>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="p-2 mt-1 text-xs bg-neuro-bg shadow-neuro-pressed rounded-md">
                          {selectedTactic === "direct" && (
                            <p>
                              Standard military approach with balanced offense
                              and defense.
                            </p>
                          )}
                          {selectedTactic === "flanking" && (
                            <p>
                              Attack from multiple sides to bypass defenses.
                              Faster but less powerful.
                            </p>
                          )}
                          {selectedTactic === "siege" && (
                            <p>
                              Focus on destroying buildings and defenses. Slower
                              but more devastating.
                            </p>
                          )}
                          {selectedTactic === "guerrilla" && (
                            <p>
                              Hit-and-run tactics targeting resources. Less
                              direct damage but disrupts economy.
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    <Separator />

                    <div className="space-y-4 p-4 bg-neuro-bg rounded-lg shadow-neuro-pressed transition-all duration-300 hover:shadow-neuro-concave">
                      <h4 className="font-semibold text-primary mb-2">
                        Mission Summary
                      </h4>

                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Mission Type:
                        </span>
                        <Badge className="bg-primary/90 hover:bg-primary">
                          {combatType === "warfare"
                            ? "Direct Attack"
                            : "Covert Operation"}
                        </Badge>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm">Travel Time:</span>
                        <span className="font-medium">
                          {calculateTravelTime()}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm">Success Probability:</span>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={calculateSuccessProbability()}
                            className="w-24"
                          />
                          <span>{calculateSuccessProbability()}%</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm">Total Forces:</span>
                        <span className="font-medium">
                          {combatType === "warfare"
                            ? Object.values(selectedTroops).reduce(
                                (sum, val) => sum + val,
                                0,
                              ) + " troops"
                            : Object.values(selectedSpies).reduce(
                                (sum, val) => sum + val,
                                0,
                              ) + " spies"}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                        className="w-full"
                      >
                        <Button
                          className="w-full py-6 text-base font-semibold transition-all duration-300 bg-neuro-bg text-neuro-primary shadow-neuro-flat hover:shadow-neuro-pressed border-neuro-primary/20 relative overflow-hidden group"
                          disabled={
                            !selectedKingdom ||
                            (combatType === "warfare"
                              ? Object.values(selectedTroops).reduce(
                                  (sum, val) => sum + val,
                                  0,
                                ) === 0
                              : Object.values(selectedSpies).reduce(
                                  (sum, val) => sum + val,
                                  0,
                                ) === 0)
                          }
                        >
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-white/10 to-red-600/0 -translate-x-full"
                            animate={{ x: ["-100%", "200%"] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              repeatDelay: 3,
                            }}
                          />
                          <Flag className="mr-2 h-5 w-5 animate-pulse" />
                          Launch{" "}
                          {combatType === "warfare" ? "Attack" : "Mission"}
                        </Button>
                      </motion.div>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-neuro-bg shadow-neuro-flat">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-bold flex items-center gap-2">
                          {combatType === "warfare" ? (
                            <Sword className="h-5 w-5 text-primary" />
                          ) : (
                            <Eye className="h-5 w-5 text-primary" />
                          )}
                          Confirm{" "}
                          {combatType === "warfare" ? "Attack" : "Mission"}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="mt-2 text-base">
                          {combatType === "warfare"
                            ? `You are about to launch an attack against ${kingdoms.find((k) => k.id === selectedKingdom)?.name} with ${Object.values(selectedTroops).reduce((sum, val) => sum + val, 0)} troops.`
                            : `You are about to launch a covert operation against ${kingdoms.find((k) => k.id === selectedKingdom)?.name} with ${Object.values(selectedSpies).reduce((sum, val) => sum + val, 0)} spies.`}
                          <div className="mt-4 p-3 bg-neuro-bg shadow-neuro-pressed rounded-md flex items-center gap-2 text-destructive">
                            <Skull className="h-5 w-5 text-destructive" />
                            <span>
                              This action cannot be undone once your forces are
                              deployed.
                            </span>
                          </div>
                          {!isOnline && (
                            <div className="mt-2 p-3 bg-neuro-bg shadow-neuro-pressed rounded-md flex items-center gap-2 text-amber-500">
                              <WifiOff className="h-5 w-5 text-amber-500" />
                              <span>
                                You are currently offline. The attack will be
                                queued and sent when you reconnect.
                              </span>
                            </div>
                          )}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="mt-4">
                        <AlertDialogCancel className="border-neuro-primary/30 text-foreground hover:bg-neuro-primary/10 font-medium">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleLaunchAttack}
                          className="bg-neuro-bg text-neuro-primary shadow-neuro-flat hover:shadow-neuro-pressed border-neuro-primary/20 font-medium"
                        >
                          Confirm
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        </Tabs>

        {/* Enhanced decorative compass */}
        <div className="absolute bottom-4 right-4 opacity-20 pointer-events-none">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          >
            <Compass className="h-20 w-20 text-primary" />
          </motion.div>
        </div>

        {/* Pending attacks display */}
        {pendingAttacks.length > 0 && (
          <div className="mt-8 p-4 bg-neuro-bg shadow-neuro-flat rounded-xl">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Pending Operations ({pendingAttacks.length})
            </h3>
            <div className="space-y-3">
              {pendingAttacks.map((attack) => (
                <div
                  key={attack.id}
                  className={`p-3 rounded-lg bg-neuro-bg ${attack.status === "rejected" ? "shadow-neuro-pressed border border-red-500/30" : "shadow-neuro-pressed"} flex justify-between items-center`}
                >
                  <div>
                    <div className="font-medium">
                      {attack.combatType === "warfare"
                        ? "Attack on "
                        : "Espionage on "}
                      {
                        kingdoms.find((k) => k.id === attack.targetKingdomId)
                          ?.name
                      }
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ETA: {attack.prediction?.travelTime} • Success:{" "}
                      {attack.prediction?.successProbability}%
                    </div>
                  </div>
                  <Badge
                    variant={
                      attack.status === "pending"
                        ? "outline"
                        : attack.status === "rejected"
                          ? "destructive"
                          : "default"
                    }
                  >
                    {attack.status === "pending"
                      ? "Processing"
                      : attack.status === "rejected"
                        ? "Failed"
                        : "Confirmed"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Confirmed attacks display */}
        {confirmedAttacks.length > 0 && (
          <div className="mt-4 p-4 bg-neuro-bg shadow-neuro-flat rounded-xl">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Flag className="h-5 w-5 text-green-500" />
              Active Operations ({confirmedAttacks.length})
            </h3>
            <div className="space-y-3">
              {confirmedAttacks.map((attack) => (
                <div
                  key={attack.id}
                  className="p-3 rounded-lg bg-neuro-bg shadow-neuro-pressed flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium">
                      {attack.combatType === "warfare"
                        ? "Attack on "
                        : "Espionage on "}
                      {
                        kingdoms.find((k) => k.id === attack.targetKingdomId)
                          ?.name
                      }
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ETA: {attack.prediction?.travelTime} • Success:{" "}
                      {attack.prediction?.successProbability}%
                    </div>
                  </div>
                  <Badge variant="success" className="bg-green-500">
                    In Progress
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CombatInterface;
