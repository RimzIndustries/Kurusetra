import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sword, 
  Shield, 
  Target, 
  AlertTriangle, 
  Clock, 
  Users,
  MapPin,
  ArrowRight,
  BarChart
} from 'lucide-react';
import { NeumorphicCard, NeumorphicButton, NeumorphicBadge, NeumorphicProgress } from '@/styles/components';

interface Battle {
  id: string;
  location: string;
  attacker: string;
  defender: string;
  attackerPower: number;
  defenderPower: number;
  status: 'Ongoing' | 'Victory' | 'Defeat';
  timeRemaining: string;
  casualties: {
    attacker: number;
    defender: number;
  };
}

interface War {
  id: string;
  name: string;
  opponent: string;
  startDate: string;
  battles: Battle[];
  totalPower: number;
  opponentPower: number;
  warScore: number;
  status: 'Active' | 'Won' | 'Lost' | 'Ceasefire';
}

const WarStatus = () => {
  const [currentWar, setCurrentWar] = useState<War>({
    id: "1",
    name: "War of the Five Kingdoms",
    opponent: "Dark Alliance",
    startDate: "3 days ago",
    battles: [
      {
        id: "1",
        location: "Northern Plains",
        attacker: "Dragon Warriors",
        defender: "Dark Alliance",
        attackerPower: 15000,
        defenderPower: 12000,
        status: "Ongoing",
        timeRemaining: "2h 30m",
        casualties: {
          attacker: 500,
          defender: 800
        }
      },
      {
        id: "2",
        location: "Southern Pass",
        attacker: "Dark Alliance",
        defender: "Dragon Warriors",
        attackerPower: 10000,
        defenderPower: 8000,
        status: "Victory",
        timeRemaining: "Completed",
        casualties: {
          attacker: 1200,
          defender: 600
        }
      }
    ],
    totalPower: 25000,
    opponentPower: 22000,
    warScore: 65,
    status: "Active"
  });

  return (
    <div className="space-y-6">
      {/* War Overview */}
      <NeumorphicCard className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">{currentWar.name}</h2>
            <div className="flex items-center gap-2">
              <NeumorphicBadge type={currentWar.status === 'Active' ? 'error' : currentWar.status === 'Won' ? 'success' : 'warning'}>
                {currentWar.status}
              </NeumorphicBadge>
              <NeumorphicBadge type="info">
                <Clock className="h-4 w-4 mr-1" />
                Started {currentWar.startDate}
              </NeumorphicBadge>
            </div>
          </div>
          <div className="flex gap-2">
            <NeumorphicButton>
              <Target className="h-4 w-4 mr-2" />
              New Battle
            </NeumorphicButton>
            <NeumorphicButton>
              <AlertTriangle className="h-4 w-4 mr-2" />
              War Council
            </NeumorphicButton>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <NeumorphicCard className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sword className="h-5 w-5 text-primary" />
              <span className="font-semibold">War Score</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">{currentWar.warScore}</span>
              <NeumorphicProgress 
                value={currentWar.warScore}
                className="w-24"
              />
            </div>
          </NeumorphicCard>

          <NeumorphicCard className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-semibold">Power Comparison</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Our Power:</span>
                <span className="font-medium">{currentWar.totalPower}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Enemy Power:</span>
                <span className="font-medium">{currentWar.opponentPower}</span>
              </div>
            </div>
          </NeumorphicCard>

          <NeumorphicCard className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="font-semibold">Total Battles</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Active:</span>
              <span>{currentWar.battles.filter(b => b.status === 'Ongoing').length}</span>
            </div>
          </NeumorphicCard>
        </div>
      </NeumorphicCard>

      {/* Active Battles */}
      <NeumorphicCard className="p-6">
        <h3 className="text-xl font-semibold mb-4">Active Battles</h3>
        <div className="space-y-4">
          {currentWar.battles.filter(battle => battle.status === 'Ongoing').map((battle) => (
            <NeumorphicCard key={battle.id} className="p-4">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">{battle.location}</h4>
                    <NeumorphicBadge type="error">
                      <Clock className="h-4 w-4 mr-1" />
                      {battle.timeRemaining}
                    </NeumorphicBadge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Attacker</div>
                      <div className="font-medium">{battle.attacker}</div>
                      <div className="flex items-center gap-1 text-sm">
                        <Sword className="h-4 w-4" />
                        Power: {battle.attackerPower}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Defender</div>
                      <div className="font-medium">{battle.defender}</div>
                      <div className="flex items-center gap-1 text-sm">
                        <Shield className="h-4 w-4" />
                        Power: {battle.defenderPower}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Casualties</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Attacker:</span>
                      <span className="text-error">{battle.casualties.attacker}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Defender:</span>
                      <span className="text-error">{battle.casualties.defender}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <NeumorphicButton className="flex-1">
                  <MapPin className="h-4 w-4 mr-2" />
                  View Battlefield
                </NeumorphicButton>
                <NeumorphicButton className="flex-1">
                  <BarChart className="h-4 w-4 mr-2" />
                  Battle Stats
                </NeumorphicButton>
              </div>
            </NeumorphicCard>
          ))}
        </div>
      </NeumorphicCard>

      {/* Battle History */}
      <NeumorphicCard className="p-6">
        <h3 className="text-xl font-semibold mb-4">Battle History</h3>
        <div className="space-y-4">
          {currentWar.battles.filter(battle => battle.status !== 'Ongoing').map((battle) => (
            <NeumorphicCard key={battle.id} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">{battle.location}</h4>
                  <p className="text-sm text-muted-foreground">
                    {battle.attacker} vs {battle.defender}
                  </p>
                </div>
                <NeumorphicBadge type={battle.status === 'Victory' ? 'success' : 'error'}>
                  {battle.status}
                </NeumorphicBadge>
              </div>
            </NeumorphicCard>
          ))}
        </div>
      </NeumorphicCard>
    </div>
  );
};

export default WarStatus; 