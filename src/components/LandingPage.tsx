import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllZodiacPredictions } from '../utils/zodiac';
import { cn } from '../utils/cn';
import LoginMenu from './auth/LoginMenu';
import { NeumorphicCard, NeumorphicButton, NeumorphicContainer, NeumorphicBadge } from '../styles/components';
import { motion, AnimatePresence } from 'framer-motion';
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
  ChevronRight
} from 'lucide-react';

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
    description: "The most intelligent beings who live prosperously in the lowlands.",
    strengths: ["Fast learners", "Efficient in all fields", "Balanced development"],
    image: "/images/races/ksatriya.jpg",
    color: "blue",
    icon: <Sword className="h-6 w-6" />,
    bonuses: {
      military: 15,
      defense: 10,
      production: 20,
      population: 15
    }
  },
  {
    name: "Wanamarta",
    description: "Mystical beings who live in dense forests filled with magical auras.",
    strengths: ["Powerful magic", "Spiritual connection", "Defensive spells"],
    image: "/images/races/wanamarta.jpg",
    color: "green",
    icon: <Shield className="h-6 w-6" />,
    bonuses: {
      military: 10,
      defense: 25,
      production: 15,
      population: 10
    }
  },
  {
    name: "Wirabumi",
    description: "Hard-working beings who live in hidden areas, caves, and underground.",
    strengths: ["Master builders", "Mining expertise", "Resource efficiency"],
    image: "/images/races/wirabumi.jpg",
    color: "brown",
    icon: <Castle className="h-6 w-6" />,
    bonuses: {
      military: 10,
      defense: 15,
      production: 25,
      population: 20
    }
  }
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
      description: "Construct and upgrade buildings to strengthen your empire"
    },
    {
      icon: <Sword className="h-8 w-8" />,
      title: "Command Armies",
      description: "Train and lead powerful military units into battle"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Form Alliances",
      description: "Join forces with other players to dominate the realm"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Manage Resources",
      description: "Balance economy, population, and military might"
    }
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
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Rule Your Kingdom
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Build your empire, command armies, and forge alliances in this epic strategy game.
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
                  <div className="mb-4 p-3 rounded-full bg-primary/10">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              </NeumorphicCard>
            ))}
          </motion.div>
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
              Each race has unique strengths and abilities that will shape your kingdom's destiny.
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
                <NeumorphicCard className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className={`mb-4 p-3 rounded-full bg-${race.color}-500/10`}>
                      {race.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{race.name}</h3>
                    <p className="text-muted-foreground mb-4">{race.description}</p>
                    <div className="flex flex-wrap gap-2 justify-center">
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <NeumorphicCard className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold mb-4">Ready to Begin Your Conquest?</h2>
                <p className="text-muted-foreground mb-6">
                  Join thousands of players in this epic strategy game. Build your empire, command armies, and forge alliances.
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
                  <MapPin className="h-4 w-4 mr-2" />
                  8 Unique Races
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
