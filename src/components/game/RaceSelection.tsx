import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InfoIcon,
  Sword,
  Brain,
  Wand,
  Mountain,
  Bird,
  Skull,
  Shield,
  Ghost,
} from "lucide-react";

interface Race {
  id: string;
  name: string;
  description: string;
  abilities: string[];
  advantages: string;
  icon: React.ReactNode;
  image: string;
}

const races: Race[] = [
  {
    id: "ksatriya",
    name: "Ksatriya",
    description:
      "The most intelligent beings who live prosperously in the lowlands. They are the most stable race in the Kurusetra universe.",
    abilities: [
      "Fast learners",
      "Efficient in all fields of knowledge",
      "Balanced development",
    ],
    advantages:
      "More efficient in learning and applying knowledge in all fields.",
    icon: <Brain className="h-6 w-6" />,
    image:
      "https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=800&q=80",
  },
  {
    id: "wanamarta",
    name: "Wanamarta",
    description:
      "Mystical beings who live in dense forests filled with magical auras. They possess extraordinary magical abilities.",
    abilities: ["Powerful magic", "Spiritual connection", "Defensive spells"],
    advantages:
      "Faster and more efficient in learning and applying magical spells for both defense and offense.",
    icon: <Wand className="h-6 w-6" />,
    image:
      "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=800&q=80",
  },
  {
    id: "wirabumi",
    name: "Wirabumi",
    description:
      "Hard-working beings who live in hidden areas, caves, and underground. Known for their industrious nature.",
    abilities: ["Master builders", "Mining expertise", "Resource efficiency"],
    advantages:
      "Faster and more efficient in learning and applying all types of work such as construction and mining.",
    icon: <Mountain className="h-6 w-6" />,
    image:
      "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=800&q=80",
  },
  {
    id: "jatayu",
    name: "Jatayu",
    description:
      "Flying beings who live in highlands. They possess incredible aggressive attack capabilities and unmatched speed.",
    abilities: ["Flight", "Rapid attacks", "Superior mobility"],
    advantages:
      "Faster and more efficient in attacking enemies, especially in terms of traveling to battle areas due to flying abilities.",
    icon: <Bird className="h-6 w-6" />,
    image:
      "https://images.unsplash.com/photo-1551887373-3c5bd224f6e2?w=800&q=80",
  },
  {
    id: "kurawa",
    name: "Kurawa",
    description:
      "The most cunning lowland beings in the Kurusetra universe. Masters of secret operations and deception.",
    abilities: ["Espionage", "Sabotage", "Deception"],
    advantages:
      "Faster and more efficient in conducting terror acts and secret operations in enemy kingdoms like stealing and destroying buildings.",
    icon: <Skull className="h-6 w-6" />,
    image:
      "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?w=800&q=80",
  },
  {
    id: "tibrasara",
    name: "Tibrasara",
    description:
      "Mysterious beings who live in dark forests with unparalleled archery skills. Their killing instinct is feared throughout the realm.",
    abilities: ["Master archers", "Stealth", "Defensive prowess"],
    advantages:
      "Stronger and more efficient in defensive actions when attacked by enemies.",
    icon: <Shield className="h-6 w-6" />,
    image:
      "https://images.unsplash.com/photo-1511497584788-876760111969?w=800&q=80",
  },
  {
    id: "raksasa",
    name: "Raksasa",
    description:
      "Enormous and terrifying beings who inhabit steep rocky hills. Their army strength is unmatched in the realm.",
    abilities: ["Immense strength", "Powerful armies", "Intimidation"],
    advantages:
      "Stronger and more efficient in offensive actions against enemy territories.",
    icon: <Sword className="h-6 w-6" />,
    image:
      "https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=800&q=80",
  },
  {
    id: "dedemit",
    name: "Dedemit",
    description:
      "Spectral beings who exist in the realm of wandering spirits. They require no food to survive and their armies never perish in battle.",
    abilities: [
      "Immortal armies",
      "No food requirement",
      "Supernatural resilience",
    ],
    advantages:
      "Requires no food at all, allowing allocation of food resources to other more important needs.",
    icon: <Ghost className="h-6 w-6" />,
    image:
      "https://images.unsplash.com/photo-1604005950576-8391ae377ae8?w=800&q=80",
  },
];

interface RaceSelectionProps {
  onSelectRace?: (raceId: string) => void;
  isOpen?: boolean;
}

const RaceSelection = ({
  onSelectRace = () => {},
  isOpen = true,
}: RaceSelectionProps) => {
  const [selectedRace, setSelectedRace] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("ksatriya");

  const handleSelectRace = (raceId: string) => {
    setSelectedRace(raceId);
    setActiveTab(raceId);
  };

  const handleConfirmSelection = () => {
    if (selectedRace) {
      onSelectRace(selectedRace);
      setConfirmDialogOpen(false);
    }
  };

  return (
    <div className="bg-background min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl bg-card">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Choose Your Race</CardTitle>
          <CardDescription className="text-lg">
            Select one of the 8 unique races to lead your kingdom in the
            Kurusetra universe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex flex-col space-y-8">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {races.map((race) => (
                  <TabsTrigger
                    key={race.id}
                    value={race.id}
                    className="flex items-center gap-2 py-3"
                    onClick={() => handleSelectRace(race.id)}
                  >
                    {race.icon}
                    <span>{race.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {races.map((race) => (
                <TabsContent
                  key={race.id}
                  value={race.id}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="col-span-1">
                      <div className="rounded-lg overflow-hidden h-64 bg-muted">
                        <img
                          src={race.image}
                          alt={race.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="mt-4 space-y-2">
                        <h3 className="text-xl font-semibold flex items-center gap-2">
                          {race.icon}
                          {race.name}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {race.abilities.map((ability, index) => (
                            <Badge key={index} variant="secondary">
                              {ability}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-1 md:col-span-2 space-y-4">
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Description</h4>
                        <p>{race.description}</p>
                      </div>

                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <InfoIcon className="h-4 w-4" />
                          Key Advantage
                        </h4>
                        <p>{race.advantages}</p>
                      </div>

                      <div className="bg-primary/10 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Abilities</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {race.abilities.map((ability, index) => (
                            <li key={index}>{ability}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() =>
                    setActiveTab(
                      races[Math.floor(Math.random() * races.length)].id,
                    )
                  }
                >
                  Random Race
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Let fate decide your destiny</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button
            onClick={() => setConfirmDialogOpen(true)}
            disabled={!selectedRace}
            className="px-8"
          >
            Confirm Selection
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Choice</DialogTitle>
            <DialogDescription>
              {selectedRace && (
                <span>
                  You are about to lead the{" "}
                  {races.find((r) => r.id === selectedRace)?.name} race. This
                  choice will determine your kingdom's strengths and strategies.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 py-3">
            {selectedRace && (
              <>
                {races.find((r) => r.id === selectedRace)?.icon}
                <span className="font-medium">
                  {races.find((r) => r.id === selectedRace)?.name}
                </span>
              </>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmSelection}>Begin Your Journey</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RaceSelection;
