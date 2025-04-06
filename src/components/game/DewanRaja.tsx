import React, { useState } from "react";
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
} from "lucide-react";

const DewanRaja = () => {
  // Mock data for alliance members
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
    },
  ]);

  // Mock data for alliance chat
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Arjuna",
      message: "We should coordinate an attack on the northern kingdoms.",
      time: "10:15 AM",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjuna",
    },
    {
      id: 2,
      sender: "Kresna",
      message: "I agree. My troops will be ready in 2 hours.",
      time: "10:18 AM",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kresna",
    },
    {
      id: 3,
      sender: "Bima",
      message: "I can provide 500 cavalry units for the attack.",
      time: "10:25 AM",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bima",
    },
    {
      id: 4,
      sender: "Arjuna",
      message:
        "Perfect. Let's meet at the war council at noon to finalize the strategy.",
      time: "10:30 AM",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjuna",
    },
  ]);

  // Mock data for alliance wars
  const [wars, setWars] = useState([
    {
      id: 1,
      enemy: "Kurawa Alliance",
      status: "Active",
      startDate: "2 days ago",
      endDate: "3 days remaining",
      victories: 5,
      defeats: 2,
    },
    {
      id: 2,
      enemy: "Astina Federation",
      status: "Preparing",
      startDate: "Starts in 1 day",
      endDate: "7 days duration",
      victories: 0,
      defeats: 0,
    },
  ]);

  // State for new message
  const [newMessage, setNewMessage] = useState("");

  // Mock function to send message
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
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  return (
    <div className="bg-background min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dewan Raja (Royal Council)</h1>
          <Badge className="text-lg py-1 px-3 bg-blue-600">
            <Crown className="h-4 w-4 mr-2" /> Pandawa Alliance
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
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
          <Card>
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
          <Card>
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
        </div>

        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="chat">Alliance Chat</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="wars">Alliance Wars</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-6">
            <Card className="h-[600px] flex flex-col">
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
                          className={`rounded-lg p-3 ${msg.sender === "Arjuna" ? "bg-blue-500 text-white" : "bg-muted"}`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium text-sm">
                              {msg.sender}
                            </span>
                            <span className="text-xs opacity-70">
                              {msg.time}
                            </span>
                          </div>
                          <p>{msg.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <CardFooter className="p-4 pt-2">
                <div className="flex w-full gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={sendMessage}>
                    <MessageSquare className="h-4 w-4 mr-2" /> Send
                  </Button>
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
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
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
                            <p className="font-medium">{member.name}</p>
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
                <Button className="w-full">
                  <Flag className="h-4 w-4 mr-2" /> Declare New War
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default DewanRaja;
