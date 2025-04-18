import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, 
  MapPin, 
  Users, 
  Sword, 
  Shield, 
  Zap, 
  Building2, 
  BarChart2,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Calendar,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { NeumorphicCard, NeumorphicButton, NeumorphicBadge, NeumorphicProgress } from '@/styles/components';

interface KingdomStats {
  militaryPower: number;
  defenseStrength: number;
  population: number;
  influence: number;
  gold: number;
  food: number;
  wood: number;
  stone: number;
}

interface KingdomOverviewProps {
  name: string;
  race: string;
  level: number;
  location: string;
  stats: KingdomStats;
  weeklyChanges: {
    militaryPower: number;
    defenseStrength: number;
    population: number;
    influence: number;
  };
}

const KingdomOverview: React.FC<KingdomOverviewProps> = ({
  name,
  race,
  level,
  location,
  stats,
  weeklyChanges
}) => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'resources' | 'military'>('overview');

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUpRight className="h-4 w-4 text-green-500" />;
    if (change < 0) return <ArrowDownRight className="h-4 w-4 text-red-500" />;
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Kingdom Header */}
      <NeumorphicCard className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              <h2 className="text-2xl font-bold">{name}</h2>
              <NeumorphicBadge type="info">Level {level}</NeumorphicBadge>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="text-muted-foreground">{location}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <NeumorphicButton
              variant={selectedTab === 'overview' ? 'primary' : 'default'}
              onClick={() => setSelectedTab('overview')}
            >
              Overview
            </NeumorphicButton>
            <NeumorphicButton
              variant={selectedTab === 'resources' ? 'primary' : 'default'}
              onClick={() => setSelectedTab('resources')}
            >
              Resources
            </NeumorphicButton>
            <NeumorphicButton
              variant={selectedTab === 'military' ? 'primary' : 'default'}
              onClick={() => setSelectedTab('military')}
            >
              Military
            </NeumorphicButton>
          </div>
        </div>
      </NeumorphicCard>

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NeumorphicCard className="p-4">
            <h3 className="font-semibold mb-4">Key Metrics</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Sword className="h-4 w-4" />
                    <span>Military Power</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{formatNumber(stats.militaryPower)}</span>
                    {getChangeIcon(weeklyChanges.militaryPower)}
                  </div>
                </div>
                <NeumorphicProgress value={75} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span>Defense Strength</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{formatNumber(stats.defenseStrength)}</span>
                    {getChangeIcon(weeklyChanges.defenseStrength)}
                  </div>
                </div>
                <NeumorphicProgress value={60} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Population</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{formatNumber(stats.population)}</span>
                    {getChangeIcon(weeklyChanges.population)}
                  </div>
                </div>
                <NeumorphicProgress value={85} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <span>Influence</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{formatNumber(stats.influence)}</span>
                    {getChangeIcon(weeklyChanges.influence)}
                  </div>
                </div>
                <NeumorphicProgress value={45} />
              </div>
            </div>
          </NeumorphicCard>

          <NeumorphicCard className="p-4">
            <h3 className="font-semibold mb-4">Weekly Performance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span>Military Growth</span>
                </div>
                <span className="text-green-500">+{Math.abs(weeklyChanges.militaryPower)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span>Defense Change</span>
                </div>
                <span className="text-red-500">-{Math.abs(weeklyChanges.defenseStrength)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span>Population Growth</span>
                </div>
                <span className="text-green-500">+{Math.abs(weeklyChanges.population)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span>Influence Growth</span>
                </div>
                <span className="text-green-500">+{Math.abs(weeklyChanges.influence)}%</span>
              </div>
            </div>
          </NeumorphicCard>
        </div>
      )}

      {/* Resources Tab */}
      {selectedTab === 'resources' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NeumorphicCard className="p-4">
            <h3 className="font-semibold mb-4">Resources</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4" />
                  <span>Gold</span>
                </div>
                <span>{formatNumber(stats.gold)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <span>Food</span>
                </div>
                <span>{formatNumber(stats.food)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span>Wood</span>
                </div>
                <span>{formatNumber(stats.wood)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span>Stone</span>
                </div>
                <span>{formatNumber(stats.stone)}</span>
              </div>
            </div>
          </NeumorphicCard>

          <NeumorphicCard className="p-4">
            <h3 className="font-semibold mb-4">Production Rates</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Gold per hour</span>
                <span>+{formatNumber(1000)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Food per hour</span>
                <span>+{formatNumber(500)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Wood per hour</span>
                <span>+{formatNumber(300)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Stone per hour</span>
                <span>+{formatNumber(200)}</span>
              </div>
            </div>
          </NeumorphicCard>
        </div>
      )}

      {/* Military Tab */}
      {selectedTab === 'military' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NeumorphicCard className="p-4">
            <h3 className="font-semibold mb-4">Military Overview</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span>Total Power</span>
                  <span>{formatNumber(stats.militaryPower)}</span>
                </div>
                <NeumorphicProgress value={75} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span>Defense Rating</span>
                  <span>{formatNumber(stats.defenseStrength)}</span>
                </div>
                <NeumorphicProgress value={60} />
              </div>
              <div className="flex items-center justify-between">
                <span>Active Units</span>
                <span>{formatNumber(5000)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Training Units</span>
                <span>{formatNumber(1000)}</span>
              </div>
            </div>
          </NeumorphicCard>

          <NeumorphicCard className="p-4">
            <h3 className="font-semibold mb-4">Military Actions</h3>
            <div className="space-y-4">
              <NeumorphicButton className="w-full">
                <Sword className="h-4 w-4 mr-2" />
                Train Units
              </NeumorphicButton>
              <NeumorphicButton className="w-full">
                <Shield className="h-4 w-4 mr-2" />
                Upgrade Defenses
              </NeumorphicButton>
              <NeumorphicButton className="w-full">
                <BarChart2 className="h-4 w-4 mr-2" />
                View Battle History
              </NeumorphicButton>
            </div>
          </NeumorphicCard>
        </div>
      )}
    </div>
  );
};

export default KingdomOverview;
