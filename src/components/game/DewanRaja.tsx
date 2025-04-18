import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  MessageSquare,
  Crown,
  Shield,
  Sword,
  Clock,
  Flag,
  Scroll,
  Coins,
  Wheat,
  Plus,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useGameState } from '../../hooks/useGameState';
import { useToast } from '../../hooks/useToast';
import { NeumorphicCard, NeumorphicButton, NeumorphicBadge, NeumorphicProgress } from '@/styles/components';

interface Policy {
  id: string;
  name: string;
  description: string;
  cost: {
    gold: number;
    influence: number;
  };
  effects: {
    happiness: number;
    production: number;
    military: number;
  };
}

interface CouncilMember {
  id: string;
  name: string;
  role: string;
  status: 'Present' | 'Absent';
  influence: number;
}

interface RoyalDecree {
  id: string;
  title: string;
  description: string;
  type: 'Military' | 'Economic' | 'Social' | 'Diplomatic';
  status: 'Pending' | 'Approved' | 'Rejected';
  votes: {
    yes: number;
    no: number;
    abstain: number;
  };
}

const DewanRaja = () => {
  const { player, updatePlayer } = useGameState();
  const { addToast } = useToast();
  const [members, setMembers] = useState([
    {
      id: 1,
      name: "Arjuna",
      kingdom: "Pandawa",
      rank: "Leader",
      power: 12500,
      lastActive: "10 minutes ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjuna",
      online: true,
      contribution: 8500,
      joinedDate: "2 months ago",
      specialization: "Archery",
    },
    {
      id: 2,
      name: "Kresna",
      kingdom: "Dwaraka",
      rank: "Elder",
      power: 10200,
      lastActive: "1 hour ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kresna",
      online: true,
      contribution: 7200,
      joinedDate: "1 month ago",
      specialization: "Strategy",
    },
    {
      id: 3,
      name: "Bima",
      kingdom: "Jodipati",
      rank: "Elder",
      power: 9800,
      lastActive: "3 hours ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bima",
      online: false,
      contribution: 6800,
      joinedDate: "3 months ago",
      specialization: "Infantry",
    },
    {
      id: 4,
      name: "Nakula",
      kingdom: "Sawojajar",
      rank: "Member",
      power: 7500,
      lastActive: "5 hours ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nakula",
      online: false,
      contribution: 3200,
      joinedDate: "2 weeks ago",
      specialization: "Cavalry",
    },
    {
      id: 5,
      name: "Sadewa",
      kingdom: "Madukara",
      rank: "Member",
      power: 7200,
      lastActive: "1 day ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sadewa",
      online: false,
      contribution: 2900,
      joinedDate: "1 week ago",
      specialization: "Defense",
    },
  ]);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Arjuna",
      message: "We should coordinate an attack on the northern kingdoms.",
      time: "10:15 AM",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjuna",
      type: "strategy",
      read: [1, 2, 3, 4, 5],
      reactions: [
        { emoji: "👍", by: [2, 3] },
        { emoji: "⚔️", by: [4] },
      ],
    },
    {
      id: 2,
      sender: "Kresna",
      message: "I agree. My troops will be ready in 2 hours.",
      time: "10:18 AM",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kresna",
      type: "response",
      read: [1, 2, 3],
      reactions: [{ emoji: "👍", by: [1] }],
    },
    {
      id: 3,
      sender: "Bima",
      message: "I can provide 500 cavalry units for the attack.",
      time: "10:25 AM",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bima",
      type: "contribution",
      read: [1, 2, 3, 4],
      reactions: [{ emoji: "🐎", by: [1, 2] }],
    },
    {
      id: 4,
      sender: "Arjuna",
      message:
        "Perfect. Let's meet at the war council at noon to finalize the strategy.",
      time: "10:30 AM",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjuna",
      type: "announcement",
      read: [1, 2, 3],
      reactions: [{ emoji: "✅", by: [2, 3] }],
    },
  ]);

  const [wars, setWars] = useState([
    {
      id: 1,
      enemy: "Kurawa Alliance",
      status: "Active",
      startDate: "2 days ago",
      endDate: "3 days remaining",
      victories: 5,
      defeats: 2,
      participants: [1, 2, 3, 4],
      enemyStrength: 45000,
      allianceStrength: 39800,
      territories: [
        { name: "Northern Plains", status: "Captured", controller: "Alliance" },
        { name: "Eastern Mountains", status: "Contested", controller: "None" },
        { name: "Western Forest", status: "Lost", controller: "Enemy" },
      ],
      rewards: { gold: 5000, resources: 2500, prestige: 350 },
      lastUpdate: "15 minutes ago",
    },
    {
      id: 2,
      enemy: "Astina Federation",
      status: "Preparing",
      startDate: "Starts in 1 day",
      endDate: "7 days duration",
      victories: 0,
      defeats: 0,
      participants: [1, 2, 5],
      enemyStrength: 38000,
      allianceStrength: 29900,
      territories: [
        { name: "Southern Valley", status: "Target", controller: "Enemy" },
        { name: "Central Fortress", status: "Target", controller: "Enemy" },
      ],
      rewards: { gold: 7500, resources: 3800, prestige: 500 },
      lastUpdate: "1 hour ago",
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [messageType, setMessageType] = useState("regular");
  const [isTyping, setIsTyping] = useState(false);
  const [policies, setPolicies] = useState<Policy[]>(player.policies || []);
  const [isProcessing, setIsProcessing] = useState(false);

  const [councilMembers, setCouncilMembers] = useState<CouncilMember[]>([
    {
      id: "1",
      name: "Raja Agung",
      role: "Pemimpin Tertinggi",
      status: "Present",
      influence: 100
    },
    {
      id: "2",
      name: "Menteri Perang",
      role: "Panglima Militer",
      status: "Present",
      influence: 85
    },
    {
      id: "3",
      name: "Menteri Ekonomi",
      role: "Pengurus Keuangan",
      status: "Present",
      influence: 80
    },
    {
      id: "4",
      name: "Menteri Sosial",
      role: "Pengurus Rakyat",
      status: "Absent",
      influence: 75
    }
  ]);

  const [decrees, setDecrees] = useState<RoyalDecree[]>([
    {
      id: "1",
      title: "Peningkatan Anggaran Militer",
      description: "Meningkatkan anggaran militer sebesar 20% untuk memperkuat pertahanan kerajaan",
      type: "Military",
      status: "Pending",
      votes: {
        yes: 2,
        no: 1,
        abstain: 0
      }
    },
    {
      id: "2",
      title: "Pembangunan Pasar Baru",
      description: "Membangun pasar baru di wilayah utara untuk meningkatkan perekonomian",
      type: "Economic",
      status: "Approved",
      votes: {
        yes: 3,
        no: 0,
        abstain: 0
      }
    }
  ]);

  useEffect(() => {
    const typingInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    }, 10000);

    return () => clearInterval(typingInterval);
  }, []);

  const sendMessage = () => {
    if (newMessage.trim() === "") return;

    const message = {
      id: messages.length + 1,
      sender: "Arjuna",
      message: newMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjuna",
      type: messageType,
      read: [1],
      reactions: [],
    };

    setMessages([...messages, message]);
    setNewMessage("");

    setTimeout(() => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === message.id ? { ...msg, read: [1, 2, 3] } : msg,
        ),
      );
    }, 5000);
  };

  return (
    <div className="space-y-6">
      {/* Council Overview */}
      <NeumorphicCard className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Crown className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Dewan Raja</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {councilMembers.map((member) => (
            <NeumorphicCard key={member.id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="font-semibold">{member.name}</span>
                </div>
                <NeumorphicBadge type={member.status === 'Present' ? 'success' : 'error'}>
                  {member.status}
                </NeumorphicBadge>
              </div>
              <div className="text-sm text-muted-foreground mb-2">{member.role}</div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Pengaruh:</span>
                  <span className="font-medium">{member.influence}%</span>
                </div>
                <NeumorphicProgress 
                  value={member.influence}
                  className="h-2"
                />
              </div>
            </NeumorphicCard>
          ))}
        </div>
      </NeumorphicCard>

      {/* Active Decrees */}
      <NeumorphicCard className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Scroll className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Keputusan Aktif</h2>
          </div>
          <NeumorphicButton>
            <Plus className="h-4 w-4 mr-2" />
            Keputusan Baru
          </NeumorphicButton>
        </div>

        <div className="space-y-4">
          {decrees.filter(decree => decree.status === 'Pending').map((decree) => (
            <NeumorphicCard key={decree.id} className="p-4">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{decree.title}</h3>
                    <NeumorphicBadge type={
                      decree.type === 'Military' ? 'error' : 
                      decree.type === 'Economic' ? 'warning' :
                      decree.type === 'Social' ? 'info' : 'success'
                    }>
                      {decree.type}
                    </NeumorphicBadge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{decree.description}</p>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Setuju</span>
                      <span className="font-medium">{decree.votes.yes}</span>
                    </div>
                    <NeumorphicProgress 
                      value={(decree.votes.yes / (decree.votes.yes + decree.votes.no + decree.votes.abstain)) * 100}
                      className="h-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Tidak Setuju</span>
                      <span className="font-medium">{decree.votes.no}</span>
                    </div>
                    <NeumorphicProgress 
                      value={(decree.votes.no / (decree.votes.yes + decree.votes.no + decree.votes.abstain)) * 100}
                      className="h-2"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <NeumorphicButton className="flex-1">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Setuju
                </NeumorphicButton>
                <NeumorphicButton className="flex-1">
                  <XCircle className="h-4 w-4 mr-2" />
                  Tidak Setuju
                </NeumorphicButton>
              </div>
            </NeumorphicCard>
          ))}
        </div>
      </NeumorphicCard>

      {/* Kingdom Status */}
      <NeumorphicCard className="p-6">
        <h3 className="text-xl font-semibold mb-4">Status Kerajaan</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <NeumorphicCard className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sword className="h-5 w-5 text-primary" />
              <span className="font-semibold">Kekuatan Militer</span>
            </div>
            <div className="text-2xl font-bold">15,000</div>
            <div className="text-sm text-muted-foreground">+500 minggu ini</div>
          </NeumorphicCard>

          <NeumorphicCard className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Coins className="h-5 w-5 text-primary" />
              <span className="font-semibold">Pendapatan</span>
            </div>
            <div className="text-2xl font-bold">8,000</div>
            <div className="text-sm text-muted-foreground">+300 minggu ini</div>
          </NeumorphicCard>

          <NeumorphicCard className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wheat className="h-5 w-5 text-primary" />
              <span className="font-semibold">Produksi Pangan</span>
            </div>
            <div className="text-2xl font-bold">12,000</div>
            <div className="text-sm text-muted-foreground">+400 minggu ini</div>
          </NeumorphicCard>

          <NeumorphicCard className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-semibold">Pertahanan</span>
            </div>
            <div className="text-2xl font-bold">10,000</div>
            <div className="text-sm text-muted-foreground">+200 minggu ini</div>
          </NeumorphicCard>
        </div>
      </NeumorphicCard>
    </div>
  );
};

export default DewanRaja;
