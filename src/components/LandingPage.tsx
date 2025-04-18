import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllZodiacPredictions } from "../utils/zodiac";
import { cn } from "../utils/cn";
import LoginMenu from "./auth/LoginMenu";
import {
  NeumorphicCard,
  NeumorphicButton,
  NeumorphicContainer,
  NeumorphicBadge,
} from "../styles/components";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown,
  Sword,
  Shield,
  Castle,
  Users,
  ArrowRight,
  Star,
  Zap,
  MapPin,
  Check,
  Info,
  ChevronRight,
  Calendar,
  Sparkles,
} from "lucide-react";

type Race = {
  name: string;
  description: string;
  strengths: string[];
  image: string;
  color: string;
  icon: React.ReactNode;
  bonuses: {
    military: number;
    defense: number;
    production: number;
    population: number;
  };
};

const races: Race[] = [
  {
    name: "Ksatriya",
    description:
      "The most intelligent beings who live prosperously in the lowlands.",
    strengths: [
      "Fast learners",
      "Efficient in all fields",
      "Balanced development",
    ],
    image:
      "https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=800&q=80",
    color: "blue",
    icon: <Sword className="h-6 w-6" />,
    bonuses: {
      military: 15,
      defense: 10,
      production: 20,
      population: 15,
    },
  },
  {
    name: "Wanamarta",
    description:
      "Mystical beings who live in dense forests filled with magical auras.",
    strengths: ["Powerful magic", "Spiritual connection", "Defensive spells"],
    image:
      "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=800&q=80",
    color: "green",
    icon: <Shield className="h-6 w-6" />,
    bonuses: {
      military: 10,
      defense: 25,
      production: 15,
      population: 10,
    },
  },
  {
    name: "Wirabumi",
    description:
      "Hard-working beings who live in hidden areas, caves, and underground.",
    strengths: ["Master builders", "Mining expertise", "Resource efficiency"],
    image:
      "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=800&q=80",
    color: "brown",
    icon: <Castle className="h-6 w-6" />,
    bonuses: {
      military: 10,
      defense: 15,
      production: 25,
      population: 20,
    },
  },
];

