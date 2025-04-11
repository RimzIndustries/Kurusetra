import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
import { Crown, ChevronRight, ArrowRight } from "lucide-react";

const UserOnboarding = () => {
  const { user, userProfile, hasCompletedSetup } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(25);
  const [selectedRace, setSelectedRace] = useState<string | null>(null);

  // Check if user has already completed setup
  useEffect(() => {
    if (user && hasCompletedSetup()) {
      navigate("/");
    }
  }, [user, hasCompletedSetup, navigate]);

  const handleRaceSelection = (raceId: string) => {
    setSelectedRace(raceId);
    setStep(2);
    setProgress(50);
  };

  const handleContinue = () => {
    if (selectedRace) {
      navigate(`/setup-kingdom?race=${selectedRace}`);
    }
  };

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

            {/* Progress indicator */}
            <div className="mt-4 space-y-1">
              <div className="flex justify-between text-sm">
                <span>Onboarding Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {step === 1 ? (
              <div className="space-y-4">
                <RaceSelection
                  onSelectRace={handleRaceSelection}
                  isOpen={true}
                />
              </div>
            ) : (
              <div className="space-y-6 p-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
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
              </div>
            )}
          </CardContent>

          <CardFooter className="border-t border-primary/10 pt-4">
            <p className="text-sm text-muted-foreground">
              Your choices will determine your kingdom's strengths and
              strategies in the game.
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default UserOnboarding;
