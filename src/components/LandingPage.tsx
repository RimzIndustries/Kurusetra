import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import {
  Crown,
  Wand,
  Mountain,
  Bird,
  Skull,
  Shield,
  Sword,
  Ghost,
  Sparkles,
} from "lucide-react";

export default function LandingPage() {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if user is logged in and has completed setup
  useEffect(() => {
    if (user && userProfile?.setupCompleted) {
      navigate("/dashboard");
    }
  }, [user, userProfile, navigate]);

  // Race information from Register component
  const races = {
    ksatriya: {
      name: "Ksatriya",
      description:
        "The most intelligent beings who live prosperously in the lowlands. They are the most stable race in the Kurusetra universe.",
      icon: <Crown className="h-6 w-6" />,
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
      icon: <Wand className="h-6 w-6" />,
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
      icon: <Mountain className="h-6 w-6" />,
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
      icon: <Bird className="h-6 w-6" />,
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
      icon: <Skull className="h-6 w-6" />,
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
      icon: <Shield className="h-6 w-6" />,
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
      icon: <Sword className="h-6 w-6" />,
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
      icon: <Ghost className="h-6 w-6" />,
      color: "bg-slate-100 border-slate-300",
      textColor: "text-slate-800",
      buttonColor: "bg-slate-600 hover:bg-slate-700",
      specialty: "Immortality and Spirit Magic",
      startingBonus: "-25% Food consumption, +20% Army revival rate",
    },
  };

  return (
    <div className="min-h-screen bg-neuro-bg p-6 flex flex-col items-center">
      <div className="max-w-6xl w-full mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12 mt-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 header-gradient">
            Welcome to Kurusetra
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose your race, build your kingdom, and conquer the realm in this
            epic strategy game set in a mystical universe.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Button
              size="lg"
              className="shadow-neuro-flat hover:shadow-neuro-pressed transition-all duration-200"
              onClick={() => navigate("/register")}
            >
              Create Your Kingdom
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="shadow-neuro-flat hover:shadow-neuro-pressed transition-all duration-200"
              onClick={() => navigate("/login")}
            >
              Login to Your Kingdom
            </Button>
          </div>
        </div>

        {/* Races Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">
            <span className="flex items-center justify-center gap-2">
              <Crown className="h-6 w-6" />
              <span>Choose Your Race</span>
            </span>
          </h2>
          <p className="text-center text-muted-foreground mb-8 max-w-3xl mx-auto">
            Each race in Kurusetra has unique abilities, strengths, and cultural
            traits that will shape your kingdom's destiny.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(races).map(([id, race]) => (
              <Card
                key={id}
                className={`shadow-neuro-flat hover:shadow-neuro-convex transition-all duration-300 border-2 ${race.color} card-hover-effect`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-md ${race.color}`}>
                      {race.icon}
                    </div>
                    <CardTitle className={race.textColor}>
                      {race.name}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-3">{race.description}</p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      <span className="font-semibold">Specialty:</span>{" "}
                      {race.specialty}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Starting Bonus:</span>{" "}
                      {race.startingBonus}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Zodiac Section Placeholder - Will be implemented in next phase */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">
            <span className="flex items-center justify-center gap-2">
              <Sparkles className="h-6 w-6" />
              <span>Zodiac Signs</span>
            </span>
          </h2>
          <p className="text-center text-muted-foreground mb-8 max-w-3xl mx-auto">
            Your zodiac sign provides special bonuses to your kingdom. Choose
            wisely to complement your race's natural abilities.
          </p>

          {/* Zodiac cards will be added in the next implementation */}
          <div className="text-center p-8 bg-accent/20 rounded-xl shadow-neuro-flat">
            <p>Zodiac sign information coming soon...</p>
          </div>
        </section>
      </div>
    </div>
  );
}
