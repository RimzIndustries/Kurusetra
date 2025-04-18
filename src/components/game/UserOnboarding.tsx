import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Crown,
  MapPin,
  Users,
  Building2,
  Shield,
  Sword,
  Zap
} from 'lucide-react';
import { NeumorphicCard, NeumorphicButton, NeumorphicBadge, NeumorphicInput } from '@/styles/components';
import RaceSelectionDropdown from './RaceSelectionDropdown';

interface KingdomSetup {
  name: string;
  capital: string;
  race: any;
  startingResources: {
    gold: number;
    food: number;
    population: number;
    influence: number;
  };
}

const UserOnboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [kingdomSetup, setKingdomSetup] = useState<KingdomSetup>({
    name: '',
    capital: '',
    race: null,
    startingResources: {
      gold: 1000,
      food: 1000,
      population: 100,
      influence: 100
    }
  });

  const handleInputChange = (field: keyof KingdomSetup, value: string) => {
    setKingdomSetup(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRaceSelect = (race: any) => {
    setKingdomSetup(prev => ({
      ...prev,
      race
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold">Selamat Datang di Kurusetra</h2>
            <p className="text-muted-foreground">
              Mari kita mulai perjalananmu untuk membangun kerajaan yang kuat dan makmur.
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Nama Kerajaan</label>
                <NeumorphicInput
                  value={kingdomSetup.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Masukkan nama kerajaanmu"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Ibu Kota</label>
                <NeumorphicInput
                  value={kingdomSetup.capital}
                  onChange={(e) => handleInputChange('capital', e.target.value)}
                  placeholder="Masukkan nama ibu kota"
                />
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold">Pilih Bangsa</h2>
            <p className="text-muted-foreground">
              Setiap bangsa memiliki keunikan dan keunggulan tersendiri. Pilihlah dengan bijak.
            </p>
            <RaceSelectionDropdown
              onSelect={handleRaceSelect}
              selectedRace={kingdomSetup.race}
            />
            {kingdomSetup.race && (
              <NeumorphicCard className="p-4 mt-4">
                <h3 className="font-semibold mb-2">Bonus Awal</h3>
                <div className="grid grid-cols-2 gap-2">
                  <NeumorphicBadge type="info">
                    <Crown className="h-3 w-3 mr-1" />
                    {kingdomSetup.race.startingBonus}
                  </NeumorphicBadge>
                  <NeumorphicBadge type="info">
                    <Sword className="h-3 w-3 mr-1" />
                    Militer +{kingdomSetup.race.bonuses.military}%
                  </NeumorphicBadge>
                  <NeumorphicBadge type="info">
                    <Shield className="h-3 w-3 mr-1" />
                    Pertahanan +{kingdomSetup.race.bonuses.defense}%
                  </NeumorphicBadge>
                  <NeumorphicBadge type="info">
                    <Zap className="h-3 w-3 mr-1" />
                    Produksi +{kingdomSetup.race.bonuses.production}%
                  </NeumorphicBadge>
                </div>
              </NeumorphicCard>
            )}
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold">Sumber Daya Awal</h2>
            <p className="text-muted-foreground">
              Berikut adalah sumber daya yang akan kamu miliki di awal permainan.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <NeumorphicCard className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="h-4 w-4" />
                  <h3 className="font-semibold">Emas</h3>
                </div>
                <p className="text-2xl font-bold">{kingdomSetup.startingResources.gold}</p>
              </NeumorphicCard>
              <NeumorphicCard className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="h-4 w-4" />
                  <h3 className="font-semibold">Makanan</h3>
                </div>
                <p className="text-2xl font-bold">{kingdomSetup.startingResources.food}</p>
              </NeumorphicCard>
              <NeumorphicCard className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4" />
                  <h3 className="font-semibold">Populasi</h3>
                </div>
                <p className="text-2xl font-bold">{kingdomSetup.startingResources.population}</p>
              </NeumorphicCard>
              <NeumorphicCard className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4" />
                  <h3 className="font-semibold">Pengaruh</h3>
                </div>
                <p className="text-2xl font-bold">{kingdomSetup.startingResources.influence}</p>
              </NeumorphicCard>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <NeumorphicCard className="p-8">
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`flex items-center ${
                step < 3 ? 'flex-1' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= step
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {currentStep > step ? <Check className="h-4 w-4" /> : step}
              </div>
              {step < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    currentStep > step ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>

        <div className="flex justify-between mt-8">
          <NeumorphicButton
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Sebelumnya
          </NeumorphicButton>
          <NeumorphicButton
            onClick={() => {
              if (currentStep < 3) {
                setCurrentStep(prev => prev + 1);
              } else {
                // Handle completion
                console.log('Setup completed:', kingdomSetup);
              }
            }}
            disabled={
              (currentStep === 1 && (!kingdomSetup.name || !kingdomSetup.capital)) ||
              (currentStep === 2 && !kingdomSetup.race)
            }
          >
            {currentStep === 3 ? 'Mulai Permainan' : 'Selanjutnya'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </NeumorphicButton>
        </div>
      </NeumorphicCard>
    </div>
  );
};

export default UserOnboarding;
