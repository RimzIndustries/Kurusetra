import React, { useState } from "react";
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
} from "lucide-react";

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
}) => {
  const [combatType, setCombatType] = useState("warfare");
  const [selectedKingdom, setSelectedKingdom] = useState("");
  const [selectedTroops, setSelectedTroops] = useState<Record<string, number>>(
    {},
  );
  const [selectedSpies, setSelectedSpies] = useState<Record<string, number>>(
    {},
  );
  const [attackTime, setAttackTime] = useState<number>(0);

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

  const handleLaunchAttack = () => {
    // This would connect to the game's backend to initiate the attack
    console.log("Attack launched against", selectedKingdom);
    console.log("Combat type:", combatType);
    console.log("Selected troops:", selectedTroops);
    console.log("Selected spies:", selectedSpies);
    console.log("Attack time:", attackTime);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-8 bg-background rounded-xl shadow-lg border border-border/30">
      <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent">
        Kurusetra Combat Command
      </h1>

      <Tabs
        defaultValue="warfare"
        className="w-full"
        onValueChange={setCombatType}
      >
        <TabsList className="grid w-full grid-cols-2 mb-10 p-1 bg-muted/50">
          <TabsTrigger value="warfare" className="flex items-center gap-2 py-3">
            <Sword className="h-5 w-5" />
            <span className="font-medium">Direct Warfare</span>
          </TabsTrigger>
          <TabsTrigger
            value="espionage"
            className="flex items-center gap-2 py-3"
          >
            <Eye className="h-5 w-5" />
            <span className="font-medium">Covert Operations</span>
          </TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Target Selection */}
          <Card className="md:col-span-1 border-border/50 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="border-b border-border/20 pb-4">
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
                  <div className="space-y-4 mt-6 p-4 bg-muted/30 rounded-lg border border-border/30">
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
                            <span className="text-sm font-medium">Race:</span>
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

          {/* Middle Column - Force Selection */}
          <Card className="md:col-span-1 border-border/50 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="border-b border-border/20 pb-4">
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
                      <div
                        key={troop.id}
                        className="space-y-3 p-3 rounded-lg border border-border/30 bg-card/50 hover:bg-card/80 transition-colors"
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
                        <div className="flex justify-between text-xs bg-muted/50 p-1.5 rounded-md">
                          <span className="flex items-center gap-1">
                            <Sword className="h-3.5 w-3.5" /> Power:{" "}
                            {troop.power}
                          </span>
                          <span className="flex items-center gap-1">
                            <ArrowRight className="h-3.5 w-3.5" /> Speed:{" "}
                            {troop.speed}
                          </span>
                        </div>
                      </div>
                    ))
                  : // Spy selection for espionage
                    spies.map((spy) => (
                      <div
                        key={spy.id}
                        className="space-y-3 p-3 rounded-lg border border-border/30 bg-card/50 hover:bg-card/80 transition-colors"
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
                        <div className="flex justify-center text-xs bg-muted/50 p-1.5 rounded-md">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3.5 w-3.5" /> Infiltration Skill:{" "}
                            {spy.skill}
                          </span>
                        </div>
                      </div>
                    ))}
              </div>
            </CardContent>
          </Card>

          {/* Right Column - Attack Planning */}
          <Card className="md:col-span-1 border-border/50 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="border-b border-border/20 pb-4">
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

                <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border/30">
                  <h4 className="font-semibold text-primary mb-2">
                    Mission Summary
                  </h4>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Mission Type:</span>
                    <Badge className="bg-primary/90 hover:bg-primary">
                      {combatType === "warfare"
                        ? "Direct Attack"
                        : "Covert Operation"}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Travel Time:</span>
                    <span className="font-medium">{calculateTravelTime()}</span>
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
                  <Button
                    className="w-full py-6 text-base font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
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
                    <Flag className="mr-2 h-5 w-5" />
                    Launch {combatType === "warfare" ? "Attack" : "Mission"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="border-primary/20">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-bold flex items-center gap-2">
                      {combatType === "warfare" ? (
                        <Sword className="h-5 w-5 text-primary" />
                      ) : (
                        <Eye className="h-5 w-5 text-primary" />
                      )}
                      Confirm {combatType === "warfare" ? "Attack" : "Mission"}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="mt-2 text-base">
                      {combatType === "warfare"
                        ? `You are about to launch an attack against ${kingdoms.find((k) => k.id === selectedKingdom)?.name} with ${Object.values(selectedTroops).reduce((sum, val) => sum + val, 0)} troops.`
                        : `You are about to launch a covert operation against ${kingdoms.find((k) => k.id === selectedKingdom)?.name} with ${Object.values(selectedSpies).reduce((sum, val) => sum + val, 0)} spies.`}
                      <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-center gap-2">
                        <Skull className="h-5 w-5 text-destructive" />
                        <span>
                          This action cannot be undone once your forces are
                          deployed.
                        </span>
                      </div>
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
        </div>
      </Tabs>
    </div>
  );
};

export default CombatInterface;
