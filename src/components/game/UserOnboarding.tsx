import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import RaceSelection from "./RaceSelection";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Crown,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Shield,
  Sword,
  Mountain,
  Bird,
  Wand,
  Ghost,
  Skull,
  Info,
  Check,
} from "lucide-react";

const UserOnboarding = () => {
  const { user, userProfile, hasCompletedSetup } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(25);
  const [selectedRace, setSelectedRace] = useState<string | null>(null);
  const [showRaceDetails, setShowRaceDetails] = useState(false);

  // Check if user has already completed setup
  useEffect(() => {
    if (user && hasCompletedSetup()) {
      navigate("/");
    }
  }, [user, hasCompletedSetup, navigate]);

  const handleRaceSelection = (raceId: string) => {
    setSelectedRace(raceId);
    setShowRaceDetails(true);
    setTimeout(() => {
      setStep(2);
      setProgress(50);
    }, 1000);
  };

  const handleContinue = () => {
    if (selectedRace) {
      navigate(`/setup-kingdom?race=${selectedRace}`);
    }
  };

  // Race details for the selected race
  const getRaceDetails = () => {
    switch (selectedRace) {
      case "ksatriya":
        return {
          name: "Ksatriya",
          description:
            "The most intelligent beings who live prosperously in the lowlands. They are the most stable race in the Kurusetra universe.",
          icon: <Crown className="h-5 w-5 text-amber-500" />,
          specialty: "Diplomacy and Trade",
          bonus: "+15% Gold production, +10% Diplomatic influence",
          color: "text-amber-500",
          bgColor: "bg-amber-100",
          borderColor: "border-amber-300",
        };
      case "wanamarta":
        return {
          name: "Wanamarta",
          description:
            "Mystical beings who live in dense forests filled with magical auras. They possess extraordinary magical abilities.",
          icon: <Wand className="h-5 w-5 text-emerald-500" />,
          specialty: "Magic and Research",
          bonus: "+20% Magic power, +15% Research speed",
          color: "text-emerald-500",
          bgColor: "bg-emerald-100",
          borderColor: "border-emerald-300",
        };
      case "wirabumi":
        return {
          name: "Wirabumi",
          description:
            "Hard-working beings who live in hidden areas, caves, and underground. Known for their industrious nature.",
          icon: <Mountain className="h-5 w-5 text-stone-500" />,
          specialty: "Mining and Construction",
          bonus: "+25% Resource gathering, +15% Building speed",
          color: "text-stone-500",
          bgColor: "bg-stone-100",
          borderColor: "border-stone-300",
        };
      case "jatayu":
        return {
          name: "Jatayu",
          description:
            "Flying beings who live in highlands. They possess incredible aggressive attack capabilities and unmatched speed.",
          icon: <Bird className="h-5 w-5 text-sky-500" />,
          specialty: "Speed and Reconnaissance",
          bonus: "+30% Movement speed, +20% Vision range",
          color: "text-sky-500",
          bgColor: "bg-sky-100",
          borderColor: "border-sky-300",
        };
      case "kurawa":
        return {
          name: "Kurawa",
          description:
            "The most cunning lowland beings in the Kurusetra universe. Masters of secret operations and deception.",
          icon: <Skull className="h-5 w-5 text-purple-500" />,
          specialty: "Espionage and Sabotage",
          bonus: "+25% Spy effectiveness, +15% Enemy detection",
          color: "text-purple-500",
          bgColor: "bg-purple-100",
          borderColor: "border-purple-300",
        };
      case "tibrasara":
        return {
          name: "Tibrasara",
          description:
            "Mysterious beings who live in dark forests with unparalleled archery skills. Their killing instinct is feared throughout the realm.",
          icon: <Shield className="h-5 w-5 text-indigo-500" />,
          specialty: "Ranged Combat and Stealth",
          bonus: "+20% Ranged damage, +15% Stealth capability",
          color: "text-indigo-500",
          bgColor: "bg-indigo-100",
          borderColor: "border-indigo-300",
        };
      case "raksasa":
        return {
          name: "Raksasa",
          description:
            "Enormous and terrifying beings who inhabit steep rocky hills. Their army strength is unmatched in the realm.",
          icon: <Sword className="h-5 w-5 text-red-500" />,
          specialty: "Brute Force and Intimidation",
          bonus: "+30% Army strength, +20% Enemy morale reduction",
          color: "text-red-500",
          bgColor: "bg-red-100",
          borderColor: "border-red-300",
        };
      case "dedemit":
        return {
          name: "Dedemit",
          description:
            "Spectral beings who exist in the realm of wandering spirits. They require no food to survive and their armies never perish in battle.",
          icon: <Ghost className="h-5 w-5 text-slate-500" />,
          specialty: "Immortality and Spirit Magic",
          bonus: "-25% Food consumption, +20% Army revival rate",
          color: "text-slate-500",
          bgColor: "bg-slate-100",
          borderColor: "border-slate-300",
        };
      default:
        return null;
    }
  };

  const raceDetails = getRaceDetails();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 bg-gradient-to-b from-background to-background/95">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <Card className="border-2 border-primary/20 shadow-neuro-flat-lg overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Crown className="h-6 w-6 text-primary" />
              Welcome to Kurusetra
            </CardTitle>
            <CardDescription>
              Complete these steps to begin your journey in the Kurusetra
              universe
            </CardDescription>

            {/* Enhanced progress indicator */}
            <div className="mt-4 space-y-1">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Onboarding Progress</span>
                  {step > 1 && (
                    <Badge
                      variant="outline"
                      className="bg-primary/10 text-primary"
                    >
                      Race Selected
                    </Badge>
                  )}
                </div>
                <span className="font-bold">{progress}%</span>
              </div>
              <div className="relative">
                <Progress value={progress} className="h-2" />
                <div className="absolute top-0 left-0 w-full flex justify-between px-1 -mt-1">
                  <div
                    className={`h-4 w-4 rounded-full ${progress >= 25 ? "bg-primary" : "bg-muted"} flex items-center justify-center text-[10px] text-white font-bold`}
                  >
                    1
                  </div>
                  <div
                    className={`h-4 w-4 rounded-full ${progress >= 50 ? "bg-primary" : "bg-muted"} flex items-center justify-center text-[10px] text-white font-bold`}
                  >
                    2
                  </div>
                  <div
                    className={`h-4 w-4 rounded-full ${progress >= 75 ? "bg-primary" : "bg-muted"} flex items-center justify-center text-[10px] text-white font-bold`}
                  >
                    3
                  </div>
                  <div
                    className={`h-4 w-4 rounded-full ${progress >= 100 ? "bg-primary" : "bg-muted"} flex items-center justify-center text-[10px] text-white font-bold`}
                  >
                    4
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground px-1">
                <span>Race</span>
                <span>Kingdom</span>
                <span>Capital</span>
                <span>Complete</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="race-selection"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold mb-2">Choose Your Race</h2>
                    <p className="text-muted-foreground">
                      Your race will determine your kingdom's strengths and
                      special abilities
                    </p>
                  </div>
                  <RaceSelection
                    onSelectRace={handleRaceSelection}
                    isOpen={true}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="race-details"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 p-4"
                >
                  {raceDetails && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className={`p-6 rounded-lg ${raceDetails.bgColor} border ${raceDetails.borderColor} shadow-lg`}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-white/50 rounded-full shadow-md">
                          {raceDetails.icon}
                        </div>
                        <div>
                          <h3
                            className={`text-xl font-bold ${raceDetails.color}`}
                          >
                            {raceDetails.name}
                          </h3>
                          <Badge
                            variant="outline"
                            className={`${raceDetails.color} border-current mt-1`}
                          >
                            Selected Race
                          </Badge>
                        </div>
                      </div>

                      <p className="mb-4">{raceDetails.description}</p>

                      <Separator className="my-4" />

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Sparkles
                            className={`h-4 w-4 ${raceDetails.color}`}
                          />
                          <span className="font-medium">
                            Specialty: {raceDetails.specialty}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className={`h-4 w-4 ${raceDetails.color}`} />
                          <span>Starting Bonus: {raceDetails.bonus}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="text-center"
                  >
                    <h2 className="text-xl font-bold mb-2">Race Selected!</h2>
                    <p>Now let's set up your kingdom details</p>
                  </motion.div>

                  <div className="flex justify-center">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={handleContinue}
                        className="px-8 py-6 text-lg font-semibold shadow-neuro-flat hover:shadow-neuro-pressed transition-all duration-300"
                      >
                        Continue to Kingdom Setup
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>

          <CardFooter className="border-t border-primary/10 pt-4">
            <div className="w-full flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Your choices will determine your kingdom's strengths and
                strategies in the game.
              </p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Info className="h-3 w-3" />
                <span>Step {step} of 4</span>
              </div>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default UserOnboarding;
