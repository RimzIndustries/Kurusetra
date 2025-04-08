import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import {
  MapPin,
  Flag,
  Castle,
  Mountain,
  Trees,
  Compass,
  Shield,
  Sword,
  Users,
  Eye,
  Crosshair,
} from "lucide-react";

const GameMap = () => {
  const { userProfile } = useAuth();
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [mapView, setMapView] = useState("political");

  // Mock map data
  const regions = [
    {
      id: "r1",
      name: "Northern Plains",
      type: "plains",
      owner: "Pandawa",
      resources: ["gold", "food"],
      x: 20,
      y: 15,
      size: 12,
    },
    {
      id: "r2",
      name: "Eastern Mountains",
      type: "mountains",
      owner: "Kurawa",
      resources: ["stone", "iron"],
      x: 70,
      y: 30,
      size: 15,
    },
    {
      id: "r3",
      name: "Western Forest",
      type: "forest",
      owner: "Neutral",
      resources: ["wood", "herbs"],
      x: 25,
      y: 60,
      size: 14,
    },
    {
      id: "r4",
      name: "Southern Valley",
      type: "valley",
      owner: "Jatayu",
      resources: ["food", "water"],
      x: 60,
      y: 75,
      size: 13,
    },
    {
      id: "r5",
      name: "Central Highlands",
      type: "highlands",
      owner: userProfile.kingdomName || "Your Kingdom",
      resources: ["gold", "stone"],
      x: 50,
      y: 45,
      size: 16,
    },
  ];

  // Get region details
  const getRegionDetails = (regionId: string) => {
    return regions.find((r) => r.id === regionId);
  };

  // Get region color based on owner or type
  const getRegionColor = (region: any) => {
    if (mapView === "political") {
      if (region.owner === (userProfile.kingdomName || "Your Kingdom")) {
        return "bg-blue-500";
      } else if (region.owner === "Neutral") {
        return "bg-gray-400";
      } else if (region.owner === "Pandawa") {
        return "bg-green-500";
      } else if (region.owner === "Kurawa") {
        return "bg-red-500";
      } else if (region.owner === "Jatayu") {
        return "bg-purple-500";
      }
      return "bg-amber-500";
    } else {
      // Terrain view
      if (region.type === "plains") {
        return "bg-green-300";
      } else if (region.type === "mountains") {
        return "bg-stone-500";
      } else if (region.type === "forest") {
        return "bg-emerald-600";
      } else if (region.type === "valley") {
        return "bg-amber-300";
      } else if (region.type === "highlands") {
        return "bg-stone-400";
      }
      return "bg-gray-400";
    }
  };

  // Get region icon based on type
  const getRegionIcon = (region: any) => {
    if (region.type === "plains") {
      return <Flag className="h-4 w-4" />;
    } else if (region.type === "mountains") {
      return <Mountain className="h-4 w-4" />;
    } else if (region.type === "forest") {
      return <Trees className="h-4 w-4" />;
    } else if (region.type === "valley") {
      return <MapPin className="h-4 w-4" />;
    } else if (region.type === "highlands") {
      return <Castle className="h-4 w-4" />;
    }
    return <MapPin className="h-4 w-4" />;
  };

  return (
    <div className="bg-background min-h-screen p-6 bg-gradient-to-b from-background to-background/95">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-primary/10 rounded-full">
            <Compass className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent">
              Kurusetra World Map
            </h1>
            <p className="text-muted-foreground mt-1">
              Explore territories, plan conquests, and expand your kingdom
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map view */}
          <div className="lg:col-span-3">
            <Card className="bg-neuro-bg shadow-neuro-flat hover:shadow-neuro-convex transition-all duration-300 neuro-glow h-[600px] relative overflow-hidden">
              <CardHeader className="pb-2 z-10">
                <div className="flex justify-between items-center">
                  <CardTitle>World Map</CardTitle>
                  <Tabs value={mapView} onValueChange={setMapView}>
                    <TabsList>
                      <TabsTrigger value="political">Political</TabsTrigger>
                      <TabsTrigger value="terrain">Terrain</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent className="relative h-full p-0">
                {/* Map background */}
                <div className="absolute inset-0 bg-blue-100/30 p-4">
                  {/* Map grid lines */}
                  <div className="absolute inset-0 grid grid-cols-10 grid-rows-10">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <React.Fragment key={`grid-col-${i}`}>
                        <div
                          className="border-r border-blue-200/50 h-full"
                          style={{ left: `${i * 10}%` }}
                        />
                        <div
                          className="border-b border-blue-200/50 w-full"
                          style={{ top: `${i * 10}%` }}
                        />
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Map regions */}
                  {regions.map((region) => (
                    <motion.div
                      key={region.id}
                      className={`absolute rounded-full cursor-pointer flex items-center justify-center ${getRegionColor(region)} shadow-md border-2 border-white/30`}
                      style={{
                        left: `${region.x}%`,
                        top: `${region.y}%`,
                        width: `${region.size}%`,
                        height: `${region.size}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setSelectedRegion(region.id)}
                      animate={{
                        boxShadow:
                          selectedRegion === region.id
                            ? "0 0 0 4px rgba(255,255,255,0.5), 0 0 20px rgba(0,0,0,0.3)"
                            : "0 4px 6px rgba(0,0,0,0.1)",
                      }}
                    >
                      {getRegionIcon(region)}
                    </motion.div>
                  ))}

                  {/* Compass rose */}
                  <div className="absolute bottom-4 right-4 text-primary/70">
                    <Compass className="h-12 w-12" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Region details */}
          <div className="lg:col-span-1">
            <Card className="bg-neuro-bg shadow-neuro-flat hover:shadow-neuro-convex transition-all duration-300 neuro-glow">
              <CardHeader className="pb-2">
                <CardTitle>
                  {selectedRegion
                    ? getRegionDetails(selectedRegion)?.name
                    : "Select a Region"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedRegion ? (
                  <div className="space-y-4">
                    {(() => {
                      const region = getRegionDetails(selectedRegion);
                      if (!region) return null;

                      return (
                        <>
                          <div className="flex justify-between items-center">
                            <Badge
                              className={`${getRegionColor(region)} text-white`}
                            >
                              {region.type.charAt(0).toUpperCase() +
                                region.type.slice(1)}
                            </Badge>
                            <Badge variant="outline">{region.owner}</Badge>
                          </div>

                          <div className="space-y-2">
                            <p className="text-sm font-medium">Resources:</p>
                            <div className="flex gap-2">
                              {region.resources.map((resource) => (
                                <Badge key={resource} variant="secondary">
                                  {resource.charAt(0).toUpperCase() +
                                    resource.slice(1)}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="pt-4 space-y-2">
                            {region.owner ===
                            (userProfile.kingdomName || "Your Kingdom") ? (
                              <>
                                <Button className="w-full" variant="outline">
                                  <Castle className="h-4 w-4 mr-2" /> Manage
                                  Region
                                </Button>
                                <Button className="w-full" variant="outline">
                                  <Shield className="h-4 w-4 mr-2" /> Fortify
                                  Defenses
                                </Button>
                              </>
                            ) : region.owner === "Neutral" ? (
                              <>
                                <Button className="w-full">
                                  <Flag className="h-4 w-4 mr-2" /> Colonize
                                  Region
                                </Button>
                                <Button className="w-full" variant="outline">
                                  <Eye className="h-4 w-4 mr-2" /> Scout Area
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button className="w-full bg-red-600 hover:bg-red-700">
                                  <Sword className="h-4 w-4 mr-2" /> Attack
                                  Region
                                </Button>
                                <Button className="w-full" variant="outline">
                                  <Eye className="h-4 w-4 mr-2" /> Spy on Region
                                </Button>
                                <Button className="w-full" variant="outline">
                                  <Users className="h-4 w-4 mr-2" /> Diplomatic
                                  Options
                                </Button>
                              </>
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Crosshair className="h-12 w-12 mb-4 opacity-50" />
                    <p>Select a region on the map to view details</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Legend */}
            <Card className="mt-4 bg-neuro-bg shadow-neuro-flat hover:shadow-neuro-convex transition-all duration-300 neuro-glow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Map Legend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {mapView === "political" ? (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                        <span>Your Territory</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-green-500"></div>
                        <span>Pandawa Alliance</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-red-500"></div>
                        <span>Kurawa Alliance</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                        <span>Jatayu Alliance</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                        <span>Neutral Territory</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-green-300"></div>
                        <span>Plains</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-stone-500"></div>
                        <span>Mountains</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-emerald-600"></div>
                        <span>Forest</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-amber-300"></div>
                        <span>Valley</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-stone-400"></div>
                        <span>Highlands</span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GameMap;
