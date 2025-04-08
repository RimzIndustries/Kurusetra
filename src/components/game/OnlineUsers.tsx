import React, { useState, useEffect, useRef } from "react";
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
  Send,
  Bell,
  BellOff,
  UserPlus,
  UserMinus,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const OnlineUsers = () => {
  const {
    onlineUsers,
    currentUserStatus,
    setUserStatus,
    sendMessage,
    messages,
    getMessagesWithUser,
    getUserById,
    isUserOnline,
  } = useMultiplayer();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const scrollRef = useRef<HTMLDivElement>(null);

  const selectedUser = selectedUserId
    ? onlineUsers.find((user) => user.id === selectedUserId)
    : null;
  const userMessages = selectedUserId
    ? getMessagesWithUser(selectedUserId)
    : [];

  // Filter users based on active tab
  const filteredUsers = onlineUsers.filter((user) => {
    if (activeTab === "all") return true;
    if (activeTab === "online") return user.status === "online";
    if (activeTab === "away") return user.status === "away";
    return true;
  });

  // Scroll to bottom of messages when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [userMessages]);

  const handleSendMessage = async () => {
    if (selectedUserId && messageInput.trim()) {
      await sendMessage(selectedUserId, messageInput.trim());
      setMessageInput("");
    }
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  return (
    <Card className="bg-neuro-bg border-neuro-primary/20 shadow-neuro-flat overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <span>Online Players</span>
            <Badge
              variant="outline"
              className="ml-2 bg-neuro-bg shadow-neuro-flat"
            >
              {onlineUsers.length}
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={toggleNotifications}
                  >
                    {notificationsEnabled ? (
                      <Bell className="h-4 w-4 text-primary" />
                    ) : (
                      <BellOff className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {notificationsEnabled
                    ? "Disable notifications"
                    : "Enable notifications"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() =>
                      setUserStatus(
                        currentUserStatus === "online" ? "away" : "online",
                      )
                    }
                  >
                    {currentUserStatus === "online" ? (
                      <UserCheck className="h-4 w-4 text-green-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-yellow-500" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {currentUserStatus === "online"
                    ? "Set status to away"
                    : "Set status to online"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <Tabs defaultValue="all" className="mt-2" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="all">All ({onlineUsers.length})</TabsTrigger>
            <TabsTrigger value="online">
              Online ({onlineUsers.filter((u) => u.status === "online").length})
            </TabsTrigger>
            <TabsTrigger value="away">
              Away ({onlineUsers.filter((u) => u.status === "away").length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <AnimatePresence>
          <div className="space-y-3">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <Users className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p>No players found</p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between p-3 rounded-md bg-neuro-bg shadow-neuro-flat border border-neuro-primary/10 neuro-hover neuro-glow"
                  whileHover={{
                    y: -2,
                    boxShadow:
                      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  }}
                  whileTap={{ y: 0 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Shield className="h-6 w-6 text-primary" />
                      </div>
                      <div
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${user.status === "online" ? "bg-green-500" : user.status === "away" ? "bg-yellow-500" : "bg-gray-500"}`}
                      ></div>
                    </div>
                    <div>
                      <p className="font-medium">{user.kingdomName}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground">
                          {user.race}
                        </p>
                        {user.specialty && (
                          <Badge variant="outline" className="text-xs">
                            {user.specialty}
                          </Badge>
                        )}
                        {user.zodiac && (
                          <Badge variant="outline" className="text-xs">
                            {user.zodiac}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`${user.status === "online" ? "border-green-500 text-green-600" : user.status === "away" ? "border-yellow-500 text-yellow-600" : "border-gray-500 text-gray-600"} bg-neuro-bg shadow-neuro-flat text-xs`}
                    >
                      {user.status === "online" ? (
                        <>
                          <UserCheck className="h-3 w-3 mr-1" />
                          Online
                        </>
                      ) : user.status === "away" ? (
                        <>
                          <Clock className="h-3 w-3 mr-1" />
                          Away
                        </>
                      ) : (
                        "Offline"
                      )}
                    </Badge>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-primary/10"
                            onClick={() => setSelectedUserId(user.id)}
                          >
                            <MessageCircle className="h-4 w-4 text-primary" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Send message</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </AnimatePresence>
      </CardContent>

      {/* Chat Dialog */}
      <Dialog
        open={!!selectedUserId}
        onOpenChange={(open) => !open && setSelectedUserId(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold">
                  {selectedUser?.kingdomName || "Kingdom"}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">
                    {selectedUser?.race || "Unknown Race"}
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span
                    className={`text-xs ${selectedUser?.status === "online" ? "text-green-500" : selectedUser?.status === "away" ? "text-yellow-500" : "text-gray-500"}`}
                  >
                    {selectedUser?.status === "online"
                      ? "Online"
                      : selectedUser?.status === "away"
                        ? "Away"
                        : "Offline"}
                  </span>
                </div>
              </div>
              {selectedUser?.specialty && (
                <Badge variant="outline" className="ml-auto">
                  {selectedUser.specialty}
                </Badge>
              )}
              {selectedUser?.zodiac && (
                <Badge variant="outline">{selectedUser.zodiac}</Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          <ScrollArea
            className="h-[350px] p-4 border rounded-md bg-muted/30"
            ref={scrollRef}
          >
            <div className="space-y-4">
              {userMessages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">No messages yet</p>
                  <p className="text-xs">
                    Start a conversation with {selectedUser?.kingdomName}!
                  </p>
                </div>
              ) : (
                userMessages.map((msg, index) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderId === selectedUserId ? "justify-start" : "justify-end"}`}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`max-w-[80%] p-3 rounded-lg ${msg.senderId === selectedUserId ? "bg-muted" : "bg-primary/10"} ${msg.senderId === selectedUserId ? "shadow-md" : "shadow-neuro-flat"}`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-muted-foreground">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          <div className="flex gap-2 mt-3">
            <Input
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 shadow-neuro-flat"
            />
            <Button
              onClick={handleSendMessage}
              type="submit"
              className="shadow-neuro-flat"
              disabled={!messageInput.trim()}
            >
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default OnlineUsers;
