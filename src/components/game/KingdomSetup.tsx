import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Crown,
  MapPin,
  Wand,
  Mountain,
  Bird,
  Skull,
  Shield,
  Sword,
  Ghost,
  Info,
  Sparkles,
  Flag,
  Landmark,
  ChevronRight,
  ChevronLeft,
  Check,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react";

interface KingdomSetupProps {
  selectedRace?: string;
}

const KingdomSetup = ({
  selectedRace: propSelectedRace,
}: KingdomSetupProps) => {
  const location = useLocation();
  // Get race from URL query parameters if not provided as prop
  const [selectedRace, setSelectedRace] = useState<string | undefined>(
    propSelectedRace,
  );

  // Define races object outside of the function to avoid recreation on each render
  const races = {
    // This matches the race IDs from RaceSelection component
    ksatriya: {
      name: "Ksatriya",
      description:
        "The most intelligent beings who live prosperously in the lowlands. They are the most stable race in the Kurusetra universe.",
      icon: <Crown className="h-4 w-4" />,
      color: "bg-amber-100 border-amber-300",
      textColor: "text-amber-800",
      buttonColor: "bg-amber-600 hover:bg-amber-700",
      specialty: "Diplomacy and Trade",
      startingBonus: "+15% Gold production, +10% Diplomatic influence",
    },
    wanamarta: {
      name: "Wanamarta",
      description:
        "Mystical beings who live in dense forests filled with magical auras. They possess extraordinary magical abilities.",
      icon: <Wand className="h-4 w-4" />,
      color: "bg-emerald-100 border-emerald-300",
      textColor: "text-emerald-800",
      buttonColor: "bg-emerald-600 hover:bg-emerald-700",
      specialty: "Magic and Research",
      startingBonus: "+20% Magic power, +15% Research speed",
    },
    wirabumi: {
      name: "Wirabumi",
      description:
        "Hard-working beings who live in hidden areas, caves, and underground. Known for their industrious nature.",
      icon: <Mountain className="h-4 w-4" />,
      color: "bg-stone-100 border-stone-300",
      textColor: "text-stone-800",
      buttonColor: "bg-stone-600 hover:bg-stone-700",
      specialty: "Mining and Construction",
      startingBonus: "+25% Resource gathering, +15% Building speed",
    },
    jatayu: {
      name: "Jatayu",
      description:
        "Flying beings who live in highlands. They possess incredible aggressive attack capabilities and unmatched speed.",
      icon: <Bird className="h-4 w-4" />,
      color: "bg-sky-100 border-sky-300",
      textColor: "text-sky-800",
      buttonColor: "bg-sky-600 hover:bg-sky-700",
      specialty: "Speed and Reconnaissance",
      startingBonus: "+30% Movement speed, +20% Vision range",
    },
    kurawa: {
      name: "Kurawa",
      description:
        "The most cunning lowland beings in the Kurusetra universe. Masters of secret operations and deception.",
      icon: <Skull className="h-4 w-4" />,
      color: "bg-purple-100 border-purple-300",
      textColor: "text-purple-800",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      specialty: "Espionage and Sabotage",
      startingBonus: "+25% Spy effectiveness, +15% Enemy detection",
    },
    tibrasara: {
      name: "Tibrasara",
      description:
        "Mysterious beings who live in dark forests with unparalleled archery skills. Their killing instinct is feared throughout the realm.",
      icon: <Shield className="h-4 w-4" />,
      color: "bg-indigo-100 border-indigo-300",
      textColor: "text-indigo-800",
      buttonColor: "bg-indigo-600 hover:bg-indigo-700",
      specialty: "Ranged Combat and Stealth",
      startingBonus: "+20% Ranged damage, +15% Stealth capability",
    },
    raksasa: {
      name: "Raksasa",
      description:
        "Enormous and terrifying beings who inhabit steep rocky hills. Their army strength is unmatched in the realm.",
      icon: <Sword className="h-4 w-4" />,
      color: "bg-red-100 border-red-300",
      textColor: "text-red-800",
      buttonColor: "bg-red-600 hover:bg-red-700",
      specialty: "Brute Force and Intimidation",
      startingBonus: "+30% Army strength, +20% Enemy morale reduction",
    },
    dedemit: {
      name: "Dedemit",
      description:
        "Spectral beings who exist in the realm of wandering spirits. They require no food to survive and their armies never perish in battle.",
      icon: <Ghost className="h-4 w-4" />,
      color: "bg-slate-100 border-slate-300",
      textColor: "text-slate-800",
      buttonColor: "bg-slate-600 hover:bg-slate-700",
      specialty: "Immortality and Spirit Magic",
      startingBonus: "-25% Food consumption, +20% Army revival rate",
    },
  };

  // Debug log to check initial race value
  useEffect(() => {
    console.log("Initial race value:", propSelectedRace);
    if (propSelectedRace) {
      setSelectedRace(propSelectedRace);
      console.log("Setting selected race to:", propSelectedRace);
    }
  }, [propSelectedRace]);

  useEffect(() => {
    // If race is not provided as prop, try to get it from URL query parameters
    if (!selectedRace) {
      const params = new URLSearchParams(location.search);
      const raceFromUrl = params.get("race");
      if (raceFromUrl) {
        // Check if the race is valid by checking if it exists in our races object
        if (races[raceFromUrl as keyof typeof races]) {
          setSelectedRace(raceFromUrl);
          console.log("Race set from URL:", raceFromUrl);
        }
      }
    } else {
      console.log("Race already set from props or state:", selectedRace);
    }
  }, [location.search, selectedRace]);

  const [kingdomName, setKingdomName] = useState("");
  const [kingdomDescription, setKingdomDescription] = useState("");
  const [kingdomMotto, setKingdomMotto] = useState("");
  const [kingdomCapital, setKingdomCapital] = useState("");
  const [selectedZodiac, setSelectedZodiac] = useState<string>("");
  const [setupProgress, setSetupProgress] = useState(25);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const { updateUserProfile, userProfile } = useAuth();
  const navigate = useNavigate();

  // Get race details based on selected race ID
  const getRaceDetails = (raceId?: string) => {
    // Using the provided raceId or falling back to selectedRace
    const raceToCheck = raceId || selectedRace;

    // Check if the race exists in our races object
    return raceToCheck && races[raceToCheck as keyof typeof races]
      ? races[raceToCheck as keyof typeof races]
      : {
          name: "Unknown",
          description: "Select a race to see details.",
          icon: <MapPin className="h-4 w-4" />,
          color: "bg-gray-100 border-gray-300",
          textColor: "text-gray-800",
          buttonColor: "bg-gray-600 hover:bg-gray-700",
          specialty: "Unknown",
          startingBonus: "None",
        };
  };

  // Memoize race details to prevent unnecessary recalculations
  const raceDetails = React.useMemo(
    () => getRaceDetails(selectedRace),
    [selectedRace],
  );

  const [fieldErrors, setFieldErrors] = useState<{
    kingdomName?: string;
    kingdomDescription?: string;
    kingdomCapital?: string;
    kingdomMotto?: string;
  }>({});

  const validateCurrentStep = () => {
    setError(null);
    let isValid = true;
    const errors: any = {};

    if (step === 1) {
      if (!kingdomName.trim()) {
        errors.kingdomName = "Kingdom name is required";
        setError("Please enter a kingdom name");
        isValid = false;
      } else if (kingdomName.trim().length < 3) {
        errors.kingdomName = "Name must be at least 3 characters";
        setError("Kingdom name must be at least 3 characters");
        isValid = false;
      }
    }

    if (step === 2) {
      if (
        kingdomDescription.trim().length > 0 &&
        kingdomDescription.trim().length < 10
      ) {
        errors.kingdomDescription =
          "Description should be at least 10 characters";
        setError(
          "Please provide a more detailed description or leave it empty",
        );
        isValid = false;
      }
    }

    if (step === 3) {
      if (
        kingdomCapital.trim().length > 0 &&
        kingdomCapital.trim().length < 3
      ) {
        errors.kingdomCapital = "Capital name must be at least 3 characters";
        setError("Capital name must be at least 3 characters");
        isValid = false;
      }

      if (kingdomMotto.trim().length > 0 && kingdomMotto.trim().length < 5) {
        errors.kingdomMotto = "Motto must be at least 5 characters";
        setError("Motto must be at least 5 characters");
        isValid = false;
      }
    }

    if (!selectedRace) {
      setError("Please select a race first");
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setStep(step + 1);
      setSetupProgress(step === 1 ? 50 : step === 2 ? 75 : 100);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    setSetupProgress(step === 2 ? 25 : step === 3 ? 50 : 75);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateCurrentStep()) {
      return;
    }

    // The actual submission is now handled in the button onClick handler
    // to allow for the success animation before navigation
  };

  // Animation variants for step transitions
  const pageVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  // Animation variants for success/error feedback
  const feedbackVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  };

  // Animation variants for field validation
  const validationVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  };

  // Animation variants for decorative elements
  const decorativeVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  // Animation variants for success animation
  const successVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } },
  };

  // Function to get step title with icon
  const getStepTitle = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Crown className="h-5 w-5" />
            <span>Name Your Kingdom</span>
          </>
        );
      case 2:
        return (
          <>
            <Landmark className="h-5 w-5" />
            <span>Describe Your Kingdom</span>
          </>
        );
      case 3:
        return (
          <>
            <Flag className="h-5 w-5" />
            <span>Establish Your Capital</span>
          </>
        );
      case 4:
        return (
          <>
            <Check className="h-5 w-5" />
            <span>Review & Confirm</span>
          </>
        );
      default:
        return "Kingdom Setup";
    }
  };

  // Success animation state
  const [showSuccess, setShowSuccess] = useState(false);

  // Handle field focus for enhanced UX
  const [focusedField, setFocusedField] = useState<string | null>(null);

  return (
    <div className="flex justify-center items-center min-h-screen bg-background p-4 bg-gradient-to-b from-background to-background/90">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
      >
        {/* Decorative background elements */}
        <motion.div
          className={`absolute -z-10 w-64 h-64 rounded-full ${raceDetails.color} opacity-10 blur-3xl -top-20 -left-20`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1 }}
        />
        <motion.div
          className={`absolute -z-10 w-64 h-64 rounded-full ${raceDetails.color} opacity-10 blur-3xl -bottom-20 -right-20`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1, delay: 0.3 }}
        />
        {/* Success animation overlay */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 rounded-xl flex items-center justify-center"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={successVariants}
            >
              <motion.div
                className="bg-green-100 text-green-800 p-8 rounded-xl flex flex-col items-center gap-4 shadow-neuro-flat-lg border-2 border-green-200 relative overflow-hidden"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {/* Decorative success elements */}
                <motion.div
                  className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-green-200 opacity-50"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                />
                <motion.div
                  className="absolute -bottom-10 -left-10 w-20 h-20 rounded-full bg-green-200 opacity-50"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                />

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="bg-white rounded-full p-2 shadow-lg"
                >
                  <CheckCircle2 className="h-16 w-16 text-green-600" />
                </motion.div>
                <motion.h2
                  className="text-xl font-bold"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  Kingdom Created!
                </motion.h2>
                <motion.p
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  Your journey in the Kurusetra universe begins now.
                </motion.p>

                <motion.p
                  className="text-center text-sm text-green-600 mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  Redirecting to your kingdom dashboard...
                </motion.p>

                {/* Success sparkles */}
                <motion.div
                  className="absolute top-5 left-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <Sparkles className="h-4 w-4 text-green-400" />
                </motion.div>
                <motion.div
                  className="absolute bottom-5 right-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <Sparkles className="h-4 w-4 text-green-400" />
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <Card
          className={`border-2 ${raceDetails.color} shadow-neuro-flat-lg overflow-hidden transition-all duration-300 hover:shadow-neuro-flat-xl neuro-glow`}
        >
          <CardHeader className={`${raceDetails.textColor} pb-2`}>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                {getStepTitle()}
              </CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full hover:bg-background/20"
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-neuro-bg border border-neuro-highlight shadow-neuro-flat">
                    <p>Complete all steps to establish your kingdom</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <CardDescription className="text-sm">
              Your {raceDetails.name} civilization awaits your leadership
            </CardDescription>

            {/* Race badge */}
            <div className="mt-2">
              <Badge
                className={`${raceDetails.color} ${raceDetails.textColor} border border-neuro-highlight/50 shadow-neuro-flat px-3 py-1 flex items-center gap-1.5`}
              >
                {raceDetails.icon}
                {raceDetails.name} Race
              </Badge>
            </div>

            {/* Enhanced Step indicators */}
            <div className="flex justify-between mt-4 mb-1 relative">
              {/* Connecting line with progress indicator */}
              <div className="absolute top-4 left-4 right-4 h-0.5 bg-muted/50 -z-10"></div>
              <motion.div
                className={`absolute top-4 left-4 h-0.5 ${raceDetails.buttonColor.split(" ")[0]} -z-10`}
                initial={{ width: "0%" }}
                animate={{ width: `${(step - 1) * 33.33}%` }}
                transition={{ duration: 0.5 }}
              ></motion.div>

              {[1, 2, 3, 4].map((stepNumber) => (
                <motion.div
                  key={stepNumber}
                  className="flex flex-col items-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      step === stepNumber
                        ? `${raceDetails.color} shadow-neuro-convex border border-neuro-highlight`
                        : step > stepNumber
                          ? `${raceDetails.color} shadow-neuro-flat`
                          : "bg-muted/30"
                    }`}
                    animate={{
                      scale: step === stepNumber ? 1.1 : 1,
                      boxShadow:
                        step === stepNumber
                          ? "0 4px 8px rgba(0,0,0,0.1)"
                          : "none",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {step > stepNumber ? (
                      <motion.div
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Check className="h-4 w-4" />
                      </motion.div>
                    ) : (
                      <span className="text-xs font-medium">{stepNumber}</span>
                    )}
                  </motion.div>

                  {/* Enhanced Step label */}
                  <motion.span
                    className={`text-[10px] mt-1 font-medium ${step === stepNumber ? raceDetails.textColor : "text-muted-foreground"}`}
                    animate={{
                      fontWeight: step === stepNumber ? 600 : 400,
                      scale: step === stepNumber ? 1.05 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {stepNumber === 1
                      ? "Name"
                      : stepNumber === 2
                        ? "Describe"
                        : stepNumber === 3
                          ? "Capital"
                          : "Review"}
                  </motion.span>
                </motion.div>
              ))}
            </div>
            <Progress
              value={setupProgress}
              className={`h-2 mt-1 ${raceDetails.color}`}
            />
          </CardHeader>
          <CardContent className="pt-4">
            {error && (
              <Alert
                variant="destructive"
                className="mb-4 border border-destructive/20 shadow-neuro-flat"
              >
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div
              className={`p-4 rounded-xl mb-6 ${raceDetails.color} shadow-neuro-concave border border-neuro-highlight/50 transition-all duration-300 hover:shadow-neuro-flat`}
            >
              <div className="mb-4">
                <Label htmlFor="race-select" className="mb-2 block font-medium">
                  Choose Your Race
                </Label>
                <Select
                  value={selectedRace}
                  onValueChange={(value) => {
                    console.log("Race selected from dropdown:", value);
                    setSelectedRace(value);
                  }}
                >
                  <SelectTrigger
                    id="race-select"
                    className="w-full shadow-neuro-flat"
                  >
                    <SelectValue placeholder="Select a race" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Available Races</SelectLabel>
                      <SelectItem value="ksatriya">
                        <div className="flex items-center gap-2">
                          <Crown className="h-4 w-4" /> Ksatriya
                        </div>
                      </SelectItem>
                      <SelectItem value="wanamarta">
                        <div className="flex items-center gap-2">
                          <Wand className="h-4 w-4" /> Wanamarta
                        </div>
                      </SelectItem>
                      <SelectItem value="wirabumi">
                        <div className="flex items-center gap-2">
                          <Mountain className="h-4 w-4" /> Wirabumi
                        </div>
                      </SelectItem>
                      <SelectItem value="jatayu">
                        <div className="flex items-center gap-2">
                          <Bird className="h-4 w-4" /> Jatayu
                        </div>
                      </SelectItem>
                      <SelectItem value="kurawa">
                        <div className="flex items-center gap-2">
                          <Skull className="h-4 w-4" /> Kurawa
                        </div>
                      </SelectItem>
                      <SelectItem value="tibrasara">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" /> Tibrasara
                        </div>
                      </SelectItem>
                      <SelectItem value="raksasa">
                        <div className="flex items-center gap-2">
                          <Sword className="h-4 w-4" /> Raksasa
                        </div>
                      </SelectItem>
                      <SelectItem value="dedemit">
                        <div className="flex items-center gap-2">
                          <Ghost className="h-4 w-4" /> Dedemit
                        </div>
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <h3
                className={`font-medium mb-2 flex items-center gap-2 ${raceDetails.textColor}`}
              >
                <div className="w-8 h-8 rounded-full bg-background/50 flex items-center justify-center shadow-neuro-flat">
                  {raceDetails.icon || <MapPin className="h-4 w-4" />}
                </div>
                <span className="font-semibold">
                  Selected Race: {raceDetails.name}
                </span>
              </h3>
              <p className="text-sm text-muted-foreground">
                {raceDetails.description}
              </p>
              <div className="mt-3 pt-3 border-t border-muted">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Sparkles className="h-4 w-4" />
                  <span>Specialty: {raceDetails.specialty}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Starting Bonus: {raceDetails.startingBonus}
                </p>

                <div className="mt-4">
                  <Label
                    htmlFor="zodiac-select"
                    className="mb-2 block font-medium"
                  >
                    Choose Your Zodiac Sign
                  </Label>
                  <Select
                    value={selectedZodiac}
                    onValueChange={(value) => {
                      console.log("Zodiac selected:", value);
                      setSelectedZodiac(value);
                    }}
                  >
                    <SelectTrigger
                      id="zodiac-select"
                      className="w-full shadow-neuro-flat"
                    >
                      <SelectValue placeholder="Select a zodiac sign" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Zodiac Signs</SelectLabel>
                        <SelectItem value="aries">
                          Aries (Mar 21 - Apr 19)
                        </SelectItem>
                        <SelectItem value="taurus">
                          Taurus (Apr 20 - May 20)
                        </SelectItem>
                        <SelectItem value="gemini">
                          Gemini (May 21 - Jun 20)
                        </SelectItem>
                        <SelectItem value="cancer">
                          Cancer (Jun 21 - Jul 22)
                        </SelectItem>
                        <SelectItem value="leo">
                          Leo (Jul 23 - Aug 22)
                        </SelectItem>
                        <SelectItem value="virgo">
                          Virgo (Aug 23 - Sep 22)
                        </SelectItem>
                        <SelectItem value="libra">
                          Libra (Sep 23 - Oct 22)
                        </SelectItem>
                        <SelectItem value="scorpio">
                          Scorpio (Oct 23 - Nov 21)
                        </SelectItem>
                        <SelectItem value="sagittarius">
                          Sagittarius (Nov 22 - Dec 21)
                        </SelectItem>
                        <SelectItem value="capricorn">
                          Capricorn (Dec 22 - Jan 19)
                        </SelectItem>
                        <SelectItem value="aquarius">
                          Aquarius (Jan 20 - Feb 18)
                        </SelectItem>
                        <SelectItem value="pisces">
                          Pisces (Feb 19 - Mar 20)
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  {selectedZodiac && (
                    <div className="mt-2 p-2 bg-background/50 rounded-md shadow-neuro-concave">
                      <p className="text-sm font-medium">
                        Selected Zodiac:{" "}
                        {selectedZodiac.charAt(0).toUpperCase() +
                          selectedZodiac.slice(1)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Race traits visualization */}
                <div className="grid grid-cols-4 gap-2 mt-3">
                  <div className="bg-background/50 rounded-md p-2 text-center">
                    <div className="text-xs font-medium">Power</div>
                    <div className="flex justify-center mt-1">
                      {[
                        ...Array(
                          raceDetails.name === "Raksasa"
                            ? 5
                            : raceDetails.name === "Jatayu"
                              ? 4
                              : raceDetails.name === "Tibrasara"
                                ? 4
                                : raceDetails.name === "Kurawa"
                                  ? 3
                                  : raceDetails.name === "Ksatriya"
                                    ? 3
                                    : raceDetails.name === "Wanamarta"
                                      ? 2
                                      : raceDetails.name === "Wirabumi"
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
                  <div className="bg-background/50 rounded-md p-2 text-center">
                    <div className="text-xs font-medium">Speed</div>
                    <div className="flex justify-center mt-1">
                      {[
                        ...Array(
                          raceDetails.name === "Jatayu"
                            ? 5
                            : raceDetails.name === "Kurawa"
                              ? 4
                              : raceDetails.name === "Tibrasara"
                                ? 4
                                : raceDetails.name === "Ksatriya"
                                  ? 3
                                  : raceDetails.name === "Wanamarta"
                                    ? 3
                                    : raceDetails.name === "Dedemit"
                                      ? 3
                                      : raceDetails.name === "Wirabumi"
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
                  <div className="bg-background/50 rounded-md p-2 text-center">
                    <div className="text-xs font-medium">Magic</div>
                    <div className="flex justify-center mt-1">
                      {[
                        ...Array(
                          raceDetails.name === "Wanamarta"
                            ? 5
                            : raceDetails.name === "Dedemit"
                              ? 4
                              : raceDetails.name === "Kurawa"
                                ? 3
                                : raceDetails.name === "Ksatriya"
                                  ? 3
                                  : raceDetails.name === "Jatayu"
                                    ? 2
                                    : raceDetails.name === "Tibrasara"
                                      ? 2
                                      : raceDetails.name === "Wirabumi"
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
                  <div className="bg-background/50 rounded-md p-2 text-center">
                    <div className="text-xs font-medium">Defense</div>
                    <div className="flex justify-center mt-1">
                      {[
                        ...Array(
                          raceDetails.name === "Wirabumi"
                            ? 5
                            : raceDetails.name === "Dedemit"
                              ? 4
                              : raceDetails.name === "Raksasa"
                                ? 4
                                : raceDetails.name === "Ksatriya"
                                  ? 3
                                  : raceDetails.name === "Tibrasara"
                                    ? 3
                                    : raceDetails.name === "Wanamarta"
                                      ? 2
                                      : raceDetails.name === "Jatayu"
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                    transition={{ duration: 0.3 }}
                    className="space-y-3"
                  >
                    <Label
                      htmlFor="kingdomName"
                      className="flex items-center gap-2 text-base font-medium"
                    >
                      <Crown className="h-4 w-4" />
                      Kingdom Name
                    </Label>
                    <div className="relative">
                      <Input
                        id="kingdomName"
                        placeholder="Enter your kingdom name"
                        value={kingdomName}
                        onChange={(e) => setKingdomName(e.target.value)}
                        onFocus={() => setFocusedField("kingdomName")}
                        onBlur={() => setFocusedField(null)}
                        required
                        maxLength={30}
                        className={`border-2 focus:border-2 focus:ring-0 focus:ring-offset-0 ${fieldErrors.kingdomName ? "border-red-300 shadow-neuro-concave-error" : focusedField === "kingdomName" ? `border-${raceDetails.buttonColor.split("-")[1]}-400 shadow-neuro-concave-focus` : "shadow-neuro-concave"} h-11 px-4 transition-all duration-200`}
                      />

                      {/* Validation icon */}
                      <AnimatePresence>
                        {kingdomName.trim().length >= 3 &&
                          !fieldErrors.kingdomName && (
                            <motion.div
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
                              initial="initial"
                              animate="animate"
                              exit="exit"
                              variants={validationVariants}
                            >
                              <CheckCircle2 className="h-5 w-5" />
                            </motion.div>
                          )}

                        {fieldErrors.kingdomName && (
                          <motion.div
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500"
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            variants={validationVariants}
                          >
                            <AlertCircle className="h-5 w-5" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Field error message */}
                    <AnimatePresence>
                      {fieldErrors.kingdomName && (
                        <motion.p
                          className="text-xs text-red-500 mt-1 flex items-center gap-1"
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          variants={validationVariants}
                        >
                          <AlertCircle className="h-3 w-3" />
                          {fieldErrors.kingdomName}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    <p className="text-xs text-muted-foreground mt-1">
                      Choose a name that reflects the glory of your{" "}
                      {raceDetails.name} civilization
                    </p>

                    {/* Character count */}
                    <div className="flex justify-end mt-1">
                      <span
                        className={`text-xs ${kingdomName.length > 25 ? "text-amber-500" : "text-muted-foreground"}`}
                      >
                        {kingdomName.length}/30
                      </span>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                    transition={{ duration: 0.3 }}
                    className="space-y-3"
                  >
                    <Label
                      htmlFor="kingdomDescription"
                      className="flex items-center gap-2 text-base font-medium"
                    >
                      <Landmark className="h-4 w-4" />
                      Kingdom Description
                    </Label>
                    <div className="relative">
                      <Textarea
                        id="kingdomDescription"
                        placeholder="Describe your kingdom's history and culture"
                        value={kingdomDescription}
                        onChange={(e) => setKingdomDescription(e.target.value)}
                        onFocus={() => setFocusedField("kingdomDescription")}
                        onBlur={() => setFocusedField(null)}
                        className={`min-h-[120px] border-2 focus:border-2 focus:ring-0 focus:ring-offset-0 ${fieldErrors.kingdomDescription ? "border-red-300 shadow-neuro-concave-error" : focusedField === "kingdomDescription" ? `border-${raceDetails.buttonColor.split("-")[1]}-400 shadow-neuro-concave-focus` : "shadow-neuro-concave"} p-4 transition-all duration-200`}
                      />

                      {/* Validation icon */}
                      <AnimatePresence>
                        {kingdomDescription.trim().length >= 10 &&
                          !fieldErrors.kingdomDescription &&
                          kingdomDescription.trim().length > 0 && (
                            <motion.div
                              className="absolute right-3 top-3 text-green-500"
                              initial="initial"
                              animate="animate"
                              exit="exit"
                              variants={validationVariants}
                            >
                              <CheckCircle2 className="h-5 w-5" />
                            </motion.div>
                          )}

                        {fieldErrors.kingdomDescription && (
                          <motion.div
                            className="absolute right-3 top-3 text-red-500"
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            variants={validationVariants}
                          >
                            <AlertCircle className="h-5 w-5" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Field error message */}
                    <AnimatePresence>
                      {fieldErrors.kingdomDescription && (
                        <motion.p
                          className="text-xs text-red-500 mt-1 flex items-center gap-1"
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          variants={validationVariants}
                        >
                          <AlertCircle className="h-3 w-3" />
                          {fieldErrors.kingdomDescription}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    <p className="text-xs text-muted-foreground mt-1">
                      This description will be visible to other players
                    </p>

                    {/* Character count */}
                    <div className="flex justify-end mt-1">
                      <span className="text-xs text-muted-foreground">
                        {kingdomDescription.length} characters
                      </span>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="space-y-3">
                      <Label
                        htmlFor="kingdomCapital"
                        className="flex items-center gap-2 text-base font-medium"
                      >
                        <Landmark className="h-4 w-4" />
                        Capital City Name
                      </Label>
                      <div className="relative">
                        <Input
                          id="kingdomCapital"
                          placeholder="Name your capital city"
                          value={kingdomCapital}
                          onChange={(e) => setKingdomCapital(e.target.value)}
                          onFocus={() => setFocusedField("kingdomCapital")}
                          onBlur={() => setFocusedField(null)}
                          className={`border-2 focus:border-2 focus:ring-0 focus:ring-offset-0 ${fieldErrors.kingdomCapital ? "border-red-300 shadow-neuro-concave-error" : focusedField === "kingdomCapital" ? `border-${raceDetails.buttonColor.split("-")[1]}-400 shadow-neuro-concave-focus` : "shadow-neuro-concave"} h-11 px-4 transition-all duration-200`}
                        />

                        {/* Validation icon */}
                        <AnimatePresence>
                          {kingdomCapital.trim().length >= 3 &&
                            !fieldErrors.kingdomCapital &&
                            kingdomCapital.trim().length > 0 && (
                              <motion.div
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                variants={validationVariants}
                              >
                                <CheckCircle2 className="h-5 w-5" />
                              </motion.div>
                            )}

                          {fieldErrors.kingdomCapital && (
                            <motion.div
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500"
                              initial="initial"
                              animate="animate"
                              exit="exit"
                              variants={validationVariants}
                            >
                              <AlertCircle className="h-5 w-5" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Field error message */}
                      <AnimatePresence>
                        {fieldErrors.kingdomCapital && (
                          <motion.p
                            className="text-xs text-red-500 mt-1 flex items-center gap-1"
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            variants={validationVariants}
                          >
                            <AlertCircle className="h-3 w-3" />
                            {fieldErrors.kingdomCapital}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="kingdomMotto"
                        className="flex items-center gap-2 text-base font-medium"
                      >
                        <Flag className="h-4 w-4" />
                        Kingdom Motto
                      </Label>
                      <div className="relative">
                        <Input
                          id="kingdomMotto"
                          placeholder="Enter your kingdom's motto"
                          value={kingdomMotto}
                          onChange={(e) => setKingdomMotto(e.target.value)}
                          onFocus={() => setFocusedField("kingdomMotto")}
                          onBlur={() => setFocusedField(null)}
                          maxLength={50}
                          className={`border-2 focus:border-2 focus:ring-0 focus:ring-offset-0 ${fieldErrors.kingdomMotto ? "border-red-300 shadow-neuro-concave-error" : focusedField === "kingdomMotto" ? `border-${raceDetails.buttonColor.split("-")[1]}-400 shadow-neuro-concave-focus` : "shadow-neuro-concave"} h-11 px-4 transition-all duration-200`}
                        />

                        {/* Validation icon */}
                        <AnimatePresence>
                          {kingdomMotto.trim().length >= 5 &&
                            !fieldErrors.kingdomMotto &&
                            kingdomMotto.trim().length > 0 && (
                              <motion.div
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                variants={validationVariants}
                              >
                                <CheckCircle2 className="h-5 w-5" />
                              </motion.div>
                            )}

                          {fieldErrors.kingdomMotto && (
                            <motion.div
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500"
                              initial="initial"
                              animate="animate"
                              exit="exit"
                              variants={validationVariants}
                            >
                              <AlertCircle className="h-5 w-5" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Field error message */}
                      <AnimatePresence>
                        {fieldErrors.kingdomMotto && (
                          <motion.p
                            className="text-xs text-red-500 mt-1 flex items-center gap-1"
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            variants={validationVariants}
                          >
                            <AlertCircle className="h-3 w-3" />
                            {fieldErrors.kingdomMotto}
                          </motion.p>
                        )}
                      </AnimatePresence>

                      <p className="text-xs text-muted-foreground mt-1">
                        A short phrase that embodies your kingdom's values
                      </p>

                      {/* Character count */}
                      <div className="flex justify-end mt-1">
                        <span
                          className={`text-xs ${kingdomMotto.length > 40 ? "text-amber-500" : "text-muted-foreground"}`}
                        >
                          {kingdomMotto.length}/50
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <h3 className="font-medium text-lg flex items-center gap-2">
                      <Check className="h-5 w-5" />
                      Kingdom Summary
                    </h3>

                    <div className="bg-muted/20 p-4 rounded-xl space-y-3 shadow-neuro-concave border border-neuro-highlight/30 relative overflow-hidden">
                      {/* Decorative corner accent */}
                      <div
                        className={`absolute -top-6 -right-6 w-12 h-12 rounded-full ${raceDetails.color} opacity-50`}
                      ></div>
                      <div
                        className={`absolute -bottom-6 -left-6 w-12 h-12 rounded-full ${raceDetails.color} opacity-50`}
                      ></div>
                      <div>
                        <span className="text-sm font-medium flex items-center gap-2">
                          <Crown className="h-4 w-4" /> Name:
                        </span>
                        <p className="text-base mt-1 pl-6">{kingdomName}</p>
                      </div>

                      <div>
                        <span className="text-sm font-medium flex items-center gap-2">
                          {raceDetails.icon} Race:
                        </span>
                        <p className="text-base mt-1 pl-6">
                          {raceDetails.name}
                        </p>
                      </div>

                      {selectedZodiac && (
                        <div>
                          <span className="text-sm font-medium flex items-center gap-2">
                            <Sparkles className="h-4 w-4" /> Zodiac Sign:
                          </span>
                          <p className="text-base mt-1 pl-6">
                            {selectedZodiac.charAt(0).toUpperCase() +
                              selectedZodiac.slice(1)}
                          </p>
                        </div>
                      )}

                      {kingdomDescription && (
                        <div>
                          <span className="text-sm font-medium flex items-center gap-2">
                            <Landmark className="h-4 w-4" /> Description:
                          </span>
                          <p className="text-sm mt-1 pl-6">
                            {kingdomDescription}
                          </p>
                        </div>
                      )}

                      {kingdomCapital && (
                        <div>
                          <span className="text-sm font-medium flex items-center gap-2">
                            <Landmark className="h-4 w-4" /> Capital:
                          </span>
                          <p className="text-base mt-1 pl-6">
                            {kingdomCapital}
                          </p>
                        </div>
                      )}

                      {kingdomMotto && (
                        <div>
                          <span className="text-sm font-medium flex items-center gap-2">
                            <Flag className="h-4 w-4" /> Motto:
                          </span>
                          <p className="text-base mt-1 pl-6 italic">
                            "{kingdomMotto}"
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-between pt-4 mt-2 border-t border-muted">
                {step > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="border-2 shadow-neuro-flat hover:shadow-neuro-pressed flex items-center gap-2 transition-all duration-200 active:scale-95"
                  >
                    <ChevronLeft className="h-4 w-4" /> Back
                  </Button>
                ) : (
                  <div></div>
                )}

                {step < 4 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className={`${raceDetails.buttonColor} shadow-neuro-flat hover:shadow-neuro-pressed flex items-center gap-2 transition-all duration-200 active:scale-95`}
                  >
                    Continue <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className={`${raceDetails.buttonColor} shadow-neuro-flat hover:shadow-neuro-pressed flex items-center gap-2 transition-all duration-200 active:scale-95`}
                    disabled={loading}
                    onClick={(e) => {
                      if (validateCurrentStep()) {
                        // Show success animation before navigating
                        e.preventDefault();
                        setLoading(true);
                        console.log("Starting kingdom creation process...");
                        setTimeout(() => {
                          setShowSuccess(true);
                          console.log("Showing success animation...");
                          setTimeout(async () => {
                            try {
                              // Save all kingdom data to user profile
                              await updateUserProfile({
                                race: selectedRace,
                                kingdomName: kingdomName.trim(),
                                zodiac: selectedZodiac,
                                specialty: raceDetails.specialty,
                                kingdomDescription: kingdomDescription.trim(),
                                kingdomMotto: kingdomMotto.trim(),
                                kingdomCapital: kingdomCapital.trim(),
                              });

                              // Log the data being saved for debugging
                              console.log("Kingdom setup data saved:", {
                                race: selectedRace,
                                kingdomName: kingdomName.trim(),
                                zodiac: selectedZodiac,
                                specialty: raceDetails.specialty,
                                kingdomDescription: kingdomDescription.trim(),
                                kingdomMotto: kingdomMotto.trim(),
                                kingdomCapital: kingdomCapital.trim(),
                              });

                              console.log("Kingdom data saved successfully!");

                              // Navigate to dashboard after showing success animation (1.5 second delay)
                              // Using /dashboard instead of / to ensure proper routing
                              setTimeout(() => {
                                console.log("Redirecting to dashboard...");
                                // Clear the redirect flag from localStorage
                                localStorage.removeItem("redirectedToSetup");
                                // Set a completed flag to prevent future redirects
                                localStorage.setItem(
                                  "kingdomSetupCompleted",
                                  "true",
                                );
                                navigate("/dashboard", { replace: true });
                              }, 1500);
                            } catch (err: any) {
                              console.error("Error saving kingdom data:", err);
                              setShowSuccess(false);
                              setError(
                                err.message ||
                                  "Failed to save kingdom information",
                              );
                              setLoading(false);
                            }
                          }, 1500);
                        }, 300);
                      }
                    }}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating Kingdom...
                      </>
                    ) : (
                      <>
                        Begin Your Journey <ChevronRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default KingdomSetup;
