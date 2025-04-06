import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Building, Sword, Coins, Users, Shield, Castle } from "lucide-react";

interface ActionPanelProps {
  onActionSelect?: (
    action: "resources" | "building" | "military" | "alliance" | "combat",
  ) => void;
}

const ActionPanel = ({ onActionSelect = () => {} }: ActionPanelProps) => {
  const actions = [
    {
      id: "resources",
      name: "Resource Management",
      description: "Manage your kingdom's gold, food, and production",
      icon: <Coins className="h-6 w-6" />,
      color: "bg-amber-100 hover:bg-amber-200",
      path: "/resources",
    },
    {
      id: "building",
      name: "Building",
      description: "Construct and upgrade buildings in your kingdom",
      icon: <Building className="h-6 w-6" />,
      color: "bg-emerald-100 hover:bg-emerald-200",
      path: "/building",
    },
    {
      id: "military",
      name: "Military",
      description: "Train and manage your army",
      icon: <Sword className="h-6 w-6" />,
      color: "bg-red-100 hover:bg-red-200",
      path: "/military",
    },
    {
      id: "alliance",
      name: "Dewan Raja",
      description: "Communicate with your alliance members",
      icon: <Users className="h-6 w-6" />,
      color: "bg-blue-100 hover:bg-blue-200",
      path: "/alliance",
    },
    {
      id: "combat",
      name: "Combat",
      description: "Plan attacks and espionage missions",
      icon: <Shield className="h-6 w-6" />,
      color: "bg-purple-100 hover:bg-purple-200",
      path: "/combat",
    },
    {
      id: "kingdom",
      name: "Kingdom Overview",
      description: "View your kingdom's overall status and progress",
      icon: <Castle className="h-6 w-6" />,
      color: "bg-indigo-100 hover:bg-indigo-200",
      path: "/kingdom",
    },
  ];

  return (
    <Card className="w-full bg-background shadow-md">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <TooltipProvider>
            {actions.map((action) => (
              <Tooltip key={action.id}>
                <TooltipTrigger asChild>
                  <Link to={action.path} className="w-full">
                    <Button
                      variant="outline"
                      className={`h-24 w-full flex flex-col items-center justify-center gap-2 ${action.color} border-2`}
                      onClick={() => onActionSelect(action.id as any)}
                    >
                      {action.icon}
                      <span className="font-medium">{action.name}</span>
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{action.description}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActionPanel;
