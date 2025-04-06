import React from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Building,
  Sword,
  Users,
  Clock,
  ChevronRight,
} from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KingdomOverview from "./game/KingdomOverview";
import ActionPanel from "./game/ActionPanel";
import RaceSelection from "./game/RaceSelection";
import CombatInterface from "./game/CombatInterface";

const Home = () => {
  // Mock state to determine if user is new or returning
  const [isNewPlayer, setIsNewPlayer] = React.useState(false);
  const [showCombatInterface, setShowCombatInterface] = React.useState(false);

  // Mock data for notifications
  const notifications = [
    {
      id: 1,
      type: "building",
      message: "Barracks completed",
      time: "2 minutes ago",
    },
    {
      id: 2,
      type: "combat",
      message: "Your army returned victorious",
      time: "1 hour ago",
    },
    {
      id: 3,
      type: "alliance",
      message: "New message from Dewan Raja",
      time: "3 hours ago",
    },
  ];

  // Handle action selection
  const handleActionSelect = (action: string) => {
    if (action === "combat") {
      setShowCombatInterface(true);
    } else {
      setShowCombatInterface(false);
    }
  };

  // If new player, show race selection
  if (isNewPlayer) {
    return <RaceSelection onComplete={() => setIsNewPlayer(false)} />;
  }

  // If combat interface is active, show it
  if (showCombatInterface) {
    return (
      <div className="bg-background min-h-screen p-6">
        <Button
          variant="outline"
          className="mb-4"
          onClick={() => setShowCombatInterface(false)}
        >
          Back to Kingdom
        </Button>
        <CombatInterface />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <header className="border-b p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Kurusetra</h1>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Users className="mr-2 h-4 w-4" />
              Dewan Raja
            </Button>
            <Button variant="outline" size="sm">
              <Clock className="mr-2 h-4 w-4" />
              Day 127
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <KingdomOverview />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6"
            >
              <ActionPanel onActionSelect={handleActionSelect} />
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Recent kingdom activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-start space-x-3"
                    >
                      {notification.type === "building" && (
                        <Building className="h-5 w-5 text-blue-500" />
                      )}
                      {notification.type === "combat" && (
                        <Sword className="h-5 w-5 text-red-500" />
                      )}
                      {notification.type === "alliance" && (
                        <Shield className="h-5 w-5 text-green-500" />
                      )}
                      <div>
                        <p className="text-sm font-medium">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full">
                  View all activities
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Active Tasks</CardTitle>
                <CardDescription>Time-based activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Building: Archery Range</span>
                      <span>67%</span>
                    </div>
                    <Progress value={67} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Completes in 2h 15m
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Training: Archers</span>
                      <span>34%</span>
                    </div>
                    <Progress value={34} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Completes in 4h 30m
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Research: Advanced Weapons</span>
                      <span>12%</span>
                    </div>
                    <Progress value={12} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Completes in 8h 45m
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Kingdom Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="resources">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                    <TabsTrigger value="military">Military</TabsTrigger>
                    <TabsTrigger value="buildings">Buildings</TabsTrigger>
                  </TabsList>
                  <TabsContent value="resources" className="space-y-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Gold:</span>
                      <span className="text-sm font-medium">12,450</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Food:</span>
                      <span className="text-sm font-medium">8,320</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Production Rate:</span>
                      <span className="text-sm font-medium">+245/hr</span>
                    </div>
                  </TabsContent>
                  <TabsContent value="military" className="space-y-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Infantry:</span>
                      <span className="text-sm font-medium">450</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Archers:</span>
                      <span className="text-sm font-medium">320</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Cavalry:</span>
                      <span className="text-sm font-medium">120</span>
                    </div>
                  </TabsContent>
                  <TabsContent value="buildings" className="space-y-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Barracks:</span>
                      <span className="text-sm font-medium">Level 4</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Farm:</span>
                      <span className="text-sm font-medium">Level 5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Treasury:</span>
                      <span className="text-sm font-medium">Level 3</span>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
