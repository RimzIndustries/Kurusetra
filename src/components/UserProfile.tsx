import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Crown,
  User,
  Mail,
  Shield,
  Calendar,
  MapPin,
  ArrowLeft,
} from "lucide-react";
import { NeumorphicCard, NeumorphicButton, NeumorphicContainer, NeumorphicBadge } from "../styles/components";

const UserProfile = () => {
  const { user, userProfile, signOut } = useAuth();
  const navigate = useNavigate();

  // Get race details based on selected race ID
  const getRaceDetails = () => {
    // This should match the race IDs from RaceSelection component
    const races = {
      ksatriya: {
        name: "Ksatriya",
        description:
          "The most intelligent beings who live prosperously in the lowlands.",
        abilities: [
          "Fast learners",
          "Efficient in all fields of knowledge",
          "Balanced development",
        ],
      },
      wanamarta: {
        name: "Wanamarta",
        description:
          "Mystical beings who live in dense forests filled with magical auras.",
        abilities: [
          "Powerful magic",
          "Spiritual connection",
          "Defensive spells",
        ],
      },
      wirabumi: {
        name: "Wirabumi",
        description:
          "Hard-working beings who live in hidden areas, caves, and underground.",
        abilities: [
          "Master builders",
          "Mining expertise",
          "Resource efficiency",
        ],
      },
      jatayu: {
        name: "Jatayu",
        description:
          "Flying beings who live in highlands with incredible attack capabilities.",
        abilities: ["Flight", "Rapid attacks", "Superior mobility"],
      },
      kurawa: {
        name: "Kurawa",
        description:
          "The most cunning lowland beings, masters of secret operations.",
        abilities: ["Espionage", "Sabotage", "Deception"],
      },
      tibrasara: {
        name: "Tibrasara",
        description:
          "Mysterious beings who live in dark forests with unparalleled archery skills.",
        abilities: ["Master archers", "Stealth", "Defensive prowess"],
      },
      raksasa: {
        name: "Raksasa",
        description:
          "Enormous and terrifying beings who inhabit steep rocky hills.",
        abilities: ["Immense strength", "Powerful armies", "Intimidation"],
      },
      dedemit: {
        name: "Dedemit",
        description:
          "Spectral beings who exist in the realm of wandering spirits.",
        abilities: [
          "Immortal armies",
          "No food requirement",
          "Supernatural resilience",
        ],
      },
    };

    return userProfile.race && races[userProfile.race as keyof typeof races]
      ? races[userProfile.race as keyof typeof races]
      : { name: "Unknown", description: "No race selected.", abilities: [] };
  };

  const raceDetails = getRaceDetails();

  // Mock data for kingdom stats
  const kingdomStats = {
    founded: "Day 1",
    currentDay: "Day 127",
    resources: {
      gold: 12450,
      food: 8320,
    },
    military: {
      infantry: 450,
      archers: 320,
      cavalry: 120,
    },
    buildings: {
      barracks: 4,
      farm: 5,
      treasury: 3,
    },
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <NeumorphicContainer className="container mx-auto py-8 px-4">
      <NeumorphicButton onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </NeumorphicButton>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <NeumorphicCard>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">User Profile</h2>
              <p className="text-gray-500 mb-4">Your account information</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">Email</span>
                  </div>
                  <span className="font-medium">{user?.email}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      <Crown className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">Kingdom</span>
                  </div>
                  <span className="font-medium">
                    {userProfile.kingdomName || "No Kingdom"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">Race</span>
                  </div>
                  <span className="font-medium">{raceDetails.name}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">Current Day</span>
                  </div>
                  <span className="font-medium">{kingdomStats.currentDay}</span>
                </div>

                {userProfile.zodiac && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        <Mail className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium">Zodiac</span>
                    </div>
                    <span className="font-medium">{userProfile.zodiac}</span>
                  </div>
                )}

                {userProfile.specialty && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        <MapPin className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium">Specialty</span>
                    </div>
                    <span className="font-medium">{userProfile.specialty}</span>
                  </div>
                )}
              </div>
            </div>
          </NeumorphicCard>
        </div>

        <div className="lg:col-span-2">
          <NeumorphicCard>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Kingdom Stats</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Resources</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Gold</span>
                      <NeumorphicBadge type="success">
                        {kingdomStats.resources.gold}
                      </NeumorphicBadge>
                    </div>
                    <div className="flex justify-between">
                      <span>Food</span>
                      <NeumorphicBadge type="success">
                        {kingdomStats.resources.food}
                      </NeumorphicBadge>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Military</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Infantry</span>
                      <NeumorphicBadge type="warning">
                        {kingdomStats.military.infantry}
                      </NeumorphicBadge>
                    </div>
                    <div className="flex justify-between">
                      <span>Archers</span>
                      <NeumorphicBadge type="warning">
                        {kingdomStats.military.archers}
                      </NeumorphicBadge>
                    </div>
                    <div className="flex justify-between">
                      <span>Cavalry</span>
                      <NeumorphicBadge type="warning">
                        {kingdomStats.military.cavalry}
                      </NeumorphicBadge>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Buildings</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Barracks</span>
                      <NeumorphicBadge type="info">
                        {kingdomStats.buildings.barracks}
                      </NeumorphicBadge>
                    </div>
                    <div className="flex justify-between">
                      <span>Farms</span>
                      <NeumorphicBadge type="info">
                        {kingdomStats.buildings.farm}
                      </NeumorphicBadge>
                    </div>
                    <div className="flex justify-between">
                      <span>Treasury</span>
                      <NeumorphicBadge type="info">
                        {kingdomStats.buildings.treasury}
                      </NeumorphicBadge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </NeumorphicCard>

          <div className="mt-6">
            <NeumorphicButton onClick={handleSignOut} className="w-full">
              Sign Out
            </NeumorphicButton>
          </div>
        </div>
      </div>
    </NeumorphicContainer>
  );
};

export default UserProfile;
