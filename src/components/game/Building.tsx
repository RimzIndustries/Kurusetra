import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  ArrowUp,
  Clock,
  Coins,
  Wheat,
  Hammer,
  Construction,
  Shield,
  Sword,
  Sparkles,
} from "lucide-react";

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
      benefits: "Unlocks new unit types",
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
      benefits: "+15% food production",
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
      benefits: "+20% gold storage capacity",
    },
  ]);

  // Mock data for construction in progress
  const [constructionInProgress, setConstructionInProgress] = useState([
    {
      id: 1,
      buildingName: "Archery Range",
      progress: 67,
      timeRemaining: "2h 15m",
      icon: <Sword className="h-6 w-6 text-blue-400" />,
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
      benefits: "Unlocks cavalry units",
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
      benefits: "Enables resource trading",
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
        damping: 12,
      },
    },
  };

  const tabVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <div className="bg-background min-h-screen p-6 bg-gradient-to-b from-background to-background/95">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto"
      >
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-3 mb-8"
        >
          <div className="p-3 bg-primary/10 rounded-full">
            <Construction className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent">
              Building Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Construct and upgrade buildings to strengthen your kingdom
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <motion.div variants={itemVariants}>
            <Card className="border border-primary/20 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 shadow-lg shadow-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-primary" />
                  Total Buildings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{buildings.length}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Structures in your kingdom
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border border-amber-500/20 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 shadow-lg shadow-amber-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <Construction className="h-5 w-5 mr-2 text-amber-500" />
                  In Construction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {constructionInProgress.length}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Buildings being constructed
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border border-blue-500/20 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 shadow-lg shadow-blue-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <Hammer className="h-5 w-5 mr-2 text-blue-500" />
                  Available to Build
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {availableBuildings.length}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  New structures to construct
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Tabs
            defaultValue="existing"
            className="w-full bg-card/30 p-6 rounded-lg border border-border/40 shadow-md backdrop-blur-sm"
          >
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-muted/50">
              <TabsTrigger
                value="existing"
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-md transition-all duration-300"
              >
                <Building2 className="h-4 w-4 mr-2" />
                Existing Buildings
              </TabsTrigger>
              <TabsTrigger
                value="construction"
                className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-500 data-[state=active]:shadow-md transition-all duration-300"
              >
                <Construction className="h-4 w-4 mr-2" />
                Construction
              </TabsTrigger>
              <TabsTrigger
                value="new"
                className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-500 data-[state=active]:shadow-md transition-all duration-300"
              >
                <Hammer className="h-4 w-4 mr-2" />
                New Buildings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="existing" className="space-y-6">
              <motion.div
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {buildings.map((building) => (
                  <motion.div
                    key={building.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50 bg-card/80 backdrop-blur-sm h-full">
                      <CardHeader className="border-b border-border/20 pb-4 bg-muted/30">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-background/50 rounded-full">
                              {building.icon}
                            </div>
                            <div>
                              <CardTitle className="text-xl">
                                {building.name}
                              </CardTitle>
                              <Badge
                                variant="outline"
                                className="mt-1 bg-primary/5"
                              >
                                Level {building.level}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-sm mb-4">{building.description}</p>

                        <div className="flex items-center gap-2 mb-4">
                          <Sparkles className="h-4 w-4 text-amber-400" />
                          <span className="text-sm font-medium">
                            {building.benefits}
                          </span>
                        </div>

                        <Separator className="my-4 bg-border/50" />

                        <div className="space-y-3 mb-4 p-4 bg-muted/30 rounded-lg border border-border/30">
                          <div className="flex justify-between text-sm">
                            <span className="flex items-center">
                              <Coins className="h-4 w-4 mr-1 text-yellow-500" />
                              Upgrade Cost:
                            </span>
                            <span className="font-medium">
                              {building.goldCost}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="flex items-center">
                              <Wheat className="h-4 w-4 mr-1 text-green-500" />
                              Food Cost:
                            </span>
                            <span className="font-medium">
                              {building.foodCost}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" /> Time:
                            </span>
                            <span className="font-medium">
                              {building.timeToUpgrade}
                            </span>
                          </div>
                        </div>
                        <Button
                          className="w-full py-5 text-base font-semibold transition-all duration-300 hover:bg-primary/90 hover:shadow-md group"
                          onClick={() => startUpgrade(building.id)}
                        >
                          <ArrowUp className="h-4 w-4 mr-2 group-hover:animate-bounce" />
                          Upgrade to Level {building.level + 1}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="construction" className="space-y-6">
              {constructionInProgress.length > 0 ? (
                <motion.div variants={containerVariants} className="space-y-6">
                  <motion.h2
                    variants={itemVariants}
                    className="text-xl font-semibold flex items-center gap-2"
                  >
                    <Construction className="h-5 w-5 text-amber-500" />
                    In Progress
                  </motion.h2>
                  {constructionInProgress.map((item) => (
                    <motion.div
                      key={item.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.01 }}
                    >
                      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-amber-500/30 bg-card/80 backdrop-blur-sm">
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-amber-500/10 rounded-full">
                                {item.icon}
                              </div>
                              <span className="text-lg font-medium">
                                {item.buildingName}
                              </span>
                            </div>
                            <Badge
                              variant="outline"
                              className="text-amber-500 border-amber-500 bg-amber-500/10"
                            >
                              {item.progress}%
                            </Badge>
                          </div>
                          <div className="relative mb-2">
                            <Progress value={item.progress} className="h-2" />
                            <motion.div
                              className="absolute top-0 left-0 h-2 w-2 bg-amber-500 rounded-full"
                              animate={{
                                left: `${item.progress}%`,
                                transition: {
                                  duration: 1.5,
                                  repeat: Infinity,
                                  repeatType: "reverse",
                                },
                              }}
                            />
                          </div>
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-3">
                            <Clock className="h-4 w-4" />
                            Completes in {item.timeRemaining}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  variants={itemVariants}
                  className="text-center py-16 bg-muted/20 rounded-lg border border-border/30"
                >
                  <Building2 className="h-16 w-16 mx-auto text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-xl font-medium">
                    No Construction in Progress
                  </h3>
                  <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                    Start a new building project from the New Buildings tab to
                    expand your kingdom.
                  </p>
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="new" className="space-y-6">
              <motion.div
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {availableBuildings.map((building) => (
                  <motion.div
                    key={building.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-blue-500/30 bg-card/80 backdrop-blur-sm h-full">
                      <CardHeader className="border-b border-border/20 pb-4 bg-muted/30">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-full">
                              {building.icon}
                            </div>
                            <CardTitle className="text-xl">
                              {building.name}
                            </CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-sm mb-4">{building.description}</p>

                        <div className="flex items-center gap-2 mb-4">
                          <Sparkles className="h-4 w-4 text-blue-400" />
                          <span className="text-sm font-medium">
                            {building.benefits}
                          </span>
                        </div>

                        <Separator className="my-4 bg-border/50" />

                        <div className="space-y-3 mb-4 p-4 bg-muted/30 rounded-lg border border-border/30">
                          <div className="flex justify-between text-sm">
                            <span className="flex items-center">
                              <Coins className="h-4 w-4 mr-1 text-yellow-500" />
                              Cost:
                            </span>
                            <span className="font-medium">
                              {building.goldCost}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="flex items-center">
                              <Wheat className="h-4 w-4 mr-1 text-green-500" />
                              Food Cost:
                            </span>
                            <span className="font-medium">
                              {building.foodCost}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" /> Time:
                            </span>
                            <span className="font-medium">
                              {building.timeToConstruct}
                            </span>
                          </div>
                          <Separator className="my-2" />
                          <div className="text-sm">
                            <span className="font-medium">Requirements:</span>{" "}
                            <Badge
                              variant="outline"
                              className="ml-1 bg-blue-500/5 text-blue-500 border-blue-500/30"
                            >
                              {building.requirements}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          className="w-full py-5 text-base font-semibold transition-all duration-300 bg-blue-600 hover:bg-blue-700 hover:shadow-md group"
                          onClick={() => startConstruction(building.id)}
                        >
                          <Construction className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
                          Construct
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

export default Building;