const LandingPage = () => {
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const [zodiacPredictions, setZodiacPredictions] = useState<any>(null);
  const [selectedZodiac, setSelectedZodiac] = useState<string | null>(null);
  const [showLoginMenu, setShowLoginMenu] = useState(false);
  const [hoveredRace, setHoveredRace] = useState<Race | null>(null);

  const features = [
    {
      icon: <Castle className="h-8 w-8" />,
      title: "Build Your Kingdom",
      description: "Construct and upgrade buildings to strengthen your empire",
    },
    {
      icon: <Sword className="h-8 w-8" />,
      title: "Command Armies",
      description: "Train and lead powerful military units into battle",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Form Alliances",
      description: "Join forces with other players to dominate the realm",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Manage Resources",
      description: "Balance economy, population, and military might",
    },
  ];

  const gameSystems = [
    {
      icon: <Castle className="h-6 w-6" />,
      title: "Building System",
      description:
        "Construct various buildings to enhance your kingdom's capabilities and resource production.",
    },
    {
      icon: <Sword className="h-6 w-6" />,
      title: "Combat System",
      description:
        "Engage in strategic battles with other kingdoms using different unit types and formations.",
    },
    {
      icon: <Crown className="h-6 w-6" />,
      title: "Dewan Raja",
      description:
        "Participate in the council of kings to influence realm-wide policies and decisions.",
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "World Map",
      description:
        "Explore the vast world map, discover resources, and plan your territorial expansion.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Alliance System",
      description:
        "Form powerful alliances with other players to gain strategic advantages and protection.",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Resource Management",
      description:
        "Gather and allocate resources efficiently to fuel your kingdom's growth and military might.",
    },
  ];

  useEffect(() => {
    const predictions = getAllZodiacPredictions();
    setZodiacPredictions(predictions);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <NeumorphicBadge type="info" className="mb-4">
              <Star className="h-4 w-4 mr-2" />
              New Season Available
            </NeumorphicBadge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary/80 via-amber-500 to-primary animate-gradient">
              Rule Your Kingdom
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Build your empire, command armies, and forge alliances in this
              epic strategy game.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <NeumorphicButton className="px-8 py-3">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-4 w-4" />
                </NeumorphicButton>
              </Link>
              <Link to="/login">
                <NeumorphicButton className="px-8 py-3">
                  Continue Your Legacy
                </NeumorphicButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <NeumorphicCard key={index} className="p-6">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="mb-4 p-3 rounded-full bg-primary/10 shadow-neuro-concave">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              </NeumorphicCard>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Zodiac Predictions Section */}
      <section className="py-16 bg-muted/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">
              Daily Zodiac Predictions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The stars influence your kingdom's fortune. Check your daily
              prediction to optimize your strategy.
            </p>
          </motion.div>

          {zodiacPredictions && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(zodiacPredictions)
                .slice(0, 4)
                .map(([key, zodiac]: [string, any]) => (
                  <motion.div
                    key={key}
                    whileHover={{ scale: 1.02 }}
                    className="cursor-pointer"
                    onClick={() => setSelectedZodiac(key)}
                  >
                    <NeumorphicCard className="p-6 h-full">
                      <div className="flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 rounded-full bg-primary/10 shadow-neuro-concave">
                            <Calendar className="h-5 w-5" />
                          </div>
                          <h3 className="text-lg font-semibold">
                            {zodiac.name}
                          </h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {zodiac.period}
                        </p>
                        <div className="bg-muted/10 p-3 rounded-lg shadow-neuro-concave mb-3">
                          <p className="text-sm">
                            <span className="font-medium">Today's Luck:</span>{" "}
                            {zodiac.luck.substring(0, 60)}...
                          </p>
                        </div>
                        <div className="mt-auto flex justify-between items-center">
                          <NeumorphicBadge type="info">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Win: {zodiac.winChance}%
                          </NeumorphicBadge>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </NeumorphicCard>
                  </motion.div>
                ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link to="/zodiac">
              <NeumorphicButton className="px-6 py-2">
                View All Zodiac Signs
                <ChevronRight className="ml-2 h-4 w-4" />
              </NeumorphicButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Race Preview Section */}
      <section className="py-16 bg-muted/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Choose Your Race</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Each race has unique strengths and abilities that will shape your
              kingdom's destiny.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {races.map((race) => (
              <motion.div
                key={race.name}
                whileHover={{ scale: 1.02 }}
                onHoverStart={() => setHoveredRace(race)}
                onHoverEnd={() => setHoveredRace(null)}
              >
                <NeumorphicCard className="p-6 h-full">
                  <div className="flex flex-col items-center text-center h-full">
                    <div className="w-full h-40 mb-6 rounded-lg overflow-hidden shadow-neuro-flat">
                      <img
                        src={race.image}
                        alt={race.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div
                      className={`mb-4 p-3 rounded-full bg-${race.color}-500/10 shadow-neuro-concave`}
                    >
                      {race.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{race.name}</h3>
                    <p className="text-muted-foreground mb-4">
                      {race.description}
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center mt-auto">
                      {race.strengths.map((strength, index) => (
                        <NeumorphicBadge key={index} type="info">
                          <Check className="h-3 w-3 mr-1" />
                          {strength}
                        </NeumorphicBadge>
                      ))}
                    </div>
                  </div>
                </NeumorphicCard>
              </motion.div>
            ))}
          </div>

          <AnimatePresence>
            {hoveredRace && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-8"
              >
                <NeumorphicCard className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Sword className="h-4 w-4" />
                      <span>Military +{hoveredRace.bonuses.military}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span>Defense +{hoveredRace.bonuses.defense}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Castle className="h-4 w-4" />
                      <span>Production +{hoveredRace.bonuses.production}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Population +{hoveredRace.bonuses.population}%</span>
                    </div>
                  </div>
                </NeumorphicCard>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="text-center mt-8">
            <Link to="/register">
              <NeumorphicButton className="px-6 py-2">
                Create Your Kingdom
                <ArrowRight className="ml-2 h-4 w-4" />
              </NeumorphicButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Game Systems Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Game Systems</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore the various systems that make up the gameplay experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gameSystems.map((system, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="cursor-pointer"
              >
                <NeumorphicCard className="p-6 h-full">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-primary/10 shadow-neuro-concave">
                      {system.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        {system.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {system.description}
                      </p>
                    </div>
                  </div>
                </NeumorphicCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <NeumorphicCard className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold mb-4">
                  Ready to Begin Your Conquest?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Join thousands of players in this epic strategy game. Build
                  your empire, command armies, and forge alliances.
                </p>
                <Link to="/register">
                  <NeumorphicButton className="px-8 py-3">
                    Start Playing Now
                    <Zap className="ml-2 h-4 w-4" />
                  </NeumorphicButton>
                </Link>
              </div>
              <div className="flex flex-col gap-4">
                <NeumorphicBadge type="success">
                  <Users className="h-4 w-4 mr-2" />
                  10,000+ Players
                </NeumorphicBadge>
                <NeumorphicBadge type="info">
                  <Crown className="h-4 w-4 mr-2" />
                  500+ Kingdoms
                </NeumorphicBadge>
                <NeumorphicBadge type="info">
                  <MapPin className="h-4 w-4 mr-2" />8 Unique Races
                </NeumorphicBadge>
              </div>
            </div>
          </NeumorphicCard>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
