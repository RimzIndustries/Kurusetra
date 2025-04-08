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
  onComplete?: () => void;
}

const RaceSelection = ({
  onSelectRace = () => {},
  isOpen = true,
  onComplete = () => {},
}: RaceSelectionProps) => {
  const [selectedRace, setSelectedRace] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("ksatriya");
  const [hoverEffect, setHoverEffect] = useState<string | null>(null);
  const [animateSelection, setAnimateSelection] = useState(false);

  const handleSelectRace = (raceId: string) => {
    setSelectedRace(raceId);
    setActiveTab(raceId);
    // Add animation effect when selecting a race
    setAnimateSelection(true);
    setTimeout(() => setAnimateSelection(false), 500);
  };

  const handleConfirmSelection = () => {
    if (selectedRace) {
      onSelectRace(selectedRace);
      setConfirmDialogOpen(false);
      onComplete();
    }
  };

  return (
    <div className="bg-background min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl"
      >
        <Card className="w-full bg-card shadow-neuro-flat-lg border-2 border-neuro-highlight/30 overflow-hidden">
          <CardHeader className="text-center relative overflow-hidden">
            {/* Decorative background elements */}
            <motion.div
              className="absolute -z-10 w-64 h-64 rounded-full bg-primary/10 opacity-20 blur-3xl -top-20 -left-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              transition={{ duration: 1 }}
            />
            <motion.div
              className="absolute -z-10 w-64 h-64 rounded-full bg-primary/10 opacity-20 blur-3xl -bottom-20 -right-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              transition={{ duration: 1, delay: 0.3 }}
            />
            <CardTitle className="text-3xl font-bold">
              Choose Your Race
            </CardTitle>
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
                      className={`flex items-center gap-2 py-3 transition-all duration-300 ${selectedRace === race.id && animateSelection ? "scale-105" : ""}`}
                      onClick={() => handleSelectRace(race.id)}
                      onMouseEnter={() => setHoverEffect(race.id)}
                      onMouseLeave={() => setHoverEffect(null)}
                    >
                      <motion.div
                        animate={{
                          scale:
                            selectedRace === race.id
                              ? 1.1
                              : hoverEffect === race.id
                                ? 1.05
                                : 1,
                          rotate:
                            selectedRace === race.id && animateSelection
                              ? [0, 5, -5, 0]
                              : 0,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {race.icon}
                      </motion.div>
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
                        <motion.div
                          className="rounded-lg overflow-hidden h-64 bg-muted shadow-neuro-flat border border-neuro-highlight/30"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.3 }}
                        >
                          <img
                            src={race.image}
                            alt={race.name}
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                        <div className="mt-4 space-y-2">
                          <h3 className="text-xl font-semibold flex items-center gap-2">
                            <motion.div
                              whileHover={{ rotate: 10, scale: 1.1 }}
                              transition={{ duration: 0.3 }}
                              className="p-1.5 bg-background/50 rounded-full shadow-neuro-flat"
                            >
                              {race.icon}
                            </motion.div>
                            {race.name}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {race.abilities.map((ability, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="shadow-neuro-flat hover:shadow-neuro-pressed transition-all duration-300"
                              >
                                {ability}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 space-y-4">
                        <motion.div
                          className="bg-muted/50 p-4 rounded-lg shadow-neuro-concave border border-neuro-highlight/30"
                          whileHover={{ scale: 1.01 }}
                          transition={{ duration: 0.3 }}
                        >
                          <h4 className="font-medium mb-2">Description</h4>
                          <p>{race.description}</p>
                        </motion.div>

                        <motion.div
                          className="bg-muted/50 p-4 rounded-lg shadow-neuro-concave border border-neuro-highlight/30"
                          whileHover={{ scale: 1.01 }}
                          transition={{ duration: 0.3 }}
                        >
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <InfoIcon className="h-4 w-4" />
                            Key Advantage
                          </h4>
                          <p>{race.advantages}</p>
                        </motion.div>

                        <motion.div
                          className="bg-primary/10 p-4 rounded-lg shadow-neuro-concave border border-neuro-highlight/30"
                          whileHover={{ scale: 1.01 }}
                          transition={{ duration: 0.3 }}
                        >
                          <h4 className="font-medium mb-2">Abilities</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {race.abilities.map((ability, index) => (
                              <li key={index}>{ability}</li>
                            ))}
                          </ul>
                        </motion.div>

                        {/* Race traits visualization */}
                        <div className="grid grid-cols-4 gap-2 mt-3">
                          <div className="bg-background/50 rounded-md p-2 text-center shadow-neuro-concave">
                            <div className="text-xs font-medium">Power</div>
                            <div className="flex justify-center mt-1">
                              {[
                                ...Array(
                                  race.name === "Raksasa"
                                    ? 5
                                    : race.name === "Jatayu"
                                      ? 4
                                      : race.name === "Tibrasara"
                                        ? 4
                                        : race.name === "Kurawa"
                                          ? 3
                                          : race.name === "Ksatriya"
                                            ? 3
                                            : race.name === "Wanamarta"
                                              ? 2
                                              : race.name === "Wirabumi"
                                                ? 3
                                                : 2,
                                ),
                              ].map((_, i) => (
                                <div
                                  key={i}
                                  className="w-1 h-3 bg-foreground/70 mx-0.5 rounded-sm"
                                ></div>
                              ))}
                            </div>
                          </div>
                          <div className="bg-background/50 rounded-md p-2 text-center shadow-neuro-concave">
                            <div className="text-xs font-medium">Speed</div>
                            <div className="flex justify-center mt-1">
                              {[
                                ...Array(
                                  race.name === "Jatayu"
                                    ? 5
                                    : race.name === "Kurawa"
                                      ? 4
                                      : race.name === "Tibrasara"
                                        ? 4
                                        : race.name === "Ksatriya"
                                          ? 3
                                          : race.name === "Wanamarta"
                                            ? 3
                                            : race.name === "Dedemit"
                                              ? 3
                                              : race.name === "Wirabumi"
                                                ? 2
                                                : 2,
                                ),
                              ].map((_, i) => (
                                <div
                                  key={i}
                                  className="w-1 h-3 bg-foreground/70 mx-0.5 rounded-sm"
                                ></div>
                              ))}
                            </div>
                          </div>
                          <div className="bg-background/50 rounded-md p-2 text-center shadow-neuro-concave">
                            <div className="text-xs font-medium">Magic</div>
                            <div className="flex justify-center mt-1">
                              {[
                                ...Array(
                                  race.name === "Wanamarta"
                                    ? 5
                                    : race.name === "Dedemit"
                                      ? 4
                                      : race.name === "Kurawa"
                                        ? 3
                                        : race.name === "Ksatriya"
                                          ? 3
                                          : race.name === "Jatayu"
                                            ? 2
                                            : race.name === "Tibrasara"
                                              ? 2
                                              : race.name === "Wirabumi"
                                                ? 1
                                                : 1,
                                ),
                              ].map((_, i) => (
                                <div
                                  key={i}
                                  className="w-1 h-3 bg-foreground/70 mx-0.5 rounded-sm"
                                ></div>
                              ))}
                            </div>
                          </div>
                          <div className="bg-background/50 rounded-md p-2 text-center shadow-neuro-concave">
                            <div className="text-xs font-medium">Defense</div>
                            <div className="flex justify-center mt-1">
                              {[
                                ...Array(
                                  race.name === "Wirabumi"
                                    ? 5
                                    : race.name === "Dedemit"
                                      ? 4
                                      : race.name === "Raksasa"
                                        ? 4
                                        : race.name === "Ksatriya"
                                          ? 3
                                          : race.name === "Tibrasara"
                                            ? 3
                                            : race.name === "Wanamarta"
                                              ? 2
                                              : race.name === "Jatayu"
                                                ? 2
                                                : 2,
                                ),
                              ].map((_, i) => (
                                <div
                                  key={i}
                                  className="w-1 h-3 bg-foreground/70 mx-0.5 rounded-sm"
                                ></div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </div>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2 border-t border-neuro-highlight/20 pt-6">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      className="shadow-neuro-flat hover:shadow-neuro-pressed transition-all duration-300"
                      onClick={() => {
                        const randomRace =
                          races[Math.floor(Math.random() * races.length)].id;
                        setActiveTab(randomRace);
                        handleSelectRace(randomRace);
                      }}
                    >
                      <motion.span
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 0.5, repeat: 0 }}
                        className="mr-2"
                      >
                        🎲
                      </motion.span>
                      Random Race
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent className="bg-neuro-bg border border-neuro-highlight shadow-neuro-flat">
                  <p>Let fate decide your destiny</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={!selectedRace ? "opacity-70" : ""}
            >
              <Button
                onClick={() => setConfirmDialogOpen(true)}
                disabled={!selectedRace}
                className="px-8 shadow-neuro-flat hover:shadow-neuro-pressed transition-all duration-300"
              >
                Confirm Selection
              </Button>
            </motion.div>
          </CardFooter>
        </Card>

        <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
          <DialogContent className="border-2 border-neuro-highlight/30 shadow-neuro-flat-lg">
            <DialogHeader>
              <DialogTitle className="text-xl">Confirm Your Choice</DialogTitle>
              <DialogDescription>
                {selectedRace && (
                  <span>
                    You are about to lead the{" "}
                    <span className="font-semibold">
                      {races.find((r) => r.id === selectedRace)?.name}
                    </span>{" "}
                    race. This choice will determine your kingdom's strengths
                    and strategies.
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>

            {selectedRace && (
              <motion.div
                className="bg-muted/30 rounded-lg p-4 my-2 shadow-neuro-concave border border-neuro-highlight/30"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center space-x-3 py-2">
                  <div className="p-2 bg-background/50 rounded-full shadow-neuro-flat">
                    {races.find((r) => r.id === selectedRace)?.icon}
                  </div>
                  <span className="font-medium text-lg">
                    {races.find((r) => r.id === selectedRace)?.name}
                  </span>
                </div>
                <div className="mt-2 text-sm">
                  <p className="text-muted-foreground">
                    {races.find((r) => r.id === selectedRace)?.description}
                  </p>
                  <p className="mt-2 font-medium">Key advantage:</p>
                  <p>{races.find((r) => r.id === selectedRace)?.advantages}</p>
                </div>
              </motion.div>
            )}

            <DialogFooter className="mt-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  onClick={() => setConfirmDialogOpen(false)}
                  className="shadow-neuro-flat hover:shadow-neuro-pressed transition-all duration-300"
                >
                  Cancel
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleConfirmSelection}
                  className="shadow-neuro-flat hover:shadow-neuro-pressed transition-all duration-300"
                >
                  Begin Your Journey
                </Button>
              </motion.div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
};

export default RaceSelection;
