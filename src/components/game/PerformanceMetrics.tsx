import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  TrendingUp, 
  Target,
  Award,
  Clock,
  Users,
  Coins,
  Wheat,
  Shield,
  Sword
} from 'lucide-react';
import { NeumorphicCard, NeumorphicButton, NeumorphicBadge, NeumorphicProgress } from '@/styles/components';

interface Metric {
  name: string;
  current: number;
  previous: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
}

interface PerformanceData {
  playerRank: number;
  kingdomRank: number;
  metrics: Metric[];
  weeklyTrends: {
    date: string;
    power: number;
    resources: number;
    battles: number;
  }[];
}

const PerformanceMetrics = () => {
  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    playerRank: 42,
    kingdomRank: 15,
    metrics: [
      {
        name: "Military Power",
        current: 15000,
        previous: 12000,
        trend: "up",
        icon: <Sword className="h-5 w-5" />
      },
      {
        name: "Resource Production",
        current: 8000,
        previous: 7500,
        trend: "up",
        icon: <Wheat className="h-5 w-5" />
      },
      {
        name: "Kingdom Defense",
        current: 12000,
        previous: 10000,
        trend: "up",
        icon: <Shield className="h-5 w-5" />
      },
      {
        name: "Population",
        current: 5000,
        previous: 4800,
        trend: "up",
        icon: <Users className="h-5 w-5" />
      }
    ],
    weeklyTrends: [
      { date: "Mon", power: 12000, resources: 6000, battles: 3 },
      { date: "Tue", power: 12500, resources: 6500, battles: 2 },
      { date: "Wed", power: 13000, resources: 7000, battles: 4 },
      { date: "Thu", power: 13500, resources: 7500, battles: 3 },
      { date: "Fri", power: 14000, resources: 8000, battles: 5 },
      { date: "Sat", power: 14500, resources: 8500, battles: 4 },
      { date: "Sun", power: 15000, resources: 9000, battles: 6 }
    ]
  });

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NeumorphicCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Player Ranking</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{performanceData.playerRank}</div>
              <div className="text-sm text-muted-foreground">Global Rank</div>
            </div>
            <NeumorphicBadge type="success">
              <TrendingUp className="h-4 w-4 mr-1" />
              +5 this week
            </NeumorphicBadge>
          </div>
        </NeumorphicCard>

        <NeumorphicCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Kingdom Ranking</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{performanceData.kingdomRank}</div>
              <div className="text-sm text-muted-foreground">Global Rank</div>
            </div>
            <NeumorphicBadge type="success">
              <TrendingUp className="h-4 w-4 mr-1" />
              +3 this week
            </NeumorphicBadge>
          </div>
        </NeumorphicCard>
      </div>

      {/* Key Metrics */}
      <NeumorphicCard className="p-6">
        <h3 className="text-xl font-semibold mb-4">Key Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {performanceData.metrics.map((metric, index) => (
            <NeumorphicCard key={index} className="p-4">
              <div className="flex items-center gap-2 mb-2">
                {metric.icon}
                <span className="font-semibold">{metric.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-2xl font-bold">{metric.current}</div>
                  <div className="text-sm text-muted-foreground">
                    Previous: {metric.previous}
                  </div>
                </div>
                <NeumorphicBadge type={metric.trend === 'up' ? 'success' : metric.trend === 'down' ? 'error' : 'info'}>
                  {metric.trend === 'up' ? '+' : metric.trend === 'down' ? '-' : '='}
                  {Math.abs(metric.current - metric.previous)}
                </NeumorphicBadge>
              </div>
            </NeumorphicCard>
          ))}
        </div>
      </NeumorphicCard>

      {/* Weekly Trends */}
      <NeumorphicCard className="p-6">
        <h3 className="text-xl font-semibold mb-4">Weekly Performance Trends</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <NeumorphicCard className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sword className="h-5 w-5 text-primary" />
              <span className="font-semibold">Military Power</span>
            </div>
            <div className="h-40 flex items-end gap-1">
              {performanceData.weeklyTrends.map((trend, index) => (
                <div key={index} className="flex-1">
                  <div 
                    className="bg-primary rounded-t-sm"
                    style={{ height: `${(trend.power / 15000) * 100}%` }}
                  />
                  <div className="text-xs text-center mt-1">{trend.date}</div>
                </div>
              ))}
            </div>
          </NeumorphicCard>

          <NeumorphicCard className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Coins className="h-5 w-5 text-primary" />
              <span className="font-semibold">Resource Production</span>
            </div>
            <div className="h-40 flex items-end gap-1">
              {performanceData.weeklyTrends.map((trend, index) => (
                <div key={index} className="flex-1">
                  <div 
                    className="bg-primary rounded-t-sm"
                    style={{ height: `${(trend.resources / 9000) * 100}%` }}
                  />
                  <div className="text-xs text-center mt-1">{trend.date}</div>
                </div>
              ))}
            </div>
          </NeumorphicCard>

          <NeumorphicCard className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-5 w-5 text-primary" />
              <span className="font-semibold">Battles</span>
            </div>
            <div className="h-40 flex items-end gap-1">
              {performanceData.weeklyTrends.map((trend, index) => (
                <div key={index} className="flex-1">
                  <div 
                    className="bg-primary rounded-t-sm"
                    style={{ height: `${(trend.battles / 6) * 100}%` }}
                  />
                  <div className="text-xs text-center mt-1">{trend.date}</div>
                </div>
              ))}
            </div>
          </NeumorphicCard>
        </div>
      </NeumorphicCard>

      {/* Performance Actions */}
      <div className="flex gap-4">
        <NeumorphicButton className="flex-1">
          <BarChart className="h-4 w-4 mr-2" />
          Detailed Analytics
        </NeumorphicButton>
        <NeumorphicButton className="flex-1">
          <LineChart className="h-4 w-4 mr-2" />
          Compare with Others
        </NeumorphicButton>
        <NeumorphicButton className="flex-1">
          <PieChart className="h-4 w-4 mr-2" />
          Performance Breakdown
        </NeumorphicButton>
      </div>
    </div>
  );
};

export default PerformanceMetrics; 