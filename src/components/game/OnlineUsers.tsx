import React, { useState } from "react";
import { useMultiplayer } from "@/contexts/MultiplayerContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  UserCheck,
  Clock,
  Shield,
  MessageCircle,
  X,
  Crown,
  MapPin,
  Sword,
  Zap,
  Search,
  Filter,
  MoreVertical
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { NeumorphicCard, NeumorphicButton, NeumorphicBadge, NeumorphicInput } from '@/styles/components';

interface Player {
  id: string;
  name: string;
  kingdom: string;
  race: string;
  level: number;
  status: 'online' | 'afk' | 'in_battle' | 'in_alliance_meeting';
  lastActive: string;
  militaryPower: number;
  influence: number;
  alliance?: string;
}

const OnlineUsers: React.FC = () => {
  const {
    onlineUsers,
    currentUserStatus,
    sendMessage,
    messages,
    getMessagesWithUser,
  } = useMultiplayer();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'online' | 'alliance'>('all');

  const selectedUser = selectedUserId
    ? onlineUsers.find((user) => user.id === selectedUserId)
    : null;
  const userMessages = selectedUserId
    ? getMessagesWithUser(selectedUserId)
    : [];

  const handleSendMessage = async () => {
    if (selectedUserId && messageInput.trim()) {
      await sendMessage(selectedUserId, messageInput.trim());
      setMessageInput("");
    }
  };

  // Sample data - replace with real data from your backend
  const players: Player[] = [
    {
      id: "1",
      name: "Raja Agung",
      kingdom: "Kerajaan Majapahit",
      race: "Ksatriya",
      level: 25,
      status: "online",
      lastActive: "Sekarang",
      militaryPower: 15000,
      influence: 5000,
      alliance: "Dewan Raja Timur"
    },
    {
      id: "2",
      name: "Prabu Kresna",
      kingdom: "Kerajaan Dwaraka",
      race: "Wanamarta",
      level: 30,
      status: "in_battle",
      lastActive: "5 menit lalu",
      militaryPower: 20000,
      influence: 8000,
      alliance: "Dewan Raja Barat"
    },
    {
      id: "3",
      name: "Ratu Shinta",
      kingdom: "Kerajaan Ayodhya",
      race: "Jatayu",
      level: 22,
      status: "afk",
      lastActive: "10 menit lalu",
      militaryPower: 12000,
      influence: 4000
    }
  ];

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         player.kingdom.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'online' && player.status === 'online') ||
                         (filter === 'alliance' && player.alliance);
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: Player['status']) => {
    switch (status) {
      case 'online': return 'success';
      case 'afk': return 'warning';
      case 'in_battle': return 'danger';
      case 'in_alliance_meeting': return 'info';
      default: return 'default';
    }
  };

  const getStatusText = (status: Player['status']) => {
    switch (status) {
      case 'online': return 'Online';
      case 'afk': return 'AFK';
      case 'in_battle': return 'Dalam Pertempuran';
      case 'in_alliance_meeting': return 'Rapat Aliansi';
      default: return 'Offline';
    }
  };

  return (
    <NeumorphicCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <h2 className="text-xl font-bold">Pemain Online</h2>
          <NeumorphicBadge type="info">
            {filteredPlayers.length} Online
          </NeumorphicBadge>
        </div>
        <div className="flex items-center gap-2">
          <NeumorphicInput
            placeholder="Cari pemain..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
          <NeumorphicButton
            onClick={() => setFilter('all')}
            variant={filter === 'all' ? 'primary' : 'default'}
          >
            Semua
          </NeumorphicButton>
          <NeumorphicButton
            onClick={() => setFilter('online')}
            variant={filter === 'online' ? 'primary' : 'default'}
          >
            Online
          </NeumorphicButton>
          <NeumorphicButton
            onClick={() => setFilter('alliance')}
            variant={filter === 'alliance' ? 'primary' : 'default'}
          >
            Aliansi
          </NeumorphicButton>
        </div>
      </div>

      <div className="space-y-4">
        {filteredPlayers.map((player) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <NeumorphicCard className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="h-4 w-4" />
                    <h3 className="font-semibold">{player.name}</h3>
                    <NeumorphicBadge type={getStatusColor(player.status)}>
                      {getStatusText(player.status)}
                    </NeumorphicBadge>
                    <span className="text-sm text-muted-foreground">
                      Level {player.level}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span className="text-sm">{player.kingdom}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Sword className="h-3 w-3" />
                      <span className="text-sm">{player.militaryPower.toLocaleString()} Power</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      <span className="text-sm">{player.influence.toLocaleString()} Pengaruh</span>
                    </div>
                  </div>
                  {player.alliance && (
                    <div className="flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      <span className="text-sm">Aliansi: {player.alliance}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <NeumorphicButton size="sm">
                    Kirim Pesan
                  </NeumorphicButton>
                  <NeumorphicButton size="sm" variant="ghost">
                    <MoreVertical className="h-4 w-4" />
                  </NeumorphicButton>
                </div>
              </div>
            </NeumorphicCard>
          </motion.div>
        ))}
      </div>
    </NeumorphicCard>
  );
};

export default OnlineUsers;
