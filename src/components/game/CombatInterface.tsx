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
}

const CombatInterface: React.FC<CombatInterfaceProps> = ({
  kingdoms = [
    {
      id: "1",
      name: "Hastinapura",
      race: "Ksatriya",
      strength: 85,
      distance: 12,
    },
    {
      id: "2",
      name: "Indraprastha",
      race: "Wanamarta",
      strength: 72,
      distance: 8,
    },
    { id: "3", name: "Dwaraka", race: "Wirabumi", strength: 65, distance: 15 },
    { id: "4", name: "Matsya", race: "Jatayu", strength: 60, distance: 10 },
    { id: "5", name: "Magadha", race: "Kurawa", strength: 78, distance: 14 },
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
            <motion.div
              className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-red-500 to-amber-500 z-10"
              animate={{
                width: "50%",
                x: combatType === "warfare" ? "0%" : "50%",
              }}
              transition={{ duration: 0.3 }}
            />
            <TabsTrigger
              value="warfare"
              className="flex items-center gap-2 py-4 transition-all duration-300 data-[state=active]:bg-gradient-to-b data-[state=active]:from-transparent data-[state=active]:to-muted/80"
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
              className="flex items-center gap-2 py-4 transition-all duration-300 data-[state=active]:bg-gradient-to-b data-[state=active]:from-transparent data-[state=active]:to-muted/80"
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
                          variant="neuro-convex"
                          className="w-full py-6 text-base font-semibold transition-all duration-300 bg-neuro-bg text-foreground relative overflow-hidden group"
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
                        <AlertDialogCancel className="font-medium">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleLaunchAttack}
                          className="bg-primary hover:bg-primary/90 font-medium"
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
