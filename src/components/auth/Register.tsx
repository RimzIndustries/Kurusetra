import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import RaceSelectionDropdown from "../game/RaceSelectionDropdown";
import { Progress } from "../ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { Textarea } from "../ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Crown,
  AlertCircle,
  CheckCircle2,
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
  MapPin,
  Scale,
  ArrowRight,
  Droplet,
  Fish,
  Leaf,
} from "lucide-react";

interface RaceStats {
  strength: number;
  magic: number;
  speed: number;
  defense: number;
  intelligence: number;
}

interface Race {
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  textColor: string;
  buttonColor: string;
  specialty: string;
  startingBonus: string;
  stats: RaceStats;
}

export default function Register() {
  // Account registration states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Kingdom setup states
  const [step, setStep] = useState(1);
  const [setupProgress, setSetupProgress] = useState(25);
  const [selectedRace, setSelectedRace] = useState<string>("");
  const [kingdomName, setKingdomName] = useState("");
  const [kingdomDescription, setKingdomDescription] = useState("");
  const [kingdomMotto, setKingdomMotto] = useState("");
  const [kingdomCapital, setKingdomCapital] = useState("");
  const [selectedZodiac, setSelectedZodiac] = useState<string>("aries");
  const [zodiacOptions] = useState([
    {
      value: "aries",
      label: "Aries",
      description: "The Ram",
      bonus: "+10% Military training speed",
      element: "Fire",
      icon: <Sword className="h-4 w-4" />,
      color: "bg-red-100 border-red-300",
      textColor: "text-red-800"
    },
    {
      value: "taurus",
      label: "Taurus",
      description: "The Bull",
      bonus: "+10% Resource production",
      element: "Earth",
      icon: <Mountain className="h-4 w-4" />,
      color: "bg-green-100 border-green-300",
      textColor: "text-green-800"
    },
    {
      value: "gemini",
      label: "Gemini",
      description: "The Twins",
      bonus: "+10% Research speed",
      element: "Air",
      icon: <Wand className="h-4 w-4" />,
      color: "bg-yellow-100 border-yellow-300",
      textColor: "text-yellow-800"
    },
    {
      value: "cancer",
      label: "Cancer",
      description: "The Crab",
      bonus: "+10% Defense strength",
      element: "Water",
      icon: <Shield className="h-4 w-4" />,
      color: "bg-blue-100 border-blue-300",
      textColor: "text-blue-800"
    },
    {
      value: "leo",
      label: "Leo",
      description: "The Lion",
      bonus: "+10% Attack strength",
      element: "Fire",
      icon: <Crown className="h-4 w-4" />,
      color: "bg-orange-100 border-orange-300",
      textColor: "text-orange-800"
    },
    {
      value: "virgo",
      label: "Virgo",
      description: "The Maiden",
      bonus: "+10% Building speed",
      element: "Earth",
      icon: <Landmark className="h-4 w-4" />,
      color: "bg-emerald-100 border-emerald-300",
      textColor: "text-emerald-800"
    },
    {
      value: "libra",
      label: "Libra",
      description: "The Scales",
      bonus: "+10% Diplomatic influence",
      element: "Air",
      icon: <Scale className="h-4 w-4" />,
      color: "bg-pink-100 border-pink-300",
      textColor: "text-pink-800"
    },
    {
      value: "scorpio",
      label: "Scorpio",
      description: "The Scorpion",
      bonus: "+10% Spy effectiveness",
      element: "Water",
      icon: <Skull className="h-4 w-4" />,
      color: "bg-purple-100 border-purple-300",
      textColor: "text-purple-800"
    },
    {
      value: "sagittarius",
      label: "Sagittarius",
      description: "The Archer",
      bonus: "+10% Ranged attack",
      element: "Fire",
      icon: <ArrowRight className="h-4 w-4" />,
      color: "bg-amber-100 border-amber-300",
      textColor: "text-amber-800"
    },
    {
      value: "capricorn",
      label: "Capricorn",
      description: "The Goat",
      bonus: "+10% Resource capacity",
      element: "Earth",
      icon: <Mountain className="h-4 w-4" />,
      color: "bg-stone-100 border-stone-300",
      textColor: "text-stone-800"
    },
    {
      value: "aquarius",
      label: "Aquarius",
      description: "The Water Bearer",
      bonus: "+10% Magic power",
      element: "Air",
      icon: <Droplet className="h-4 w-4" />,
      color: "bg-cyan-100 border-cyan-300",
      textColor: "text-cyan-800"
    },
    {
      value: "pisces",
      label: "Pisces",
      description: "The Fish",
      bonus: "+10% Healing rate",
      element: "Water",
      icon: <Fish className="h-4 w-4" />,
      color: "bg-indigo-100 border-indigo-300",
      textColor: "text-indigo-800"
    }
  ]);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    kingdomName?: string;
    kingdomDescription?: string;
    kingdomCapital?: string;
    kingdomMotto?: string;
  }>({});

  // Define races object for kingdom setup
  const races: Race[] = [
    {
      name: "Ksatriya",
      description: "Ksatria yang terampil dalam pertempuran jarak dekat",
      icon: <Sword className="w-6 h-6" />,
      color: "bg-red-100",
      textColor: "text-red-800",
      buttonColor: "bg-red-500 hover:bg-red-600",
      specialty: "Pertempuran Jarak Dekat",
      startingBonus: "+5 Strength",
      stats: {
        strength: 8,
        magic: 2,
        speed: 4,
        defense: 6,
        intelligence: 3
      }
    },
    {
      name: "Wanamarta",
      description: "Ahli sihir yang menguasai elemen alam",
      icon: <Wand className="w-6 h-6" />,
      color: "bg-blue-100",
      textColor: "text-blue-800",
      buttonColor: "bg-blue-500 hover:bg-blue-600",
      specialty: "Sihir dan Elemen",
      startingBonus: "+5 Magic",
      stats: {
        strength: 2,
        magic: 8,
        speed: 3,
        defense: 4,
        intelligence: 6
      }
    },
    {
      name: "Wirabumi",
      description: "Penjaga hutan yang terampil dalam bertahan hidup",
      icon: <Leaf className="w-6 h-6" />,
      color: "bg-green-100",
      textColor: "text-green-800",
      buttonColor: "bg-green-500 hover:bg-green-600",
      specialty: "Bertahan Hidup",
      startingBonus: "+5 Defense",
      stats: {
        strength: 4,
        magic: 3,
        speed: 5,
        defense: 8,
        intelligence: 4
      }
    },
    {
      name: "Jatayu",
      description: "Pengembara langit yang cepat dan lincah",
      icon: <Bird className="w-6 h-6" />,
      color: "bg-yellow-100",
      textColor: "text-yellow-800",
      buttonColor: "bg-yellow-500 hover:bg-yellow-600",
      specialty: "Kecepatan dan Kelincahan",
      startingBonus: "+5 Speed",
      stats: {
        strength: 3,
        magic: 4,
        speed: 8,
        defense: 3,
        intelligence: 5
      }
    },
    {
      name: "Kurawa",
      description: "Penguasa kegelapan yang ahli dalam spionase",
      icon: <Droplet className="w-6 h-6" />,
      color: "bg-purple-100",
      textColor: "text-purple-800",
      buttonColor: "bg-purple-500 hover:bg-purple-600",
      specialty: "Spionase dan Intelijen",
      startingBonus: "+25% Spy effectiveness, +15% Enemy detection",
      stats: {
        strength: 3,
        magic: 5,
        speed: 6,
        defense: 4,
        intelligence: 7
      }
    },
    {
      name: "Tibrasara",
      description: "Pemanah legendaris yang ahli dalam pertempuran jarak jauh",
      icon: <Fish className="w-6 h-6" />,
      color: "bg-cyan-100",
      textColor: "text-cyan-800",
      buttonColor: "bg-cyan-500 hover:bg-cyan-600",
      specialty: "Pertempuran Jarak Jauh",
      startingBonus: "+20% Ranged damage, +15% Stealth capability",
      stats: {
        strength: 4,
        magic: 3,
        speed: 7,
        defense: 5,
        intelligence: 6
      }
    },
    {
      name: "Raksasa",
      description: "Ras raksasa yang memiliki kekuatan fisik luar biasa",
      icon: <Sword className="w-6 h-6" />,
      color: "bg-orange-100",
      textColor: "text-orange-800",
      buttonColor: "bg-orange-500 hover:bg-orange-600",
      specialty: "Kekuatan Fisik",
      startingBonus: "+30% Army strength, +20% Enemy morale reduction",
      stats: {
        strength: 9,
        magic: 2,
        speed: 3,
        defense: 7,
        intelligence: 3
      }
    },
    {
      name: "Dedemit",
      description: "Makhluk mistis yang hidup di antara dunia",
      icon: <Wand className="w-6 h-6" />,
      color: "bg-gray-100",
      textColor: "text-gray-800",
      buttonColor: "bg-gray-500 hover:bg-gray-600",
      specialty: "Mistisisme",
      startingBonus: "-25% Food consumption, +20% Army revival rate",
      stats: {
        strength: 2,
        magic: 7,
        speed: 5,
        defense: 4,
        intelligence: 7
      }
    },
  ];

  const { signUp, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  // Get race details based on selected race ID
  const getRaceDetails = (raceId?: string) => {
    // Using the provided raceId or falling back to selectedRace
    const raceToCheck = raceId || selectedRace;

    // Check if the race exists in our races object
    return raceToCheck && races.find(race => race.name === raceToCheck)
      ? races.find(race => race.name === raceToCheck)
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
  const raceDetails = getRaceDetails(selectedRace);

  // Animation variants for step transitions
  const pageVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  // Animation variants for validation
  const validationVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);

    try {
      const { error, data } = await signUp(email, password);
      if (error) throw error;

      // Set registration as complete and handle kingdom setup completion
      if (data?.user?.id) {
        setUserId(data.user.id);
        setRegistrationComplete(true);
        // Show success animation before navigating
        setTimeout(() => {
          setShowSuccess(true);
          setTimeout(async () => {
            try {
              console.log("Saving kingdom setup data to user profile");
              const result = await updateUserProfile({
                race: selectedRace,
                kingdomName: kingdomName.trim(),
                kingdomDescription: kingdomDescription.trim(),
                kingdomMotto: kingdomMotto.trim(),
                kingdomCapital: kingdomCapital.trim(),
                specialty: raceDetails.specialty,
                zodiac: selectedZodiac,
                setupCompleted: true,
              });

              console.log("Kingdom setup complete, profile updated:", result);
              // Navigate after showing success animation
              setTimeout(() => {
                console.log("Redirecting to login after successful setup");
                // Using replace: true prevents the user from going back to the setup page
                navigate("/login", { replace: true });
              }, 500);
            } catch (err: any) {
              console.error("Error saving kingdom information:", err);
              setShowSuccess(false);
              setError(err.message || "Failed to save kingdom information");
              setLoading(false);
            }
          }, 1500);
        }, 300);
      } else {
        // If no user ID is returned, redirect to login
        alert(
          "Registration successful! Please check your email to confirm your account.",
        );
        navigate("/login");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (validateKingdomFields()) {
      setStep(step + 1);
      setSetupProgress(step === 1 ? 50 : step === 2 ? 75 : 100);
      // Scroll to top for better UX
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    setSetupProgress(step === 2 ? 25 : step === 3 ? 50 : 75);
    // Scroll to top for better UX
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle race selection
  const handleRaceSelection = (race: string) => {
    setSelectedRace(race);
    console.log("Selected race:", race);
  };

  // Validate kingdom setup fields
  const validateKingdomFields = () => {
    const errors: any = {};
    let isValid = true;
    setError(null);

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

      if (!selectedRace) {
        setError("Please select a race first");
        isValid = false;
      }
    } else if (step === 2) {
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
    } else if (step === 3) {
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

    setFieldErrors(errors);
    return isValid;
  };

  // Move to account creation step
  const moveToAccountCreation = () => {
    if (!validateKingdomFields()) {
      return;
    }
    setStep(5); // Move to account creation step
    setSetupProgress(100);
    // Scroll to top for better UX
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Function to get step title with icon
  const getStepTitle = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Crown className="h-5 w-5 mr-2" />
            <span>Choose Race & Name</span>
          </>
        );
      case 2:
        return (
          <>
            <Landmark className="h-5 w-5 mr-2" />
            <span>Describe Your Kingdom</span>
          </>
        );
      case 3:
        return (
          <>
            <Flag className="h-5 w-5 mr-2" />
            <span>Capital & Zodiac</span>
          </>
        );
      case 4:
        return (
          <>
            <Check className="h-5 w-5 mr-2" />
            <span>Review & Confirm</span>
          </>
        );
      case 5:
        return "Create Account";
      default:
        return "Kingdom Setup";
    }
  };

  // If registration is complete but we don't have a user ID, redirect to login
  if (registrationComplete && !userId) {
    navigate("/login?registered=true");
    return null;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-background p-4 bg-gradient-to-b from-background to-background/90">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
      >
        {/* Decorative background elements */}
        {selectedRace && (
          <>
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
          </>
        )}

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
                  Your journey in the Kurusetra universe begins now. Welcome,
                  ruler of {kingdomName}!
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="mt-2"
                >
                  <Button
                    variant="outline"
                    className="bg-white/90 hover:bg-white border-green-200 text-green-800 hover:text-green-900 shadow-neuro-flat font-medium"
                    onClick={() => navigate("/profile", { replace: true })}
                  >
                    Enter Your Kingdom
                  </Button>
                </motion.div>

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
          className={`w-full max-w-md shadow-neuro-flat hover:shadow-neuro-convex transition-all duration-300 ${selectedRace ? `border-2 ${raceDetails.color}` : ""}`}
        >
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center">
              {getStepTitle()}
            </CardTitle>
            <CardDescription>
              {step === 1
                ? "Choose your race and name your kingdom"
                : step === 2
                  ? "Tell the story of your kingdom"
                  : step === 3
                    ? "Set your capital, motto, and zodiac sign"
                    : step === 4
                      ? "Review your kingdom details before confirming"
                      : "Create a new account to get started"}
            </CardDescription>

            {/* Progress indicator */}
            <div className="mt-4">
              {/* Enhanced Step indicators */}
              <div className="flex justify-between mt-4 mb-1 relative">
                {/* Connecting line with progress indicator */}
                <div className="absolute top-4 left-4 right-4 h-0.5 bg-muted/50 -z-10"></div>
                <motion.div
                  className={`absolute top-4 left-4 h-0.5 ${selectedRace ? raceDetails.buttonColor.split(" ")[0] : "bg-primary"} -z-10`}
                  initial={{ width: "0%" }}
                  animate={{ width: `${(step - 1) * 25}%` }}
                  transition={{ duration: 0.5 }}
                ></motion.div>

                {[1, 2, 3, 4, 5].map((stepNumber) => (
                  <motion.div
                    key={stepNumber}
                    className="flex flex-col items-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                        step === stepNumber
                          ? selectedRace
                            ? `${raceDetails.color} shadow-neuro-convex border border-neuro-highlight`
                            : "bg-primary/20 shadow-neuro-convex border border-neuro-highlight"
                          : step > stepNumber
                            ? selectedRace
                              ? `${raceDetails.color} shadow-neuro-flat`
                              : "bg-primary/20 shadow-neuro-flat"
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
                        <span className="text-xs font-medium">
                          {stepNumber}
                        </span>
                      )}
                    </motion.div>

                    {/* Enhanced Step label */}
                    <motion.span
                      className={`text-[10px] mt-1 font-medium ${step === stepNumber ? (selectedRace ? raceDetails.textColor : "text-primary") : "text-muted-foreground"}`}
                      animate={{
                        fontWeight: step === stepNumber ? 600 : 400,
                        scale: step === stepNumber ? 1.05 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {stepNumber === 1
                        ? "Race"
                        : stepNumber === 2
                          ? "Story"
                          : stepNumber === 3
                            ? "Details"
                            : stepNumber === 4
                              ? "Review"
                              : "Account"}
                    </motion.span>
                  </motion.div>
                ))}
              </div>
              <Progress
                value={setupProgress}
                className={`h-2 mt-1 ${selectedRace ? raceDetails.color : ""}`}
              />
            </div>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert
                variant="destructive"
                className="mb-4 border border-destructive/20 shadow-neuro-flat"
              >
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Race Selection Section */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2 text-base font-semibold">
                      <Crown className="h-5 w-5" />
                      Choose Your Race
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Select the race that will define your kingdom's strengths and culture
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {races.map((race) => (
                        <motion.div
                          key={race.name}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedRace === race.name ? `${race.color} ${race.textColor} border-2 border-${race.textColor}` : "bg-white border-gray-200"
                          }`}
                          onClick={() => setSelectedRace(race.name)}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {race.icon}
                            <h3 className="font-semibold">{race.name}</h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{race.description}</p>
                          <div className="mb-2">
                            <span className="text-xs font-medium text-gray-500">Specialty:</span>
                            <p className="text-sm">{race.specialty}</p>
                          </div>
                          <div className="mb-2">
                            <span className="text-xs font-medium text-gray-500">Starting Bonus:</span>
                            <p className="text-sm">{race.startingBonus}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="font-medium">Strength:</span>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(race.stats.strength / 5) * 100}%` }}></div>
                              </div>
                            </div>
                            <div>
                              <span className="font-medium">Magic:</span>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${(race.stats.magic / 5) * 100}%` }}></div>
                              </div>
                            </div>
                            <div>
                              <span className="font-medium">Speed:</span>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-green-600 h-2 rounded-full" style={{ width: `${(race.stats.speed / 5) * 100}%` }}></div>
                              </div>
                            </div>
                            <div>
                              <span className="font-medium">Defense:</span>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-red-600 h-2 rounded-full" style={{ width: `${(race.stats.defense / 5) * 100}%` }}></div>
                              </div>
                            </div>
                            <div>
                              <span className="font-medium">Intelligence:</span>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: `${(race.stats.intelligence / 5) * 100}%` }}></div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Kingdom Name Section */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2 text-base font-semibold">
                      <Landmark className="h-5 w-5" />
                      Kingdom Name
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Choose a name that reflects the glory of your {selectedRace ? races.find(race => race.name === selectedRace)?.name : "kingdom's"} civilization
                    </p>
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
                        className={`focus:border-2 focus:ring-0 focus:ring-offset-0 ${fieldErrors.kingdomName ? "border-red-300 shadow-neuro-concave-error" : focusedField === "kingdomName" ? `border-${selectedRace ? races.find(race => race.name === selectedRace)?.textColor : "primary"}-400 shadow-neuro-concave-focus` : "shadow-neuro-concave"} h-12 px-4 transition-all duration-200 text-base`}
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
                  className="space-y-4"
                >
                  <div className="space-y-2">
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
                        placeholder="Tell the story of your kingdom..."
                        value={kingdomDescription}
                        onChange={(e) => setKingdomDescription(e.target.value)}
                        onFocus={() => setFocusedField("kingdomDescription")}
                        onBlur={() => setFocusedField(null)}
                        className={`min-h-[120px] focus:border-2 focus:ring-0 focus:ring-offset-0 ${fieldErrors.kingdomDescription ? "border-red-300 shadow-neuro-concave-error" : focusedField === "kingdomDescription" ? `border-${selectedRace ? races.find(race => race.name === selectedRace)?.textColor : "primary"}-400 shadow-neuro-concave-focus` : "shadow-neuro-concave"} transition-all duration-200`}
                      />

                      {/* Validation icon */}
                      <AnimatePresence>
                        {kingdomDescription.trim().length >= 10 && (
                          <motion.div
                            className="absolute right-3 top-4 text-green-500"
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
                            className="absolute right-3 top-4 text-red-500"
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
                      Share the history and culture of your{" "}
                      {selectedRace ? races.find(race => race.name === selectedRace)?.name : ""} kingdom (optional)
                    </p>

                    {/* Character count */}
                    <div className="flex justify-end mt-1">
                      <span className="text-xs text-muted-foreground">
                        {kingdomDescription.length}/500
                      </span>
                    </div>
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
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <Label
                      htmlFor="kingdomCapital"
                      className="flex items-center gap-2 text-base font-medium"
                    >
                      <MapPin className="h-4 w-4" />
                      Capital City
                    </Label>
                    <div className="relative">
                      <Input
                        id="kingdomCapital"
                        placeholder="Name your capital city"
                        value={kingdomCapital}
                        onChange={(e) => setKingdomCapital(e.target.value)}
                        onFocus={() => setFocusedField("kingdomCapital")}
                        onBlur={() => setFocusedField(null)}
                        maxLength={30}
                        className={`focus:border-2 focus:ring-0 focus:ring-offset-0 ${fieldErrors.kingdomCapital ? "border-red-300 shadow-neuro-concave-error" : focusedField === "kingdomCapital" ? `border-${selectedRace ? races.find(race => race.name === selectedRace)?.textColor : "primary"}-400 shadow-neuro-concave-focus` : "shadow-neuro-concave"} h-11 px-4 transition-all duration-200`}
                      />

                      {/* Validation icon */}
                      <AnimatePresence>
                        {kingdomCapital.trim().length >= 3 &&
                          !fieldErrors.kingdomCapital && (
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

                    <p className="text-xs text-muted-foreground mt-1">
                      Name the heart of your kingdom (optional)
                    </p>
                  </div>

                  <div className="space-y-2 mt-4">
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
                        placeholder="A phrase that defines your kingdom"
                        value={kingdomMotto}
                        onChange={(e) => setKingdomMotto(e.target.value)}
                        onFocus={() => setFocusedField("kingdomMotto")}
                        onBlur={() => setFocusedField(null)}
                        maxLength={50}
                        className={`focus:border-2 focus:ring-0 focus:ring-offset-0 ${fieldErrors.kingdomMotto ? "border-red-300 shadow-neuro-concave-error" : focusedField === "kingdomMotto" ? `border-${selectedRace ? races.find(race => race.name === selectedRace)?.textColor : "primary"}-400 shadow-neuro-concave-focus` : "shadow-neuro-concave"} h-11 px-4 transition-all duration-200`}
                      />

                      {/* Validation icon */}
                      <AnimatePresence>
                        {kingdomMotto.trim().length >= 5 &&
                          !fieldErrors.kingdomMotto && (
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
                      A rallying cry or philosophy for your people (optional)
                    </p>
                  </div>

                  {/* Zodiac Selection Section */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2 text-base font-semibold">
                      <Sparkles className="h-5 w-5" />
                      Zodiac Sign
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Choose your zodiac sign to receive special bonuses
                    </p>
                    
                    <div className="grid grid-cols-3 gap-4">
                      {zodiacOptions.map((zodiac) => (
                        <motion.div
                          key={zodiac.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                            selectedZodiac === zodiac.value
                              ? `${zodiac.color} border-2 ${zodiac.textColor}`
                              : "bg-background/50 border border-border"
                          }`}
                          onClick={() => setSelectedZodiac(zodiac.value)}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`p-2 rounded-full ${zodiac.color}`}>
                              {zodiac.icon}
                            </div>
                            <div>
                              <h3 className="font-semibold">{zodiac.label}</h3>
                              <p className="text-sm text-muted-foreground">{zodiac.description}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Element:</span>
                              <span className="font-medium">{zodiac.element}</span>
                            </div>
                            
                            <div className="flex items-center justify-between text-sm">
                              <span>Bonus:</span>
                              <span className="font-medium">{zodiac.bonus}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
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
                  <div className="bg-accent/30 rounded-lg p-4 shadow-neuro-flat">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      Kingdom Summary
                    </h3>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-md ${raceDetails.color}`}>
                          {raceDetails.icon}
                        </div>
                        <div>
                          <p className="text-sm font-medium">Race</p>
                          <p className="text-base">{raceDetails.name}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-md bg-amber-100">
                          <Crown className="h-4 w-4 text-amber-800" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Kingdom Name</p>
                          <p className="text-base">{kingdomName}</p>
                        </div>
                      </div>

                      {kingdomDescription && (
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-md bg-blue-100">
                            <Landmark className="h-4 w-4 text-blue-800" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Description</p>
                            <p className="text-sm">{kingdomDescription}</p>
                          </div>
                        </div>
                      )}

                      {kingdomCapital && (
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-md bg-green-100">
                            <MapPin className="h-4 w-4 text-green-800" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Capital City</p>
                            <p className="text-base">{kingdomCapital}</p>
                          </div>
                        </div>
                      )}

                      {kingdomMotto && (
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-md bg-purple-100">
                            <Flag className="h-4 w-4 text-purple-800" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Motto</p>
                            <p className="text-base italic">"{kingdomMotto}"</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-md bg-indigo-100">
                          <Sparkles className="h-4 w-4 text-indigo-800" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Specialty</p>
                          <p className="text-base">{raceDetails.specialty}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {raceDetails.startingBonus}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-md bg-violet-100">
                          <Sparkles className="h-4 w-4 text-violet-800" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Zodiac Sign</p>
                          <p className="text-base">
                            {zodiacOptions.find(
                              (z) => z.value === selectedZodiac,
                            )?.label || "Not selected"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {zodiacOptions.find(
                              (z) => z.value === selectedZodiac,
                            )?.description || ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      Ready to begin your journey in the Kurusetra universe?
                    </p>
                  </div>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div
                  key="step5"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={{ duration: 0.3 }}
                >
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="shadow-neuro-concave"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="shadow-neuro-concave"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="shadow-neuro-concave"
                      />
                    </div>
                    <Button
                      type="submit"
                      className={`w-full shadow-neuro-flat hover:shadow-neuro-pressed transition-all duration-200 active:scale-95 ${selectedRace ? races.find(race => race.name === selectedRace)?.textColor : ""}`}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Creating your kingdom...
                        </>
                      ) : (
                        "Create Your Kingdom"
                      )}
                    </Button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
          <CardFooter className="flex justify-between pt-4 mt-2 border-t border-muted">
            {step === 5 ? (
              <div className="w-full flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className={`${selectedRace ? races.find(race => race.name === selectedRace)?.textColor : "text-primary"} hover:underline font-medium`}
                  >
                    Login
                  </Link>
                </p>
              </div>
            ) : (
              <>
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
                    className={`${selectedRace ? races.find(race => race.name === selectedRace)?.buttonColor : "bg-primary hover:bg-primary/90"} shadow-neuro-flat hover:shadow-neuro-pressed flex items-center gap-2 transition-all duration-200 active:scale-95`}
                  >
                    Continue <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : step === 4 ? (
                  <Button
                    type="button"
                    onClick={moveToAccountCreation}
                    className={`${selectedRace ? races.find(race => race.name === selectedRace)?.buttonColor : "bg-primary hover:bg-primary/90"} shadow-neuro-flat hover:shadow-neuro-pressed flex items-center gap-2 transition-all duration-200 active:scale-95`}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Finalize Kingdom Setup{" "}
                        <ChevronRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                ) : null}
              </>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
