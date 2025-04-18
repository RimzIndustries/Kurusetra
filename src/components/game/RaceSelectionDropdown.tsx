import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  Sword, 
  Shield, 
  Zap, 
  Users,
  ArrowRight,
  Check
} from 'lucide-react';
import { NeumorphicCard, NeumorphicButton, NeumorphicBadge } from '@/styles/components';

interface Race {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bonuses: {
    military: number;
    defense: number;
    production: number;
    population: number;
  };
  specialty: string;
  startingBonus: string;
}

const races: Race[] = [
  {
    id: "1",
    name: "Ksatriya",
    description: "Bangsa pejuang yang ahli dalam pertempuran dan strategi militer",
    icon: <Sword className="h-5 w-5" />,
    color: "red",
    bonuses: {
      military: 20,
      defense: 15,
      production: 5,
      population: 10
    },
    specialty: "Pertempuran",
    startingBonus: "Pasukan Elite Awal"
  },
  {
    id: "2",
    name: "Wanamarta",
    description: "Bangsa yang hidup harmonis dengan alam dan ahli dalam produksi",
    icon: <Zap className="h-5 w-5" />,
    color: "green",
    bonuses: {
      military: 5,
      defense: 10,
      production: 25,
      population: 15
    },
    specialty: "Produksi",
    startingBonus: "Sumber Daya Berlimpah"
  },
  {
    id: "3",
    name: "Wirabumi",
    description: "Bangsa yang kuat dan tangguh dengan pertahanan yang kokoh",
    icon: <Shield className="h-5 w-5" />,
    color: "blue",
    bonuses: {
      military: 10,
      defense: 25,
      production: 10,
      population: 5
    },
    specialty: "Pertahanan",
    startingBonus: "Benteng Kuat"
  },
  {
    id: "4",
    name: "Jatayu",
    description: "Bangsa yang cerdas dengan populasi yang berkembang pesat",
    icon: <Users className="h-5 w-5" />,
    color: "purple",
    bonuses: {
      military: 5,
      defense: 5,
      production: 15,
      population: 25
    },
    specialty: "Populasi",
    startingBonus: "Pertumbuhan Cepat"
  }
];

interface RaceSelectionDropdownProps {
  onSelect: (race: Race) => void;
  selectedRace?: Race;
  disabled?: boolean;
}

const RaceSelectionDropdown: React.FC<RaceSelectionDropdownProps> = ({
  onSelect,
  selectedRace,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <NeumorphicButton
        className="w-full justify-between"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <div className="flex items-center gap-2">
          {selectedRace ? (
            <>
              {selectedRace.icon}
              <span>{selectedRace.name}</span>
            </>
          ) : (
            <span>Pilih Bangsa</span>
          )}
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </NeumorphicButton>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2"
          >
            <NeumorphicCard className="p-4 space-y-4">
              {races.map((race) => (
                <div
                  key={race.id}
                  className="cursor-pointer"
                  onClick={() => {
                    onSelect(race);
                    setIsOpen(false);
                  }}
                >
                  <NeumorphicCard className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {race.icon}
                          <h3 className="font-semibold">{race.name}</h3>
                          {selectedRace?.id === race.id && (
                            <NeumorphicBadge type="success">
                              <Check className="h-3 w-3 mr-1" />
                              Terpilih
                            </NeumorphicBadge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {race.description}
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <NeumorphicBadge type="info">
                            <Sword className="h-3 w-3 mr-1" />
                            Militer +{race.bonuses.military}%
                          </NeumorphicBadge>
                          <NeumorphicBadge type="info">
                            <Shield className="h-3 w-3 mr-1" />
                            Pertahanan +{race.bonuses.defense}%
                          </NeumorphicBadge>
                          <NeumorphicBadge type="info">
                            <Zap className="h-3 w-3 mr-1" />
                            Produksi +{race.bonuses.production}%
                          </NeumorphicBadge>
                          <NeumorphicBadge type="info">
                            <Users className="h-3 w-3 mr-1" />
                            Populasi +{race.bonuses.population}%
                          </NeumorphicBadge>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </NeumorphicCard>
                </div>
              ))}
            </NeumorphicCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RaceSelectionDropdown;
