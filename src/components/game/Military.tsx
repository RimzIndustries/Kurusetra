import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sword, Shield, Clock, Coins, Wheat, Users } from "lucide-react";

const Military = () => {
  // Mock data for troops
  const [troops, setTroops] = useState([
    {
      id: 1,
      name: "Swordsmen",
      count: 120,
      attack: 8,
      defense: 10,
      speed: 5,
      goldCost: 150,
      foodCost: 50,
      trainingTime: "30m",
      icon: <Sword className="h-6 w-6 text-red-500" />,
    },
    {
      id: 2,
      name: "Archers",
      count: 85,
      attack: 12,
      defense: 4,
      speed: 7,
      goldCost: 200,
      foodCost: 40,
      trainingTime: "45m",
      icon: <Sword className="h-6 w-6 text-green-500" />,
    },
    {
      id: 3,
      name: "Cavalry",
      count: 45,
      attack: 15,
      defense: 8,
      speed: 12,
      goldCost: 350,
      foodCost: 100,
      trainingTime: "1h 30m",
      icon: <Sword className="h-6 w-6 text-blue-500" />,
    },
  ]);

  // Mock data for training in progress
  const [trainingInProgress, setTrainingInProgress] = useState([
    {
      id: 1,
      troopName: "Swordsmen",
      count: 25,
      progress: 67,
      timeRemaining: "10m",
    },
    {
      id: 2,
      troopName: "Archers",
      count: 15,
      progress: 33,
      timeRemaining: "30m",
    },
  ]);

  // Mock data for available troops to train
  const [availableTroops, setAvailableTroops] = useState([
    {
      id: 4,
      name: "Elite Guards",
      attack: 20,
      defense: 18,
      speed: 6,
      goldCost: 500,
      foodCost: 150,
      trainingTime: "2h",
      requirements: "Barracks Level 6",
      icon: <Sword className="h-6 w-6 text-purple-500" />,
    },
    {
      id: 5,
      name: "War Elephants",
      attack: 25,
      defense: 22,
      speed: 4,
      goldCost: 800,
      foodCost: 300,
      trainingTime: "4h",
      requirements: "Stable Level 5",
      icon: <Sword className="h-6 w-6 text-yellow-500" />,
    },
  ]);

  // State for troop training form
  const [trainingCount, setTrainingCount] = useState(10);
  const [selectedTroop, setSelectedTroop] = useState(null);

  // Mock function to start training
  const startTraining = (troopId, count) => {
    console.log(`Starting training for ${count} troops of type ${troopId}`);
    // In a real app, this would call an API to start the training
  };

  return (
    <div className="bg-background min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6">Military Management</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <Sword className="h-5 w-5 mr-2 text-red-500" />
                Attack Power
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">1,850</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-500" />
                Defense Power
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">2,120</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <Users className="h-5 w-5 mr-2 text-green-500" />
                Total Troops
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">250</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="current">Current Army</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
            <TabsTrigger value="new">New Units</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {troops.map((troop) => (
                <Card key={troop.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/50 pb-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        {troop.icon}
                        <div>
                          <CardTitle className="text-xl">
                            {troop.name}
                          </CardTitle>
                          <Badge variant="outline" className="mt-1">
                            {troop.count} units
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Attack</p>
                        <p className="font-medium">{troop.attack}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Defense</p>
                        <p className="font-medium">{troop.defense}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Speed</p>
                        <p className="font-medium">{troop.speed}</p>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Cost per unit
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Coins className="h-4 w-4 text-yellow-500" />
                          <span>{troop.goldCost}</span>
                          <Wheat className="h-4 w-4 text-green-500 ml-2" />
                          <span>{troop.foodCost}</span>
                        </div>
                      </div>
                      <Button size="sm" onClick={() => setSelectedTroop(troop)}>
                        Train More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedTroop && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Train {selectedTroop.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium mb-1 block">
                        Number of units to train
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={trainingCount}
                        onChange={(e) =>
                          setTrainingCount(parseInt(e.target.value) || 1)
                        }
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Total Cost</p>
                      <div className="flex items-center gap-2">
                        <Coins className="h-4 w-4 text-yellow-500" />
                        <span>{selectedTroop.goldCost * trainingCount}</span>
                        <Wheat className="h-4 w-4 text-green-500 ml-2" />
                        <span>{selectedTroop.foodCost * trainingCount}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Training Time</p>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{selectedTroop.trainingTime}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedTroop(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() =>
                        startTraining(selectedTroop.id, trainingCount)
                      }
                    >
                      Start Training
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="training" className="space-y-6">
            {trainingInProgress.length > 0 ? (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">In Progress</h2>
                {trainingInProgress.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <span className="text-lg font-medium">
                            {item.troopName}
                          </span>
                          <span className="text-sm text-muted-foreground ml-2">
                            ({item.count} units)
                          </span>
                        </div>
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
                <Sword className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">
                  No Training in Progress
                </h3>
                <p className="text-muted-foreground mt-2">
                  Start training new troops from the Current Army tab.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="new" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availableTroops.map((troop) => (
                <Card key={troop.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/50 pb-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        {troop.icon}
                        <CardTitle className="text-xl">{troop.name}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Attack</p>
                        <p className="font-medium">{troop.attack}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Defense</p>
                        <p className="font-medium">{troop.defense}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Speed</p>
                        <p className="font-medium">{troop.speed}</p>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center">
                          <Coins className="h-4 w-4 mr-1 text-yellow-500" />
                          Cost per unit:
                        </span>
                        <span>{troop.goldCost}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center">
                          <Wheat className="h-4 w-4 mr-1 text-green-500" />
                          Food per unit:
                        </span>
                        <span>{troop.foodCost}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" /> Training time:
                        </span>
                        <span>{troop.trainingTime}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="text-sm">
                        <span className="font-medium">Requirements:</span>{" "}
                        {troop.requirements}
                      </div>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => console.log(`Unlock ${troop.name}`)}
                    >
                      Unlock Unit
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

export default Military;
