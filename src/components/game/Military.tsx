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
  Bow,
  Horse,
  Zap,
} from "lucide-react";
import { useGameState } from '../../hooks/useGameState';
import { useToast } from '../../hooks/useToast';
import { NeumorphicCard, NeumorphicButton, NeumorphicBadge } from '@/styles/components';

interface MilitaryUnit {
  id: string;
  name: string;
  level: number;
  count: number;
  cost: {
    gold: number;
    food: number;
    time: number;
  };
  stats: {
    attack: number;
    defense: number;
    health: number;
  };
  training: number;
  maxCount: number;
  icon: JSX.Element;
  power: number;
  upkeep: number;
  trainingTime: number;
}

const Military = () => {
  const { player, updatePlayer } = useGameState();
  const { addToast } = useToast();
  const [units, setUnits] = useState<MilitaryUnit[]>(player.militaryUnits || []);
  const [isTraining, setIsTraining] = useState(false);

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

  const canAfford = (cost: MilitaryUnit['cost']) => {
    return (
      player.resources.gold >= cost.gold &&
      player.resources.food >= cost.food
    );
  };

  const trainUnit = async (unit: MilitaryUnit) => {
    if (isTraining) return;
    if (!canAfford(unit.cost)) {
      addToast({
        message: 'Not enough resources to train unit!',
        type: 'warning'
      });
      return;
    }

    setIsTraining(true);
    try {
      const updatedResources = {
        ...player.resources,
        gold: player.resources.gold - unit.cost.gold,
        food: player.resources.food - unit.cost.food
      };

      const existingUnit = units.find(u => u.id === unit.id);
      const updatedUnits = existingUnit
        ? units.map(u => 
            u.id === unit.id 
              ? { ...u, count: u.count + 1 }
              : u
          )
        : [...units, { ...unit, count: 1 }];

      await updatePlayer({
        resources: updatedResources,
        militaryUnits: updatedUnits
      });

      setUnits(updatedUnits);
      
      addToast({
        message: `${unit.name} trained successfully!`,
        type: 'success'
      });
    } catch (error) {
      addToast({
        message: 'Failed to train unit',
        type: 'error'
      });
    } finally {
      setIsTraining(false);
    }
  };

  const upgradeUnit = async (unitId: string) => {
    if (isTraining) return;

    const unit = units.find(u => u.id === unitId);
    if (!unit) return;

    const upgradeCost = {
      gold: unit.cost.gold * (unit.level + 1),
      food: unit.cost.food * (unit.level + 1),
      time: unit.cost.time
    };

    if (!canAfford(upgradeCost)) {
      addToast({
        message: 'Not enough resources to upgrade unit!',
        type: 'warning'
      });
      return;
    }

    setIsTraining(true);
    try {
      const updatedResources = {
        ...player.resources,
        gold: player.resources.gold - upgradeCost.gold,
        food: player.resources.food - upgradeCost.food
      };

      const updatedUnits = units.map(u => 
        u.id === unitId 
          ? { 
              ...u, 
              level: u.level + 1,
              stats: {
                attack: u.stats.attack * 1.2,
                defense: u.stats.defense * 1.2,
                health: u.stats.health * 1.2
              }
            }
          : u
      );

      await updatePlayer({
        resources: updatedResources,
        militaryUnits: updatedUnits
      });

      setUnits(updatedUnits);
      
      addToast({
        message: `${unit.name} upgraded to level ${unit.level + 1}!`,
        type: 'success'
      });
    } catch (error) {
      addToast({
        message: 'Failed to upgrade unit',
        type: 'error'
      });
    } finally {
      setIsTraining(false);
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

  const totalPower = units.reduce((sum, unit) => sum + (unit.count * unit.power), 0);
  const totalUpkeep = units.reduce((sum, unit) => sum + (unit.count * unit.upkeep), 0);

  return (
    <div className="space-y-6">
      <NeumorphicCard>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Military Overview</h2>
            <div className="flex gap-2">
              <NeumorphicBadge type="info">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Power: {totalPower}
                </div>
              </NeumorphicBadge>
              <NeumorphicBadge type="warning">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Upkeep: {totalUpkeep}/h
                </div>
              </NeumorphicBadge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {units.map((unit) => (
              <div key={unit.name} className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {unit.icon}
                    <span className="font-medium">{unit.name}</span>
                  </div>
                  <div className="text-sm">
                    {unit.count}/{unit.maxCount}
                  </div>
                </div>

                <NeumorphicProgress 
                  value={(unit.count / unit.maxCount) * 100}
                />

                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="text-center">
                    <div className="font-medium">Power</div>
                    <div>{unit.power}</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">Upkeep</div>
                    <div>{unit.upkeep}/h</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">Training</div>
                    <div>{unit.trainingTime}m</div>
                  </div>
                </div>

                {unit.training > 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Training {unit.training} units</span>
                  </div>
                )}

                <div className="flex gap-2">
                  <NeumorphicButton className="flex-1">
                    Train
                  </NeumorphicButton>
                  <NeumorphicButton className="flex-1">
                    Upgrade
                  </NeumorphicButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      </NeumorphicCard>

      <NeumorphicCard>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">Military Bonuses</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <NeumorphicBadge type="success">
              Infantry Attack +15%
            </NeumorphicBadge>
            <NeumorphicBadge type="info">
              Archer Range +20%
            </NeumorphicBadge>
            <NeumorphicBadge type="warning">
              Cavalry Speed +25%
            </NeumorphicBadge>
            <NeumorphicBadge type="error">
              Special Force Power +30%
            </NeumorphicBadge>
          </div>
        </div>
      </NeumorphicCard>
    </div>
  );
};

export default Military;
