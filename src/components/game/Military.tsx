import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sword,
  Shield,
  Clock,
  Coins,
  Wheat,
  Users,
  Flag,
  Award,
} from "lucide-react";

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

  const cardHoverVariants = {
    hover: {
      scale: 1.02,
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
      transition: {
        type: "spring",
        stiffness: 300,
      },
    },
  };

  return (
    <div className="bg-background min-h-screen p-6 bg-gradient-to-b from-background to-background/95 relative overflow-hidden text-foreground">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto"
      >
        <motion.div
          className="flex items-center gap-3 mb-6"
          variants={itemVariants}
        >
          <Flag className="h-8 w-8 text-red-500" />
          <h1 className="text-4xl font-bold text-neuro-primary">
            Military Management
          </h1>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          variants={itemVariants}
        >
          <motion.div whileHover="hover" variants={cardHoverVariants}>
            <Card className="bg-neuro-bg border-neuro-primary/20 shadow-neuro-flat overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <Sword className="h-5 w-5 mr-2 text-red-500" />
                  Attack Power
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-red-500">1,850</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover="hover" variants={cardHoverVariants}>
            <Card className="bg-neuro-bg border-neuro-primary/20 shadow-neuro-flat overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-blue-500" />
                  Defense Power
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-500">2,120</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover="hover" variants={cardHoverVariants}>
            <Card className="bg-neuro-bg border-neuro-primary/20 shadow-neuro-flat overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <Users className="h-5 w-5 mr-2 text-green-500" />
                  Total Troops
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-500">250</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Tabs defaultValue="current" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-neuro-bg border border-neuro-primary/20 shadow-neuro-flat">
              <TabsTrigger
                value="current"
                className="data-[state=active]:bg-neuro-primary/10 data-[state=active]:text-neuro-primary"
              >
                Current Army
              </TabsTrigger>
              <TabsTrigger
                value="training"
                className="data-[state=active]:bg-neuro-primary/10 data-[state=active]:text-neuro-primary"
              >
                Training
              </TabsTrigger>
              <TabsTrigger
                value="new"
                className="data-[state=active]:bg-neuro-primary/10 data-[state=active]:text-neuro-primary"
              >
                New Units
              </TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="space-y-6">
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {troops.map((troop) => (
                  <motion.div
                    key={troop.id}
                    variants={itemVariants}
                    whileHover="hover"
                  >
                    <Card className="bg-neuro-bg border-neuro-primary/20 shadow-neuro-flat overflow-hidden transition-all duration-300 hover:border-neuro-primary/50 neuro-hover neuro-glow">
                      <CardHeader className="bg-neuro-bg pb-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            {troop.icon}
                            <div>
                              <CardTitle className="text-xl">
                                {troop.name}
                              </CardTitle>
                              <Badge
                                variant="outline"
                                className="mt-1 border-neuro-primary/30 bg-neuro-bg shadow-neuro-flat"
                              >
                                {troop.count} units
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-slate-400">Attack</p>
                            <p className="font-medium flex items-center gap-1">
                              <Sword className="h-3 w-3 text-red-500" />
                              {troop.attack}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">Defense</p>
                            <p className="font-medium flex items-center gap-1">
                              <Shield className="h-3 w-3 text-blue-500" />
                              {troop.defense}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">Speed</p>
                            <p className="font-medium">{troop.speed}</p>
                          </div>
                        </div>
                        <Separator className="my-4 bg-neuro-primary/20" />
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-slate-400">
                              Cost per unit
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Coins className="h-4 w-4 text-yellow-500" />
                              <span>{troop.goldCost}</span>
                              <Wheat className="h-4 w-4 text-green-500 ml-2" />
                              <span>{troop.foodCost}</span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => setSelectedTroop(troop)}
                            className="bg-neuro-bg text-neuro-primary shadow-neuro-flat hover:shadow-neuro-pressed border-neuro-primary/20"
                          >
                            Train More
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              {selectedTroop && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="mt-6 bg-neuro-bg border-neuro-primary/20 shadow-neuro-flat">
                    <CardHeader className="bg-neuro-bg">
                      <CardTitle className="flex items-center gap-2">
                        {selectedTroop.icon}
                        Train {selectedTroop.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
                        <div className="flex-1">
                          <label className="text-sm font-medium mb-1 block text-foreground">
                            Number of units to train
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={trainingCount}
                            onChange={(e) =>
                              setTrainingCount(parseInt(e.target.value) || 1)
                            }
                            className="w-full p-2 border rounded bg-neuro-bg border-neuro-primary/30 text-foreground shadow-neuro-flat"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1 text-foreground">
                            Total Cost
                          </p>
                          <div className="flex items-center gap-2 bg-neuro-bg p-2 rounded-md shadow-neuro-flat">
                            <Coins className="h-4 w-4 text-yellow-500" />
                            <span>
                              {selectedTroop.goldCost * trainingCount}
                            </span>
                            <Wheat className="h-4 w-4 text-green-500 ml-2" />
                            <span>
                              {selectedTroop.foodCost * trainingCount}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1 text-foreground">
                            Training Time
                          </p>
                          <div className="flex items-center gap-2 bg-neuro-bg p-2 rounded-md shadow-neuro-flat">
                            <Clock className="h-4 w-4 text-blue-400" />
                            <span>{selectedTroop.trainingTime}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setSelectedTroop(null)}
                          className="border-neuro-primary/30 text-foreground hover:bg-neuro-primary/10"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() =>
                            startTraining(selectedTroop.id, trainingCount)
                          }
                          className="bg-neuro-bg text-neuro-primary shadow-neuro-flat hover:shadow-neuro-pressed border-neuro-primary/20"
                        >
                          Start Training
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="training" className="space-y-6">
              {trainingInProgress.length > 0 ? (
                <motion.div
                  className="space-y-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-400" />
                    In Progress
                  </h2>
                  {trainingInProgress.map((item) => (
                    <motion.div key={item.id} variants={itemVariants}>
                      <Card className="overflow-hidden bg-neuro-bg border-neuro-primary/20 shadow-neuro-flat">
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-center mb-2">
                            <div>
                              <span className="text-lg font-medium">
                                {item.troopName}
                              </span>
                              <span className="text-sm text-slate-400 ml-2">
                                ({item.count} units)
                              </span>
                            </div>
                            <span className="text-amber-500 font-semibold">
                              {item.progress}%
                            </span>
                          </div>
                          <Progress
                            value={item.progress}
                            className="h-2 mb-2 bg-neuro-primary/10"
                          />
                          <p className="text-sm text-slate-400 flex items-center gap-1">
                            <Clock className="h-4 w-4 text-blue-400" />
                            Completes in {item.timeRemaining}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Sword className="h-12 w-12 mx-auto text-neuro-primary opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">
                    No Training in Progress
                  </h3>
                  <p className="text-slate-400 mt-2">
                    Start training new troops from the Current Army tab.
                  </p>
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="new" className="space-y-6">
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {availableTroops.map((troop) => (
                  <motion.div
                    key={troop.id}
                    variants={itemVariants}
                    whileHover="hover"
                  >
                    <Card className="bg-neuro-bg border-neuro-primary/20 shadow-neuro-flat overflow-hidden transition-all duration-300 hover:border-neuro-primary/50 neuro-hover neuro-glow">
                      <CardHeader className="bg-neuro-bg pb-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            {troop.icon}
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-xl">
                                {troop.name}
                              </CardTitle>
                              <Badge className="bg-neuro-bg text-amber-500 border-amber-500/50 shadow-neuro-flat">
                                New
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-slate-400">Attack</p>
                            <p className="font-medium flex items-center gap-1">
                              <Sword className="h-3 w-3 text-red-500" />
                              {troop.attack}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">Defense</p>
                            <p className="font-medium flex items-center gap-1">
                              <Shield className="h-3 w-3 text-blue-500" />
                              {troop.defense}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">Speed</p>
                            <p className="font-medium">{troop.speed}</p>
                          </div>
                        </div>
                        <div className="space-y-2 mb-4 bg-neuro-bg p-3 rounded-md shadow-neuro-flat">
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
                              <Clock className="h-4 w-4 mr-1 text-blue-400" />{" "}
                              Training time:
                            </span>
                            <span>{troop.trainingTime}</span>
                          </div>
                          <Separator className="my-2 bg-neuro-primary/20" />
                          <div className="text-sm">
                            <span className="font-medium flex items-center gap-1">
                              <Award className="h-4 w-4 text-amber-500" />{" "}
                              Requirements:
                            </span>{" "}
                            <span className="text-slate-300 ml-5">
                              {troop.requirements}
                            </span>
                          </div>
                        </div>
                        <Button
                          className="w-full bg-neuro-bg text-neuro-primary shadow-neuro-flat hover:shadow-neuro-pressed border-neuro-primary/20"
                          onClick={() => console.log(`Unlock ${troop.name}`)}
                        >
                          Unlock Unit
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Military;
