import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Crown,
  User,
  Mail,
  Shield,
  Calendar,
  MapPin,
  ArrowLeft,
} from "lucide-react";

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
    <div className="container mx-auto py-8 px-4">
      <Button variant="outline" className="mb-6" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="py-3 pr-4">
                        <div className="flex items-center">
                          <div className="bg-primary/10 p-2 rounded-full mr-3">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-sm font-medium">Email</span>
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <span className="font-medium">{user?.email}</span>
                      </td>
                    </tr>

                    <tr className="border-b border-border">
                      <td className="py-3 pr-4">
                        <div className="flex items-center">
                          <div className="bg-primary/10 p-2 rounded-full mr-3">
                            <Crown className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-sm font-medium">Kingdom</span>
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <span className="font-medium">
                          {userProfile.kingdomName || "No Kingdom"}
                        </span>
                      </td>
                    </tr>

                    <tr className="border-b border-border">
                      <td className="py-3 pr-4">
                        <div className="flex items-center">
                          <div className="bg-primary/10 p-2 rounded-full mr-3">
                            <Shield className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-sm font-medium">Race</span>
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <span className="font-medium">{raceDetails.name}</span>
                      </td>
                    </tr>

                    <tr className="border-b border-border">
                      <td className="py-3 pr-4">
                        <div className="flex items-center">
                          <div className="bg-primary/10 p-2 rounded-full mr-3">
                            <Calendar className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-sm font-medium">
                            Current Day
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <span className="font-medium">
                          {kingdomStats.currentDay}
                        </span>
                      </td>
                    </tr>

                    {userProfile.zodiac && (
                      <tr className="border-b border-border">
                        <td className="py-3 pr-4">
                          <div className="flex items-center">
                            <div className="bg-primary/10 p-2 rounded-full mr-3">
                              <Mail className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-sm font-medium">Zodiac</span>
                          </div>
                        </td>
                        <td className="py-3 text-right">
                          <span className="font-medium">
                            {userProfile.zodiac}
                          </span>
                        </td>
                      </tr>
                    )}

                    {userProfile.specialty && (
                      <tr className="border-b border-border">
                        <td className="py-3 pr-4">
                          <div className="flex items-center">
                            <div className="bg-primary/10 p-2 rounded-full mr-3">
                              <MapPin className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-sm font-medium">
                              Specialty
                            </span>
                          </div>
                        </td>
                        <td className="py-3 text-right">
                          <span className="font-medium">
                            {userProfile.specialty}
                          </span>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Kingdom Information</CardTitle>
              <CardDescription>
                Details about your {userProfile.kingdomName} kingdom
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {raceDetails.name} Race
                </h3>
                <p className="mb-3">{raceDetails.description}</p>
                <div className="flex flex-wrap gap-2">
                  {raceDetails.abilities.map((ability, index) => (
                    <Badge key={index} variant="secondary">
                      {ability}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Resources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Gold:</span>
                        <span className="text-sm font-medium">
                          {kingdomStats.resources.gold}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Food:</span>
                        <span className="text-sm font-medium">
                          {kingdomStats.resources.food}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Military</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Infantry:</span>
                        <span className="text-sm font-medium">
                          {kingdomStats.military.infantry}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Archers:</span>
                        <span className="text-sm font-medium">
                          {kingdomStats.military.archers}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Cavalry:</span>
                        <span className="text-sm font-medium">
                          {kingdomStats.military.cavalry}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Buildings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Barracks:</span>
                        <span className="text-sm font-medium">
                          Level {kingdomStats.buildings.barracks}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Farm:</span>
                        <span className="text-sm font-medium">
                          Level {kingdomStats.buildings.farm}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Treasury:</span>
                        <span className="text-sm font-medium">
                          Level {kingdomStats.buildings.treasury}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
