import { useState } from "react";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  Crown,
  Wand,
  Mountain,
  Bird,
  Skull,
  Shield,
  Sword,
  Ghost,
  Info,
  MapPin,
} from "lucide-react";

interface RaceSelectionDropdownProps {
  onSelectRace: (race: string) => void;
  selectedRace?: string;
}

export default function RaceSelectionDropdown({
  onSelectRace,
  selectedRace,
}: RaceSelectionDropdownProps) {
  // Define races object for kingdom setup
  const races = {
    ksatriya: {
      name: "Ksatriya",
      description:
        "The most intelligent beings who live prosperously in the lowlands. They are the most stable race in the Kurusetra universe.",
      icon: <Crown className="h-4 w-4" />,
      specialty: "Diplomacy and Trade",
      startingBonus: "+15% Gold production, +10% Diplomatic influence",
    },
    wanamarta: {
      name: "Wanamarta",
      description:
        "Mystical beings who live in dense forests filled with magical auras. They possess extraordinary magical abilities.",
      icon: <Wand className="h-4 w-4" />,
      specialty: "Magic and Research",
      startingBonus: "+20% Magic power, +15% Research speed",
    },
    wirabumi: {
      name: "Wirabumi",
      description:
        "Hard-working beings who live in hidden areas, caves, and underground. Known for their industrious nature.",
      icon: <Mountain className="h-4 w-4" />,
      specialty: "Mining and Construction",
      startingBonus: "+25% Resource gathering, +15% Building speed",
    },
    jatayu: {
      name: "Jatayu",
      description:
        "Flying beings who live in highlands. They possess incredible aggressive attack capabilities and unmatched speed.",
      icon: <Bird className="h-4 w-4" />,
      specialty: "Speed and Reconnaissance",
      startingBonus: "+30% Movement speed, +20% Vision range",
    },
    kurawa: {
      name: "Kurawa",
      description:
        "The most cunning lowland beings in the Kurusetra universe. Masters of secret operations and deception.",
      icon: <Skull className="h-4 w-4" />,
      specialty: "Espionage and Sabotage",
      startingBonus: "+25% Spy effectiveness, +15% Enemy detection",
    },
    tibrasara: {
      name: "Tibrasara",
      description:
        "Mysterious beings who live in dark forests with unparalleled archery skills. Their killing instinct is feared throughout the realm.",
      icon: <Shield className="h-4 w-4" />,
      specialty: "Ranged Combat and Stealth",
      startingBonus: "+20% Ranged damage, +15% Stealth capability",
    },
    raksasa: {
      name: "Raksasa",
      description:
        "Enormous and terrifying beings who inhabit steep rocky hills. Their army strength is unmatched in the realm.",
      icon: <Sword className="h-4 w-4" />,
      specialty: "Brute Force and Intimidation",
      startingBonus: "+30% Army strength, +20% Enemy morale reduction",
    },
    dedemit: {
      name: "Dedemit",
      description:
        "Spectral beings who exist in the realm of wandering spirits. They require no food to survive and their armies never perish in battle.",
      icon: <Ghost className="h-4 w-4" />,
      specialty: "Immortality and Spirit Magic",
      startingBonus: "-25% Food consumption, +20% Army revival rate",
    },
  };

  return (
    <div className="w-full">
      <Select value={selectedRace} onValueChange={onSelectRace}>
        <SelectTrigger className="w-full h-11 shadow-neuro-concave">
          <SelectValue placeholder="Select your race" />
        </SelectTrigger>
        <SelectContent className="max-h-80">
          <SelectGroup>
            <SelectLabel>Choose Your Race</SelectLabel>
            {Object.entries(races).map(([id, race]) => (
              <SelectItem key={id} value={id} className="py-3">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-accent/30">{race.icon}</div>
                  <div className="flex flex-col">
                    <span className="font-medium">{race.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {race.specialty}
                    </span>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help ml-1" />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p className="text-xs mb-1">{race.description}</p>
                        <p className="text-xs font-medium">
                          {race.startingBonus}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
