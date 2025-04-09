import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  MessageSquare,
  Crown,
  Shield,
  Sword,
  Clock,
  Flag,
  VoteIcon,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

// Define types for proposals and votes
type VoteValue = "yes" | "no" | "abstain";

type Vote = {
  id: string;
  proposalId: string;
  memberId: number;
  value: VoteValue;
  timestamp: string;
};

type ProposalStatus = "active" | "passed" | "rejected" | "expired";

type Proposal = {
  id: string;
  title: string;
  description: string;
  createdBy: number;
  createdAt: string;
  expiresAt: string;
  status: ProposalStatus;
  category: "war" | "alliance" | "resource" | "diplomacy" | "other";
  votes: Vote[];
  requiredVotes: number;
};

const DewanRaja = () => {
  // Alliance members data with real-time status tracking
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

  // Alliance chat with real-time messaging and message types
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

  // Enhanced alliance wars with detailed battle information and real-time updates
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

  // State for new message
  const [newMessage, setNewMessage] = useState("");

  // Enhanced message sending with message types and real-time synchronization
  const [messageType, setMessageType] = useState("regular");
  const [isTyping, setIsTyping] = useState(false);

  // Proposals state
  const [proposals, setProposals] = useState<Proposal[]>([
    {
      id: "prop_1",
      title: "Alliance with Astina Kingdom",
      description:
        "Form a defensive alliance with Astina Kingdom to protect our northern borders.",
      createdBy: 1, // Arjuna
      createdAt: "2023-06-15T10:30:00Z",
      expiresAt: "2023-06-18T10:30:00Z",
      status: "active",
      category: "alliance",
      votes: [
        {
          id: "vote_1",
          proposalId: "prop_1",
          memberId: 1,
          value: "yes",
          timestamp: "2023-06-15T10:35:00Z",
        },
        {
          id: "vote_2",
          proposalId: "prop_1",
          memberId: 2,
          value: "yes",
          timestamp: "2023-06-15T11:20:00Z",
        },
        {
          id: "vote_3",
          proposalId: "prop_1",
          memberId: 3,
          value: "no",
          timestamp: "2023-06-15T12:45:00Z",
        },
      ],
      requiredVotes: 4,
    },
    {
      id: "prop_2",
      title: "Attack on Kurawa Stronghold",
      description:
        "Launch a coordinated attack on the Kurawa stronghold in the Eastern Mountains.",
      createdBy: 2, // Kresna
      createdAt: "2023-06-14T14:20:00Z",
      expiresAt: "2023-06-17T14:20:00Z",
      status: "active",
      category: "war",
      votes: [
        {
          id: "vote_4",
          proposalId: "prop_2",
          memberId: 1,
          value: "yes",
          timestamp: "2023-06-14T15:10:00Z",
        },
        {
          id: "vote_5",
          proposalId: "prop_2",
          memberId: 2,
          value: "yes",
          timestamp: "2023-06-14T14:25:00Z",
        },
        {
          id: "vote_6",
          proposalId: "prop_2",
          memberId: 4,
          value: "yes",
          timestamp: "2023-06-14T16:30:00Z",
        },
        {
          id: "vote_7",
          proposalId: "prop_2",
          memberId: 3,
          value: "abstain",
          timestamp: "2023-06-14T18:15:00Z",
        },
      ],
      requiredVotes: 4,
    },
    {
      id: "prop_3",
      title: "Resource Sharing Agreement",
      description:
        "Establish a resource sharing agreement among alliance members to boost production.",
      createdBy: 3, // Bima
      createdAt: "2023-06-13T09:45:00Z",
      expiresAt: "2023-06-16T09:45:00Z",
      status: "passed",
      category: "resource",
      votes: [
        {
          id: "vote_8",
          proposalId: "prop_3",
          memberId: 1,
          value: "yes",
          timestamp: "2023-06-13T10:20:00Z",
        },
        {
          id: "vote_9",
          proposalId: "prop_3",
          memberId: 2,
          value: "yes",
          timestamp: "2023-06-13T11:05:00Z",
        },
        {
          id: "vote_10",
          proposalId: "prop_3",
          memberId: 3,
          value: "yes",
          timestamp: "2023-06-13T09:50:00Z",
        },
        {
          id: "vote_11",
          proposalId: "prop_3",
          memberId: 4,
          value: "yes",
          timestamp: "2023-06-13T14:30:00Z",
        },
        {
          id: "vote_12",
          proposalId: "prop_3",
          memberId: 5,
          value: "abstain",
          timestamp: "2023-06-13T16:45:00Z",
        },
      ],
      requiredVotes: 4,
    },
  ]);

  // New proposal form state
  const [newProposal, setNewProposal] = useState({
    title: "",
    description: "",
    category: "other" as
      | "war"
      | "alliance"
      | "resource"
      | "diplomacy"
      | "other",
  });

  // Dialog state
  const [isProposalDialogOpen, setIsProposalDialogOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(
    null,
  );
  const [voteValue, setVoteValue] = useState<VoteValue>("yes");

  // Simulate other users typing
  useEffect(() => {
    const typingInterval = setInterval(() => {
      // Random chance of someone typing
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
      sender: "Arjuna", // Assuming current user is Arjuna
      message: newMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjuna",
      type: messageType,
      read: [1], // Only read by sender initially
      reactions: [],
    };

    setMessages([...messages, message]);
    setNewMessage("");

    // Simulate other members reading the message after a delay
    setTimeout(() => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === message.id ? { ...msg, read: [1, 2, 3] } : msg,
        ),
      );
    }, 5000);
  };

  return (
    <div className="bg-background min-h-screen p-6 bg-gradient-to-b from-background to-background/95 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-24 -right-24 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6 backdrop-blur-sm bg-background/30 p-4 rounded-xl border border-border/30 shadow-lg">
          <div className="flex items-center gap-3">
            <Crown className="h-8 w-8 text-yellow-500 animate-pulse" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-amber-700 bg-clip-text text-transparent drop-shadow-sm">
              Dewan Raja (Royal Council)
            </h1>
          </div>
          <Badge className="text-lg py-1.5 px-4 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transition-colors cursor-pointer shadow-md border border-blue-400/20">
            <Crown className="h-4 w-4 mr-2" /> Pandawa Alliance
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-in fade-in duration-700">
          {/* Stats cards with hover animations */}
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="border-border/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-border/60 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm border-t border-white/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-500" />
                  Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">5 / 15</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.05 }}
          >
            <Card className="border-border/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-border/60 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm border-t border-white/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-green-500" />
                  Alliance Power
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">47,200</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
          >
            <Card className="border-border/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-border/60 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm border-t border-white/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <Flag className="h-5 w-5 mr-2 text-red-500" />
                  Active Wars
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">1</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <Tabs
          defaultValue="chat"
          className="w-full bg-gradient-to-b from-card/80 to-card/60 p-6 rounded-xl border border-border/40 shadow-lg backdrop-blur-sm relative overflow-hidden group"
        >
          {/* Decorative accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-primary to-yellow-500 opacity-80 group-hover:opacity-100 transition-opacity"></div>
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-muted/50 p-1 rounded-lg overflow-hidden shadow-inner">
            <TabsTrigger value="chat">Alliance Chat</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="wars">Alliance Wars</TabsTrigger>
            <TabsTrigger value="proposals">Proposals</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-6">
            <Card className="h-[600px] flex flex-col border-border/60 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-b from-card/90 to-card/80 backdrop-blur-sm border-t border-white/20 rounded-xl overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle>Alliance Communication</CardTitle>
              </CardHeader>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === "Arjuna" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex ${msg.sender === "Arjuna" ? "flex-row-reverse" : "flex-row"} items-start gap-2 max-w-[80%]`}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={msg.avatar} />
                          <AvatarFallback>{msg.sender[0]}</AvatarFallback>
                        </Avatar>
                        <div
                          className={`rounded-lg p-3 ${msg.sender === "Arjuna" ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md" : "bg-muted shadow-sm"} ${msg.type === "announcement" ? "border-l-4 border-yellow-500" : ""} ${msg.type === "strategy" ? "border-l-4 border-red-500" : ""} ${msg.type === "contribution" ? "border-l-4 border-green-500" : ""}`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium text-sm flex items-center gap-1">
                              {msg.sender}
                              {msg.type === "announcement" && (
                                <Flag className="h-3 w-3 text-yellow-500" />
                              )}
                              {msg.type === "strategy" && (
                                <Sword className="h-3 w-3 text-red-500" />
                              )}
                              {msg.type === "contribution" && (
                                <Shield className="h-3 w-3 text-green-500" />
                              )}
                            </span>
                            <span className="text-xs opacity-70">
                              {msg.time}
                            </span>
                          </div>
                          <p>{msg.message}</p>

                          {/* Message reactions */}
                          {msg.reactions && msg.reactions.length > 0 && (
                            <div className="flex gap-1 mt-2">
                              {msg.reactions.map((reaction, index) => (
                                <div
                                  key={index}
                                  className="bg-background/30 rounded-full px-1.5 py-0.5 text-xs flex items-center"
                                >
                                  <span className="mr-1">{reaction.emoji}</span>
                                  <span>{reaction.by.length}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Read receipts */}
                          <div className="flex justify-end mt-1">
                            <div className="flex -space-x-1">
                              {msg.read &&
                                msg.read.slice(0, 3).map((readerId) => {
                                  const reader = members.find(
                                    (m) => m.id === readerId,
                                  );
                                  return reader ? (
                                    <div
                                      key={readerId}
                                      className="h-3 w-3 rounded-full overflow-hidden border border-background"
                                    >
                                      <img
                                        src={reader.avatar}
                                        alt={reader.name}
                                        className="h-full w-full object-cover"
                                      />
                                    </div>
                                  ) : null;
                                })}
                              {msg.read && msg.read.length > 3 && (
                                <div className="h-3 w-3 rounded-full bg-muted text-[6px] flex items-center justify-center border border-background">
                                  +{msg.read.length - 3}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <CardFooter className="p-4 pt-2">
                {isTyping && (
                  <div className="text-xs text-muted-foreground mb-2 flex items-center">
                    <span className="mr-1">Someone is typing</span>
                    <span className="flex space-x-1">
                      <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        .
                      </motion.span>
                      <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.5,
                          delay: 0.2,
                        }}
                      >
                        .
                      </motion.span>
                      <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.5,
                          delay: 0.4,
                        }}
                      >
                        .
                      </motion.span>
                    </span>
                  </div>
                )}
                <div className="flex flex-col w-full gap-2">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`px-2 py-1 ${messageType === "regular" ? "bg-muted" : ""}`}
                        onClick={() => setMessageType("regular")}
                      >
                        Regular
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`px-2 py-1 ${messageType === "strategy" ? "bg-muted" : ""}`}
                        onClick={() => setMessageType("strategy")}
                      >
                        <Sword className="h-3 w-3 mr-1" /> Strategy
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`px-2 py-1 ${messageType === "announcement" ? "bg-muted" : ""}`}
                        onClick={() => setMessageType("announcement")}
                      >
                        <Flag className="h-3 w-3 mr-1" /> Announcement
                      </Button>
                    </div>
                  </div>
                  <div className="flex w-full gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                      className="flex-1"
                    />
                    <Button
                      onClick={sendMessage}
                      className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" /> Send
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="members" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Alliance Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-all duration-300 hover:shadow-md group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar>
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>{member.name[0]}</AvatarFallback>
                          </Avatar>
                          {member.online && (
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium group-hover:text-primary transition-colors">
                              {member.name}
                            </p>
                            {member.rank === "Leader" && (
                              <Crown className="h-4 w-4 text-yellow-500" />
                            )}
                            {member.rank === "Elder" && (
                              <Shield className="h-4 w-4 text-blue-500" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {member.kingdom}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div>
                          <p className="text-sm text-muted-foreground">Power</p>
                          <p className="font-medium">
                            {member.power.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Last Active
                          </p>
                          <p className="text-sm">{member.lastActive}</p>
                        </div>
                        <Button variant="ghost" size="icon">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">
                  <Users className="h-4 w-4 mr-2" /> Invite Member
                </Button>
                <Button variant="outline">
                  <Shield className="h-4 w-4 mr-2" /> Manage Ranks
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="wars" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Alliance Wars</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {wars.map((war) => (
                    <Card key={war.id} className="overflow-hidden">
                      <CardHeader className="bg-muted/50 pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-xl">{war.enemy}</CardTitle>
                          <Badge
                            variant={
                              war.status === "Active"
                                ? "destructive"
                                : "outline"
                            }
                          >
                            {war.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Started
                            </p>
                            <p className="font-medium">{war.startDate}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Ends
                            </p>
                            <p className="font-medium">{war.endDate}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Victories
                            </p>
                            <p className="font-medium text-green-600">
                              {war.victories}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Defeats
                            </p>
                            <p className="font-medium text-red-600">
                              {war.defeats}
                            </p>
                          </div>
                        </div>
                        <Separator className="my-4" />
                        <div className="flex justify-between">
                          {war.status === "Active" ? (
                            <>
                              <Button variant="outline">
                                <Shield className="h-4 w-4 mr-2" /> View
                                Defenses
                              </Button>
                              <Button>
                                <Sword className="h-4 w-4 mr-2" /> Attack
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button variant="outline">
                                <Clock className="h-4 w-4 mr-2" /> War Details
                              </Button>
                              <Button>
                                <Shield className="h-4 w-4 mr-2" /> Prepare
                                Defenses
                              </Button>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 py-6 text-lg font-semibold">
                  <Flag className="h-4 w-4 mr-2" /> Declare New War
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="proposals" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Alliance Proposals</CardTitle>
                  <CardDescription>
                    Vote on important decisions for our alliance
                  </CardDescription>
                </div>
                <Dialog
                  open={isProposalDialogOpen}
                  onOpenChange={setIsProposalDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900">
                      <VoteIcon className="h-4 w-4 mr-2" /> New Proposal
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Proposal</DialogTitle>
                      <DialogDescription>
                        Submit a new proposal for alliance members to vote on.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label htmlFor="title" className="text-sm font-medium">
                          Title
                        </label>
                        <Input
                          id="title"
                          placeholder="Enter proposal title"
                          value={newProposal.title}
                          onChange={(e) =>
                            setNewProposal({
                              ...newProposal,
                              title: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="category"
                          className="text-sm font-medium"
                        >
                          Category
                        </label>
                        <Select
                          value={newProposal.category}
                          onValueChange={(value) =>
                            setNewProposal({
                              ...newProposal,
                              category: value as any,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="war">War</SelectItem>
                            <SelectItem value="alliance">Alliance</SelectItem>
                            <SelectItem value="resource">Resource</SelectItem>
                            <SelectItem value="diplomacy">Diplomacy</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="description"
                          className="text-sm font-medium"
                        >
                          Description
                        </label>
                        <Textarea
                          id="description"
                          placeholder="Describe your proposal in detail"
                          rows={5}
                          value={newProposal.description}
                          onChange={(e) =>
                            setNewProposal({
                              ...newProposal,
                              description: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsProposalDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          // Create new proposal
                          const newProposalObj: Proposal = {
                            id: `prop_${Date.now()}`,
                            title: newProposal.title,
                            description: newProposal.description,
                            createdBy: 1, // Assuming current user is Arjuna (id: 1)
                            createdAt: new Date().toISOString(),
                            expiresAt: new Date(
                              Date.now() + 3 * 24 * 60 * 60 * 1000,
                            ).toISOString(), // 3 days from now
                            status: "active",
                            category: newProposal.category,
                            votes: [],
                            requiredVotes: Math.ceil(members.length / 2), // Majority required
                          };

                          // Add to proposals
                          setProposals([...proposals, newProposalObj]);

                          // Reset form
                          setNewProposal({
                            title: "",
                            description: "",
                            category: "other",
                          });

                          // Close dialog
                          setIsProposalDialogOpen(false);
                        }}
                        disabled={
                          !newProposal.title || !newProposal.description
                        }
                      >
                        Submit Proposal
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="active" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="passed">Passed</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected</TabsTrigger>
                  </TabsList>

                  <TabsContent value="active">
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-4">
                        {proposals
                          .filter((p) => p.status === "active")
                          .map((proposal) => (
                            <Card
                              key={proposal.id}
                              className="overflow-hidden border-l-4"
                              style={{
                                borderLeftColor:
                                  proposal.category === "war"
                                    ? "#ef4444"
                                    : proposal.category === "alliance"
                                      ? "#3b82f6"
                                      : proposal.category === "resource"
                                        ? "#22c55e"
                                        : proposal.category === "diplomacy"
                                          ? "#f59e0b"
                                          : "#6b7280",
                              }}
                            >
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <CardTitle className="text-lg">
                                      {proposal.title}
                                    </CardTitle>
                                    <CardDescription>
                                      Proposed by{" "}
                                      {members.find(
                                        (m) => m.id === proposal.createdBy,
                                      )?.name || "Unknown"}{" "}
                                      •{" "}
                                      {new Date(
                                        proposal.createdAt,
                                      ).toLocaleDateString()}
                                    </CardDescription>
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className="capitalize"
                                  >
                                    {proposal.category}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent className="pb-2">
                                <p className="text-sm text-muted-foreground mb-4">
                                  {proposal.description}
                                </p>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span>
                                      Votes: {proposal.votes.length} of{" "}
                                      {proposal.requiredVotes} required
                                    </span>
                                    <span>
                                      Expires:{" "}
                                      {new Date(
                                        proposal.expiresAt,
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <Progress
                                    value={
                                      (proposal.votes.length /
                                        proposal.requiredVotes) *
                                      100
                                    }
                                    className="h-2"
                                  />

                                  <div className="flex justify-between items-center mt-4">
                                    <div className="flex space-x-2">
                                      <Badge
                                        variant="outline"
                                        className="flex items-center gap-1 bg-green-50"
                                      >
                                        <ThumbsUp className="h-3 w-3 text-green-600" />
                                        <span>
                                          {
                                            proposal.votes.filter(
                                              (v) => v.value === "yes",
                                            ).length
                                          }
                                        </span>
                                      </Badge>
                                      <Badge
                                        variant="outline"
                                        className="flex items-center gap-1 bg-red-50"
                                      >
                                        <ThumbsDown className="h-3 w-3 text-red-600" />
                                        <span>
                                          {
                                            proposal.votes.filter(
                                              (v) => v.value === "no",
                                            ).length
                                          }
                                        </span>
                                      </Badge>
                                      <Badge
                                        variant="outline"
                                        className="flex items-center gap-1 bg-gray-50"
                                      >
                                        <AlertCircle className="h-3 w-3 text-gray-600" />
                                        <span>
                                          {
                                            proposal.votes.filter(
                                              (v) => v.value === "abstain",
                                            ).length
                                          }
                                        </span>
                                      </Badge>
                                    </div>

                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() =>
                                            setSelectedProposal(proposal)
                                          }
                                          disabled={proposal.votes.some(
                                            (v) => v.memberId === 1,
                                          )} // Disable if current user (Arjuna) already voted
                                        >
                                          {proposal.votes.some(
                                            (v) => v.memberId === 1,
                                          )
                                            ? "Voted"
                                            : "Cast Vote"}
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>
                                            Vote on Proposal
                                          </DialogTitle>
                                          <DialogDescription>
                                            {proposal.title}
                                          </DialogDescription>
                                        </DialogHeader>
                                        <div className="py-4">
                                          <p className="text-sm mb-4">
                                            {proposal.description}
                                          </p>
                                          <div className="space-y-2">
                                            <label className="text-sm font-medium">
                                              Your Vote
                                            </label>
                                            <Select
                                              defaultValue="yes"
                                              onValueChange={(value) =>
                                                setVoteValue(value as VoteValue)
                                              }
                                            >
                                              <SelectTrigger>
                                                <SelectValue placeholder="Select your vote" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="yes">
                                                  Approve
                                                </SelectItem>
                                                <SelectItem value="no">
                                                  Reject
                                                </SelectItem>
                                                <SelectItem value="abstain">
                                                  Abstain
                                                </SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                        </div>
                                        <DialogFooter>
                                          <Button variant="outline">
                                            Cancel
                                          </Button>
                                          <Button
                                            onClick={() => {
                                              if (!selectedProposal) return;

                                              // Create new vote
                                              const newVote: Vote = {
                                                id: `vote_${Date.now()}`,
                                                proposalId: selectedProposal.id,
                                                memberId: 1, // Assuming current user is Arjuna (id: 1)
                                                value: voteValue,
                                                timestamp:
                                                  new Date().toISOString(),
                                              };

                                              // Add vote to proposal
                                              setProposals(
                                                proposals.map((p) =>
                                                  p.id === selectedProposal.id
                                                    ? {
                                                        ...p,
                                                        votes: [
                                                          ...p.votes,
                                                          newVote,
                                                        ],
                                                      }
                                                    : p,
                                                ),
                                              );
                                            }}
                                          >
                                            Submit Vote
                                          </Button>
                                        </DialogFooter>
                                      </DialogContent>
                                    </Dialog>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}

                        {proposals.filter((p) => p.status === "active")
                          .length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            <VoteIcon className="h-12 w-12 mx-auto mb-2 opacity-20" />
                            <p>No active proposals</p>
                            <p className="text-sm">
                              Create a new proposal for the alliance to vote on
                            </p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="passed">
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-4">
                        {proposals
                          .filter((p) => p.status === "passed")
                          .map((proposal) => (
                            <Card
                              key={proposal.id}
                              className="overflow-hidden border-l-4 border-l-green-500"
                            >
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <CardTitle className="text-lg">
                                        {proposal.title}
                                      </CardTitle>
                                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    </div>
                                    <CardDescription>
                                      Proposed by{" "}
                                      {members.find(
                                        (m) => m.id === proposal.createdBy,
                                      )?.name || "Unknown"}{" "}
                                      •{" "}
                                      {new Date(
                                        proposal.createdAt,
                                      ).toLocaleDateString()}
                                    </CardDescription>
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className="capitalize"
                                  >
                                    {proposal.category}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-muted-foreground">
                                  {proposal.description}
                                </p>

                                <div className="flex justify-between items-center mt-4">
                                  <div className="flex space-x-2">
                                    <Badge
                                      variant="outline"
                                      className="flex items-center gap-1 bg-green-50"
                                    >
                                      <ThumbsUp className="h-3 w-3 text-green-600" />
                                      <span>
                                        {
                                          proposal.votes.filter(
                                            (v) => v.value === "yes",
                                          ).length
                                        }
                                      </span>
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="flex items-center gap-1 bg-red-50"
                                    >
                                      <ThumbsDown className="h-3 w-3 text-red-600" />
                                      <span>
                                        {
                                          proposal.votes.filter(
                                            (v) => v.value === "no",
                                          ).length
                                        }
                                      </span>
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="flex items-center gap-1 bg-gray-50"
                                    >
                                      <AlertCircle className="h-3 w-3 text-gray-600" />
                                      <span>
                                        {
                                          proposal.votes.filter(
                                            (v) => v.value === "abstain",
                                          ).length
                                        }
                                      </span>
                                    </Badge>
                                  </div>

                                  <Button variant="outline" size="sm">
                                    View Details
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}

                        {proposals.filter((p) => p.status === "passed")
                          .length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            <CheckCircle2 className="h-12 w-12 mx-auto mb-2 opacity-20" />
                            <p>No passed proposals</p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="rejected">
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-4">
                        {proposals
                          .filter((p) => p.status === "rejected")
                          .map((proposal) => (
                            <Card
                              key={proposal.id}
                              className="overflow-hidden border-l-4 border-l-red-500"
                            >
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <CardTitle className="text-lg">
                                        {proposal.title}
                                      </CardTitle>
                                      <XCircle className="h-4 w-4 text-red-600" />
                                    </div>
                                    <CardDescription>
                                      Proposed by{" "}
                                      {members.find(
                                        (m) => m.id === proposal.createdBy,
                                      )?.name || "Unknown"}{" "}
                                      •{" "}
                                      {new Date(
                                        proposal.createdAt,
                                      ).toLocaleDateString()}
                                    </CardDescription>
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className="capitalize"
                                  >
                                    {proposal.category}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-muted-foreground">
                                  {proposal.description}
                                </p>

                                <div className="flex justify-between items-center mt-4">
                                  <div className="flex space-x-2">
                                    <Badge
                                      variant="outline"
                                      className="flex items-center gap-1 bg-green-50"
                                    >
                                      <ThumbsUp className="h-3 w-3 text-green-600" />
                                      <span>
                                        {
                                          proposal.votes.filter(
                                            (v) => v.value === "yes",
                                          ).length
                                        }
                                      </span>
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="flex items-center gap-1 bg-red-50"
                                    >
                                      <ThumbsDown className="h-3 w-3 text-red-600" />
                                      <span>
                                        {
                                          proposal.votes.filter(
                                            (v) => v.value === "no",
                                          ).length
                                        }
                                      </span>
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="flex items-center gap-1 bg-gray-50"
                                    >
                                      <AlertCircle className="h-3 w-3 text-gray-600" />
                                      <span>
                                        {
                                          proposal.votes.filter(
                                            (v) => v.value === "abstain",
                                          ).length
                                        }
                                      </span>
                                    </Badge>
                                  </div>

                                  <Button variant="outline" size="sm">
                                    View Details
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}

                        {proposals.filter((p) => p.status === "rejected")
                          .length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            <XCircle className="h-12 w-12 mx-auto mb-2 opacity-20" />
                            <p>No rejected proposals</p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default DewanRaja;
