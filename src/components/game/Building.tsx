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
  Warehouse,
  Castle,
} from "lucide-react";
import { useGameState } from '../../hooks/useGameState';
import { useToast } from '../../hooks/useToast';
import { NeumorphicCard, NeumorphicButton, NeumorphicProgress, NeumorphicBadge } from '@/styles/components';

interface Building {
  id: string;
  name: string;
  level: number;
  maxLevel: number;
  icon: JSX.Element;
  description: string;
  production: {
    type: string;
    amount: number;
  };
  upgradeTime: number;
  upgradeCost: {
    gold: number;
    materials: number;
  };
}

const BuildingManagement = () => {
  const { player, updatePlayer } = useGameState();
  const { addToast } = useToast();
  const [buildings, setBuildings] = useState<Building[]>(player.buildings || []);
  const [isConstructing, setIsConstructing] = useState(false);

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

  const canAfford = (cost: Building['upgradeCost']) => {
    return (
      player.resources.gold >= cost.gold &&
      player.resources.materials >= cost.materials
    );
  };

  const constructBuilding = async (building: Building) => {
    if (isConstructing) return;
    if (!canAfford(building.upgradeCost)) {
      addToast({
        message: 'Not enough resources to construct building!',
        type: 'warning'
      });
      return;
    }

    setIsConstructing(true);
    try {
      const updatedResources = {
        ...player.resources,
        gold: player.resources.gold - building.upgradeCost.gold,
        materials: player.resources.materials - building.upgradeCost.materials
      };

      const newBuilding = {
        ...building,
        id: Math.random().toString(36).substr(2, 9),
        level: building.level + 1
      };

      await updatePlayer({
        resources: updatedResources,
        buildings: [...buildings, newBuilding]
      });

      setBuildings(prev => [...prev, newBuilding]);
      
      addToast({
        message: `${building.name} constructed successfully!`,
        type: 'success'
      });
    } catch (error) {
      addToast({
        message: 'Failed to construct building',
        type: 'error'
      });
    } finally {
      setIsConstructing(false);
    }
  };

  const upgradeBuilding = async (buildingId: string) => {
    if (isConstructing) return;

    const building = buildings.find(b => b.id === buildingId);
    if (!building) return;

    const upgradeCost = {
      gold: building.upgradeCost.gold * (building.level + 1),
      materials: building.upgradeCost.materials * (building.level + 1)
    };

    if (!canAfford(upgradeCost)) {
      addToast({
        message: 'Not enough resources to upgrade building!',
        type: 'warning'
      });
      return;
    }

    setIsConstructing(true);
    try {
      const updatedResources = {
        ...player.resources,
        gold: player.resources.gold - upgradeCost.gold,
        materials: player.resources.materials - upgradeCost.materials
      };

      const updatedBuildings = buildings.map(b => 
        b.id === buildingId 
          ? { ...b, level: b.level + 1 }
          : b
      );

      await updatePlayer({
        resources: updatedResources,
        buildings: updatedBuildings
      });

      setBuildings(updatedBuildings);
      
      addToast({
        message: `${building.name} upgraded to level ${building.level + 1}!`,
        type: 'success'
      });
    } catch (error) {
      addToast({
        message: 'Failed to upgrade building',
        type: 'error'
      });
    } finally {
      setIsConstructing(false);
    }
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
    <div className="space-y-6">
      <NeumorphicCard>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Buildings</h2>
            <NeumorphicButton>
              <Building2 className="h-4 w-4 mr-2" />
              New Building
            </NeumorphicButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {buildings.map((building) => (
              <div key={building.id} className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {building.icon}
                    <div>
                      <span className="font-medium">{building.name}</span>
                      <div className="text-sm text-muted-foreground">
                        Level {building.level}/{building.maxLevel}
                      </div>
                    </div>
                  </div>
                  <NeumorphicBadge type="info">
                    {building.production.type}: +{building.production.amount}
                  </NeumorphicBadge>
                </div>

                <NeumorphicProgress 
                  value={(building.level / building.maxLevel) * 100}
                />

                <p className="text-sm text-muted-foreground">
                  {building.description}
                </p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium mb-1">Upgrade Cost</div>
                    <div className="flex items-center gap-2">
                      <Coins className="h-4 w-4" />
                      <span>{building.upgradeCost.gold}</span>
                    </div>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Upgrade Time</div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{building.upgradeTime}m</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <NeumorphicButton className="flex-1" onClick={() => upgradeBuilding(building.id)} disabled={isConstructing}>
                    Upgrade
                  </NeumorphicButton>
                  <NeumorphicButton className="flex-1">
                    Details
                  </NeumorphicButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      </NeumorphicCard>

      <NeumorphicCard>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">Building Bonuses</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <NeumorphicBadge type="success">
              Construction Speed +15%
            </NeumorphicBadge>
            <NeumorphicBadge type="info">
              Resource Production +20%
            </NeumorphicBadge>
            <NeumorphicBadge type="warning">
              Storage Capacity +25%
            </NeumorphicBadge>
            <NeumorphicBadge type="error">
              Building Defense +30%
            </NeumorphicBadge>
          </div>
        </div>
      </NeumorphicCard>
    </div>
  );
};

export default BuildingManagement;
