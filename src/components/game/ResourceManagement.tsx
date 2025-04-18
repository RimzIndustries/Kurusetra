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
  Star,
} from "lucide-react";
import { useGameState } from '../../hooks/useGameState';
import { NeumorphicCard, NeumorphicButton, NeumorphicProgress, NeumorphicBadge } from '@/styles/components';

interface ResourceStats {
  current: number;
  max: number;
  rate: number;
  name: string;
  icon: JSX.Element;
  color: string;
}

const ResourceManagement = () => {
  const { toast } = useToast();
  const { player, updatePlayer } = useGameState();
  const [resources, setResources] = useState(player.resources);
  const [isCollecting, setIsCollecting] = useState(false);

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

  const collectResources = async (resourceType: keyof typeof resources) => {
    if (isCollecting) return;
    
    setIsCollecting(true);
    try {
      const amount = Math.floor(Math.random() * 10) + 1;
      const updatedResources = {
        ...resources,
        [resourceType]: resources[resourceType] + amount
      };
      
      await updatePlayer({ resources: updatedResources });
      setResources(updatedResources);
      
      toast({
        title: "Resource Collected",
        description: `Collected ${amount} ${resourceType}!`,
        variant: "success"
      });
    } catch (error) {
      toast({
        title: "Resource Collection Error",
        description: "Failed to collect resources",
        variant: "destructive"
      });
    } finally {
      setIsCollecting(false);
    }
  };

  const upgradeResourceProduction = async (resourceType: keyof typeof resources) => {
    if (resources.gold < 100) {
      toast({
        title: "Insufficient Gold",
        description: "Not enough gold to upgrade",
        variant: "warning"
      });
      return;
    }

    try {
      const productionKey = `${resourceType}Production` as keyof typeof resources;
      const updatedResources = {
        ...resources,
        gold: resources.gold - 100,
        [productionKey]: resources[productionKey] + 1
      };
      
      await updatePlayer({ resources: updatedResources });
      setResources(updatedResources);
      
      toast({
        title: "Resource Production Upgraded",
        description: `${resourceType} production upgraded!`,
        variant: "success"
      });
    } catch (error) {
      toast({
        title: "Production Upgrade Error",
        description: "Failed to upgrade production",
        variant: "destructive"
      });
    }
  };

  // Mock data for resources
  const resourceStats: ResourceStats[] = [
    {
      name: 'Gold',
      current: resources.gold,
      max: 50000,
      rate: resources.goldProduction,
      icon: <Coins className="h-5 w-5" />,
      color: 'text-yellow-500'
    },
    {
      name: 'Food',
      current: resources.food,
      max: 30000,
      rate: resources.foodProduction,
      icon: <Wheat className="h-5 w-5" />,
      color: 'text-green-500'
    },
    {
      name: 'Population',
      current: resources.population,
      max: resources.maxPopulation,
      rate: 5,
      icon: <Users className="h-5 w-5" />,
      color: 'text-blue-500'
    },
    {
      name: 'Influence',
      current: 450,
      max: 600,
      rate: -2,
      icon: <Star className="h-5 w-5" />,
      color: 'text-purple-500'
    }
  ];

  return (
    <NeumorphicCard>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Resource Management</h2>
          <NeumorphicButton>
            Market
          </NeumorphicButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resourceStats.map((resource) => (
            <div key={resource.name} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`${resource.color}`}>
                    {resource.icon}
                  </div>
                  <span className="font-medium">{resource.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {resource.current}/{resource.max}
                  </span>
                  <div className="flex items-center gap-1">
                    {resource.rate > 0 ? (
                      <ArrowUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className={resource.rate > 0 ? "text-green-500" : "text-red-500"}>
                      {Math.abs(resource.rate)}/h
                    </span>
                  </div>
                </div>
              </div>

              <NeumorphicProgress 
                value={(resource.current / resource.max) * 100}
              />

              <div className="flex justify-between gap-2">
                <NeumorphicButton className="flex-1 text-sm">
                  Collect
                </NeumorphicButton>
                <NeumorphicButton className="flex-1 text-sm">
                  Upgrade Storage
                </NeumorphicButton>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Resource Bonuses</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <NeumorphicBadge type="success">
              Gold Production +15%
            </NeumorphicBadge>
            <NeumorphicBadge type="info">
              Food Storage +20%
            </NeumorphicBadge>
            <NeumorphicBadge type="warning">
              Population Growth +10%
            </NeumorphicBadge>
            <NeumorphicBadge type="error">
              Resource Protection +25%
            </NeumorphicBadge>
          </div>
        </div>
      </div>
    </NeumorphicCard>
  );
};

export default ResourceManagement;
