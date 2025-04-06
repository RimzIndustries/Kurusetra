import React from "react";
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
    <div className="w-full h-full bg-background p-4 flex flex-col gap-4">
      {/* Kingdom Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{kingdomName}</h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{race}</Badge>
            <span className="text-sm text-muted-foreground">
              Day 127 of Kurusetra Age
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-amber-500">Rank: 24</Badge>
          <Badge className="bg-blue-500">Dewan Raja: Pandawa</Badge>
        </div>
      </div>

      <Separator />

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
        {/* Left Column - Resources */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5" />
              Resources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Gold */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Coins className="h-4 w-4 text-yellow-500" />
                  <span>Gold</span>
                </div>
                <span>
                  {resources.gold} / {resources.maxGold}
                </span>
              </div>
              <Progress
                value={calculateProgress(resources.gold, resources.maxGold)}
                className="h-2"
              />
              <div className="text-xs text-right text-muted-foreground">
                +120/hour
              </div>
            </div>

            {/* Food */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Wheat className="h-4 w-4 text-green-500" />
                  <span>Food</span>
                </div>
                <span>
                  {resources.food} / {resources.maxFood}
                </span>
              </div>
              <Progress
                value={calculateProgress(resources.food, resources.maxFood)}
                className="h-2"
              />
              <div className="text-xs text-right text-muted-foreground">
                +85/hour
              </div>
            </div>

            {/* Population */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span>Population</span>
                </div>
                <span>
                  {resources.population} / {resources.maxPopulation}
                </span>
              </div>
              <Progress
                value={calculateProgress(
                  resources.population,
                  resources.maxPopulation,
                )}
                className="h-2"
              />
              <div className="text-xs text-right text-muted-foreground">
                +5/hour
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Middle Column - Buildings & Army */}
        <Card className="col-span-1">
          <Tabs defaultValue="buildings">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Kingdom Assets</CardTitle>
                <TabsList>
                  <TabsTrigger
                    value="buildings"
                    className="flex items-center gap-1"
                  >
                    <Building className="h-4 w-4" />
                    Buildings
                  </TabsTrigger>
                  <TabsTrigger value="army" className="flex items-center gap-1">
                    <Swords className="h-4 w-4" />
                    Army
                  </TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>
            <CardContent>
              <TabsContent value="buildings" className="mt-0">
                <ScrollArea className="h-[250px]">
                  <div className="space-y-2">
                    {buildings.map((building) => (
                      <TooltipProvider key={building.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex justify-between items-center p-2 rounded-md hover:bg-accent cursor-pointer">
                              <div className="flex items-center gap-2">
                                {building.icon}
                                <span>{building.name}</span>
                              </div>
                              <Badge variant="outline">
                                Level {building.level}
                              </Badge>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
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
                    <div className="p-3 border rounded-md">
                      <div className="text-sm text-muted-foreground">
                        Infantry
                      </div>
                      <div className="text-xl font-bold">{army.infantry}</div>
                    </div>
                    <div className="p-3 border rounded-md">
                      <div className="text-sm text-muted-foreground">
                        Cavalry
                      </div>
                      <div className="text-xl font-bold">{army.cavalry}</div>
                    </div>
                    <div className="p-3 border rounded-md">
                      <div className="text-sm text-muted-foreground">
                        Archers
                      </div>
                      <div className="text-xl font-bold">{army.archers}</div>
                    </div>
                    <div className="p-3 border rounded-md">
                      <div className="text-sm text-muted-foreground">
                        Special
                      </div>
                      <div className="text-xl font-bold">{army.special}</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-md bg-muted">
                    <div className="text-sm font-medium">
                      Total Army Strength
                    </div>
                    <div className="text-xl font-bold">{army.total}</div>
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

        {/* Right Column - Activities */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Current Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[250px]">
              <div className="space-y-4">
                {activities.length > 0 ? (
                  activities.map((activity) => (
                    <div key={activity.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{activity.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {activity.description}
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={`
                            ${activity.type === "building" ? "border-yellow-500 text-yellow-500" : ""}
                            ${activity.type === "training" ? "border-blue-500 text-blue-500" : ""}
                            ${activity.type === "attack" ? "border-red-500 text-red-500" : ""}
                            ${activity.type === "defense" ? "border-green-500 text-green-500" : ""}
                            ${activity.type === "research" ? "border-purple-500 text-purple-500" : ""}
                          `}
                        >
                          {formatTimeRemaining(activity.timeRemaining)}
                        </Badge>
                      </div>
                      <Progress
                        value={calculateActivityProgress(
                          activity.timeRemaining,
                          activity.totalTime,
                        )}
                        className={`h-1 
                          ${activity.type === "building" ? "bg-yellow-500/20" : ""}
                          ${activity.type === "training" ? "bg-blue-500/20" : ""}
                          ${activity.type === "attack" ? "bg-red-500/20" : ""}
                          ${activity.type === "defense" ? "bg-green-500/20" : ""}
                          ${activity.type === "research" ? "bg-purple-500/20" : ""}
                        `}
                      />
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-[200px] text-center text-muted-foreground">
                    <Clock className="h-10 w-10 mb-2 opacity-20" />
                    <p>No active tasks</p>
                    <p className="text-sm">Your kingdom is idle</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KingdomOverview;
