import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Coins,
  Wheat,
  Users,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  BarChart,
  Plus,
} from "lucide-react";

const ResourceManagement = () => {
  const { toast } = useToast();

  // Resource data with production rates
  const [resources, setResources] = useState({
    gold: 15000,
    food: 8500,
    population: 1200,
    maxPopulation: 1500,
    goldProduction: 1200,
    foodProduction: 950,
    materials: 5000,
    maxMaterials: 10000,
    materialsProduction: 600,
    researchPoints: 250,
    maxResearchPoints: 1000,
    researchProduction: 50,
  });

  // Resource allocation with worker distribution
  const [allocation, setAllocation] = useState({
    farming: 40,
    mining: 30,
    lumber: 20,
    research: 10,
  });

  // Available trade offers
  const [tradeOffers, setTradeOffers] = useState([
    {
      id: 1,
      kingdom: "Dwaraka",
      offering: "Gold",
      offeringAmount: 2000,
      requesting: "Food",
      requestingAmount: 1500,
      expires: "12 hours",
    },
    {
      id: 2,
      kingdom: "Jodipati",
      offering: "Food",
      offeringAmount: 3000,
      requesting: "Gold",
      requestingAmount: 2500,
      expires: "1 day",
    },
  ]);

  // New trade offer form state
  const [newTradeOffer, setNewTradeOffer] = useState({
    offering: "Gold",
    offeringAmount: 1000,
    requesting: "Food",
    requestingAmount: 1000,
  });

  // Resource production timer
  useEffect(() => {
    // Update resources every 10 seconds (simulating hourly production at faster pace for demo)
    const productionInterval = setInterval(() => {
      setResources((prev) => {
        // Calculate production based on allocation
        const farmingProduction = Math.round(allocation.farming * 20);
        const miningProduction = Math.round(allocation.mining * 30);
        const lumberProduction = Math.round(allocation.lumber * 15);
        const researchProduction = Math.round(allocation.research * 5);

        // Apply production to resources
        return {
          ...prev,
          gold: Math.min(prev.gold + miningProduction / 360, 50000), // Divide by 360 to simulate 10 seconds of hourly production
          food: Math.min(prev.food + farmingProduction / 360, 30000),
          materials: Math.min(
            prev.materials + lumberProduction / 360,
            prev.maxMaterials,
          ),
          researchPoints: Math.min(
            prev.researchPoints + researchProduction / 360,
            prev.maxResearchPoints,
          ),
          goldProduction: 800 + miningProduction,
          foodProduction: 500 + farmingProduction,
          materialsProduction: 300 + lumberProduction,
          researchProduction: 10 + researchProduction,
        };
      });
    }, 10000); // Every 10 seconds

    return () => clearInterval(productionInterval);
  }, [allocation]);

  // Function to update allocation with balance checking
  const updateAllocation = (type, value) => {
    const newValue = value[0];
    const oldValue = allocation[type];
    const difference = newValue - oldValue;

    // Calculate total allocation after change
    const currentTotal = Object.values(allocation).reduce(
      (sum, val) => sum + val,
      0,
    );
    const newTotal = currentTotal + difference;

    // Ensure total stays at 100%
    if (newTotal > 100) {
      toast({
        title: "Allocation Limit Reached",
        description: "Total worker allocation cannot exceed 100%",
        variant: "destructive",
      });
      return;
    }

    // Update allocation
    setAllocation({ ...allocation, [type]: newValue });
  };

  // Function to apply allocation changes
  const applyAllocation = () => {
    // Calculate total to ensure it's valid
    const total = Object.values(allocation).reduce((sum, val) => sum + val, 0);

    if (total !== 100) {
      toast({
        title: "Invalid Allocation",
        description: `Total allocation must be 100%. Current: ${total}%`,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Allocation Updated",
      description: "Worker allocation has been updated successfully.",
    });
  };

  // Function to accept trade
  const acceptTrade = (tradeId) => {
    const trade = tradeOffers.find((t) => t.id === tradeId);

    if (!trade) return;

    // Check if player has enough resources to fulfill the trade
    if (
      trade.requesting === "Gold" &&
      resources.gold < trade.requestingAmount
    ) {
      toast({
        title: "Insufficient Gold",
        description: `You need ${trade.requestingAmount} gold to accept this trade.`,
        variant: "destructive",
      });
      return;
    }

    if (
      trade.requesting === "Food" &&
      resources.food < trade.requestingAmount
    ) {
      toast({
        title: "Insufficient Food",
        description: `You need ${trade.requestingAmount} food to accept this trade.`,
        variant: "destructive",
      });
      return;
    }

    // Update resources based on trade
    setResources((prev) => {
      const newResources = { ...prev };

      // Deduct requested resource
      if (trade.requesting === "Gold") {
        newResources.gold -= trade.requestingAmount;
      } else if (trade.requesting === "Food") {
        newResources.food -= trade.requestingAmount;
      }

      // Add offered resource
      if (trade.offering === "Gold") {
        newResources.gold += trade.offeringAmount;
      } else if (trade.offering === "Food") {
        newResources.food += trade.offeringAmount;
      }

      return newResources;
    });

    // Remove trade from available offers
    setTradeOffers((prev) => prev.filter((t) => t.id !== trade.id));

    toast({
      title: "Trade Accepted",
      description: `Successfully traded with ${trade.kingdom}.`,
    });
  };

  // Function to create a new trade offer
  const createTradeOffer = () => {
    // Validate trade offer
    if (
      newTradeOffer.offeringAmount <= 0 ||
      newTradeOffer.requestingAmount <= 0
    ) {
      toast({
        title: "Invalid Trade Amounts",
        description: "Trade amounts must be greater than zero.",
        variant: "destructive",
      });
      return;
    }

    // Check if player has enough resources to offer
    if (
      newTradeOffer.offering === "Gold" &&
      resources.gold < newTradeOffer.offeringAmount
    ) {
      toast({
        title: "Insufficient Gold",
        description: "You don't have enough gold to create this offer.",
        variant: "destructive",
      });
      return;
    }

    if (
      newTradeOffer.offering === "Food" &&
      resources.food < newTradeOffer.offeringAmount
    ) {
      toast({
        title: "Insufficient Food",
        description: "You don't have enough food to create this offer.",
        variant: "destructive",
      });
      return;
    }

    // Create new trade offer
    const newTrade = {
      id: Date.now(),
      kingdom: "Hastinapura", // Player's kingdom
      offering: newTradeOffer.offering,
      offeringAmount: newTradeOffer.offeringAmount,
      requesting: newTradeOffer.requesting,
      requestingAmount: newTradeOffer.requestingAmount,
      expires: "1 day",
    };

    // Add to trade offers
    setTradeOffers((prev) => [...prev, newTrade]);

    toast({
      title: "Trade Offer Created",
      description: "Your trade offer has been posted to the market.",
    });
  };

  return (
    <div className="bg-background min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6">Resource Management</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <Coins className="h-5 w-5 mr-2 text-yellow-500" />
                Gold
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {resources.gold.toLocaleString()}
              </p>
              <div className="flex items-center text-sm text-muted-foreground mt-2">
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                <span>{resources.goldProduction}/hour</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <Wheat className="h-5 w-5 mr-2 text-green-500" />
                Food
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {resources.food.toLocaleString()}
              </p>
              <div className="flex items-center text-sm text-muted-foreground mt-2">
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                <span>{resources.foodProduction}/hour</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <BarChart className="h-5 w-5 mr-2 text-purple-500" />
                Materials
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {resources.materials.toLocaleString()}
              </p>
              <div className="flex items-center text-sm text-muted-foreground mt-2">
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                <span>{resources.materialsProduction}/hour</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-500" />
                Population
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {resources.population} / {resources.maxPopulation}
              </p>
              <Progress
                value={(resources.population / resources.maxPopulation) * 100}
                className="h-2 mt-2"
              />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="allocation" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="allocation">Resource Allocation</TabsTrigger>
            <TabsTrigger value="trade">Trade</TabsTrigger>
          </TabsList>

          <TabsContent value="allocation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Worker Allocation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium">
                        Farming ({allocation.farming}%)
                      </label>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(
                          (allocation.farming / 100) * resources.population,
                        )}{" "}
                        workers
                      </span>
                    </div>
                    <Slider
                      defaultValue={[allocation.farming]}
                      max={100}
                      step={5}
                      onValueChange={(value) =>
                        updateAllocation("farming", value)
                      }
                      className="mb-4"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>
                        Food: +{Math.round(allocation.farming * 20)}/hour
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium">
                        Mining ({allocation.mining}%)
                      </label>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(
                          (allocation.mining / 100) * resources.population,
                        )}{" "}
                        workers
                      </span>
                    </div>
                    <Slider
                      defaultValue={[allocation.mining]}
                      max={100}
                      step={5}
                      onValueChange={(value) =>
                        updateAllocation("mining", value)
                      }
                      className="mb-4"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>
                        Gold: +{Math.round(allocation.mining * 30)}/hour
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium">
                        Lumber ({allocation.lumber}%)
                      </label>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(
                          (allocation.lumber / 100) * resources.population,
                        )}{" "}
                        workers
                      </span>
                    </div>
                    <Slider
                      defaultValue={[allocation.lumber]}
                      max={100}
                      step={5}
                      onValueChange={(value) =>
                        updateAllocation("lumber", value)
                      }
                      className="mb-4"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>
                        Materials: +{Math.round(allocation.lumber * 15)}/hour
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium">
                        Research ({allocation.research}%)
                      </label>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(
                          (allocation.research / 100) * resources.population,
                        )}{" "}
                        workers
                      </span>
                    </div>
                    <Slider
                      defaultValue={[allocation.research]}
                      max={100}
                      step={5}
                      onValueChange={(value) =>
                        updateAllocation("research", value)
                      }
                      className="mb-4"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>
                        Research Points: +{Math.round(allocation.research * 5)}
                        /hour
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={applyAllocation}>
                  <BarChart className="h-4 w-4 mr-2" /> Apply Allocation
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resource Production Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium mb-1">
                        Gold Production
                      </h3>
                      <div className="flex justify-between">
                        <span className="text-sm">Base Production:</span>
                        <span className="text-sm">800/hour</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">From Mining:</span>
                        <span className="text-sm">
                          +{Math.round(allocation.mining * 30)}/hour
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">From Buildings:</span>
                        <span className="text-sm">+400/hour</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-medium">
                        <span>Total:</span>
                        <span>{resources.goldProduction}/hour</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-1">
                        Food Production
                      </h3>
                      <div className="flex justify-between">
                        <span className="text-sm">Base Production:</span>
                        <span className="text-sm">500/hour</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">From Farming:</span>
                        <span className="text-sm">
                          +{Math.round(allocation.farming * 20)}/hour
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">From Buildings:</span>
                        <span className="text-sm">+250/hour</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-medium">
                        <span>Total:</span>
                        <span>{resources.foodProduction}/hour</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trade" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Trade Offers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tradeOffers.map((trade) => (
                    <Card key={trade.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{trade.kingdom}</p>
                            <p className="text-sm text-muted-foreground">
                              Expires in {trade.expires}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-center">
                              <p className="text-sm font-medium">
                                {trade.offering}
                              </p>
                              <p className="text-lg font-bold text-green-600">
                                {trade.offeringAmount}
                              </p>
                            </div>
                            <ArrowRight className="h-5 w-5" />
                            <div className="text-center">
                              <p className="text-sm font-medium">
                                {trade.requesting}
                              </p>
                              <p className="text-lg font-bold text-red-600">
                                {trade.requestingAmount}
                              </p>
                            </div>
                          </div>
                          <Button
                            onClick={() => {
                              const selectedTrade = tradeOffers.find(
                                (t) => t.id === trade.id,
                              );
                              if (selectedTrade) {
                                acceptTrade(trade.id);
                              }
                            }}
                            className="ml-4"
                          >
                            Accept
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: "Refreshed Offers",
                      description: "Trade offers have been refreshed.",
                    });
                  }}
                >
                  <ArrowDown className="h-4 w-4 mr-2" /> Refresh Offers
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" /> Create New Offer
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Trade Offer</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-1 block">
                            Offering
                          </label>
                          <select
                            className="w-full p-2 border rounded"
                            value={newTradeOffer.offering}
                            onChange={(e) =>
                              setNewTradeOffer({
                                ...newTradeOffer,
                                offering: e.target.value,
                              })
                            }
                          >
                            <option value="Gold">Gold</option>
                            <option value="Food">Food</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">
                            Amount
                          </label>
                          <Input
                            type="number"
                            min="1"
                            value={newTradeOffer.offeringAmount}
                            onChange={(e) =>
                              setNewTradeOffer({
                                ...newTradeOffer,
                                offeringAmount: parseInt(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="flex justify-center">
                        <ArrowDown className="h-6 w-6" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-1 block">
                            Requesting
                          </label>
                          <select
                            className="w-full p-2 border rounded"
                            value={newTradeOffer.requesting}
                            onChange={(e) =>
                              setNewTradeOffer({
                                ...newTradeOffer,
                                requesting: e.target.value,
                              })
                            }
                          >
                            <option value="Gold">Gold</option>
                            <option value="Food">Food</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">
                            Amount
                          </label>
                          <Input
                            type="number"
                            min="1"
                            value={newTradeOffer.requestingAmount}
                            onChange={(e) =>
                              setNewTradeOffer({
                                ...newTradeOffer,
                                requestingAmount: parseInt(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={createTradeOffer}>Create Offer</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Market Prices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg text-center">
                      <Coins className="h-6 w-6 mx-auto text-yellow-500 mb-2" />
                      <p className="font-medium">Gold</p>
                      <div className="flex items-center justify-center mt-1">
                        <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm">+5%</span>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <Wheat className="h-6 w-6 mx-auto text-green-500 mb-2" />
                      <p className="font-medium">Food</p>
                      <div className="flex items-center justify-center mt-1">
                        <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                        <span className="text-sm">-2%</span>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <BarChart className="h-6 w-6 mx-auto text-blue-500 mb-2" />
                      <p className="font-medium">Materials</p>
                      <div className="flex items-center justify-center mt-1">
                        <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm">+8%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default ResourceManagement;
