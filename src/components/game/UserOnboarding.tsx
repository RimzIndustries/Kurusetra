import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Progress } from "../ui/progress";
import { motion } from "framer-motion";
import RaceSelection from "./RaceSelection";

const UserOnboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      navigate("/setup-kingdom");
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSkip = () => {
    navigate("/setup-kingdom");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-white/10 backdrop-blur-md border-slate-700">
        <CardHeader>
          <CardTitle className="text-2xl text-white">
            Welcome to Kurusetra
          </CardTitle>
          <CardDescription className="text-slate-300">
            Let's get you started on your journey to build a mighty kingdom
          </CardDescription>
          <div className="mt-2">
            <Progress
              value={(step / totalSteps) * 100}
              className="h-2 bg-slate-700"
            />
            <p className="text-sm text-slate-400 mt-1">
              Step {step} of {totalSteps}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <h3 className="text-xl text-white">The World of Kurusetra</h3>
              <p className="text-slate-300">
                Kurusetra is a land of ancient kingdoms, powerful alliances, and
                strategic warfare. As a ruler, you will build your civilization,
                train armies, and engage in battles with other kingdoms.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                  <h4 className="text-white font-medium">Build Your Kingdom</h4>
                  <p className="text-sm text-slate-400 mt-1">
                    Construct buildings, manage resources, and expand your
                    territory
                  </p>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                  <h4 className="text-white font-medium">Form Alliances</h4>
                  <p className="text-sm text-slate-400 mt-1">
                    Join a Dewan Raja with up to 15 other kingdoms to plan
                    strategies together
                  </p>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                  <h4 className="text-white font-medium">Train Your Army</h4>
                  <p className="text-sm text-slate-400 mt-1">
                    Build military units with unique abilities and strengths
                  </p>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                  <h4 className="text-white font-medium">Engage in Warfare</h4>
                  <p className="text-sm text-slate-400 mt-1">
                    Plan strategic attacks and defend your kingdom from enemies
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <h3 className="text-xl text-white">Choose Your Race</h3>
              <p className="text-slate-300 mb-4">
                Each race in Kurusetra has unique abilities and advantages.
                Choose wisely as this will affect your gameplay strategy.
              </p>
              <RaceSelection />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <h3 className="text-xl text-white">Game Mechanics</h3>
              <p className="text-slate-300">
                Kurusetra operates in real-time. Your kingdom continues to
                develop even when you're offline. Here are some key mechanics to
                understand:
              </p>
              <ul className="space-y-2 text-slate-300 list-disc pl-5">
                <li>
                  <span className="font-medium">Real-time Progression:</span>{" "}
                  Buildings, training, and research take real-time hours to
                  complete
                </li>
                <li>
                  <span className="font-medium">Resource Management:</span>{" "}
                  Balance gold, food, and other resources to sustain your
                  kingdom
                </li>
                <li>
                  <span className="font-medium">Alliance Coordination:</span>{" "}
                  Communicate with alliance members to coordinate attacks and
                  defense
                </li>
                <li>
                  <span className="font-medium">Strategic Planning:</span> Plan
                  your actions carefully as they have long-term consequences
                </li>
              </ul>
            </motion.div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t border-slate-700 pt-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Back
          </Button>
          <Button
            variant="outline"
            onClick={handleSkip}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Skip Tutorial
          </Button>
          <Button
            onClick={handleNext}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {step === totalSteps ? "Start Your Journey" : "Next"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UserOnboarding;
