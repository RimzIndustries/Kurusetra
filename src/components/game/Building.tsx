import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Building2, ArrowUp, Clock, Coins, Wheat } from "lucide-react";

const Building = () => {
  // Mock data for buildings
  const [buildings, setBuildings] = useState([
    {
      id: 1,
      name: "Barracks",
      level: 4,
      description: "Train military units",
      goldCost: 2500,
      foodCost: 1200,
      timeToUpgrade: "8h",
      icon: <Building2 className="h-8 w-8 text-red-500" />,
    },
    {
      id: 2,
      name: "Farm",
      level: 5,
      description: "Produces food resources",
      goldCost: 1800,
      foodCost: 800,
      timeToUpgrade: "6h",
      icon: <Wheat className="h-8 w-8 text-green-500" />,
    },
    {
      id: 3,
      name: "Treasury",
      level: 3,
      description: "Stores and generates gold",
      goldCost: 3000,
      foodCost: 1500,
      timeToUpgrade: "10h",
      icon: <Coins className="h-8 w-8 text-yellow-500" />,
    },
  ]);

  // Mock data for construction in progress
  const [constructionInProgress, setConstructionInProgress] = useState([
    {
      id: 1,
      buildingName: "Archery Range",
      progress: 67,
      timeRemaining: "2h 15m",
    },
  ]);

  // Mock data for available buildings to construct
  const [availableBuildings, setAvailableBuildings] = useState([
    {
      id: 4,
      name: "Stable",
      description: "Train cavalry units",
      goldCost: 4000,
      foodCost: 2000,
      timeToConstruct: "12h",
      requirements: "Barracks Level 5",
      icon: <Building2 className="h-8 w-8 text-blue-500" />,
    },
    {
      id: 5,
      name: "Market",
      description: "Trade resources with other kingdoms",
      goldCost: 3500,
      foodCost: 1800,
      timeToConstruct: "8h",
      requirements: "Treasury Level 4",
      icon: <Building2 className="h-8 w-8 text-purple-500" />,
    },
  ]);

  // Mock function to start upgrade
  const startUpgrade = (buildingId) => {
    console.log(`Starting upgrade for building ${buildingId}`);
    // In a real app, this would call an API to start the upgrade
  };

  // Mock function to start construction
  const startConstruction = (buildingId) => {
    console.log(`Starting construction for building ${buildingId}`);
    // In a real app, this would call an API to start the construction
  };

  return (
    <div className="bg-background min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6">Building Management</h1>

        <Tabs defaultValue="existing" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="existing">Existing Buildings</TabsTrigger>
            <TabsTrigger value="construction">Construction</TabsTrigger>
            <TabsTrigger value="new">New Buildings</TabsTrigger>
          </TabsList>

          <TabsContent value="existing" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {buildings.map((building) => (
                <Card key={building.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/50 pb-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        {building.icon}
                        <div>
                          <CardTitle className="text-xl">
                            {building.name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            Level {building.level}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm mb-4">{building.description}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center">
                          <Coins className="h-4 w-4 mr-1 text-yellow-500" />
                          Upgrade Cost:
                        </span>
                        <span>{building.goldCost}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center">
                          <Wheat className="h-4 w-4 mr-1 text-green-500" />
                          Food Cost:
                        </span>
                        <span>{building.foodCost}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" /> Time:
                        </span>
                        <span>{building.timeToUpgrade}</span>
                      </div>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => startUpgrade(building.id)}
                    >
                      <ArrowUp className="h-4 w-4 mr-2" /> Upgrade to Level{" "}
                      {building.level + 1}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="construction" className="space-y-6">
            {constructionInProgress.length > 0 ? (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">In Progress</h2>
                {constructionInProgress.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="pt-6">
                      <div className="flex justify-between text-lg mb-2">
                        <span>{item.buildingName}</span>
                        <span>{item.progress}%</span>
                      </div>
                      <Progress value={item.progress} className="h-2 mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Completes in {item.timeRemaining}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">
                  No Construction in Progress
                </h3>
                <p className="text-muted-foreground mt-2">
                  Start a new building project from the New Buildings tab.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="new" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availableBuildings.map((building) => (
                <Card key={building.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/50 pb-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        {building.icon}
                        <CardTitle className="text-xl">
                          {building.name}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm mb-4">{building.description}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center">
                          <Coins className="h-4 w-4 mr-1 text-yellow-500" />
                          Cost:
                        </span>
                        <span>{building.goldCost}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center">
                          <Wheat className="h-4 w-4 mr-1 text-green-500" />
                          Food Cost:
                        </span>
                        <span>{building.foodCost}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" /> Time:
                        </span>
                        <span>{building.timeToConstruct}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="text-sm">
                        <span className="font-medium">Requirements:</span>{" "}
                        {building.requirements}
                      </div>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => startConstruction(building.id)}
                    >
                      Construct
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Building;
