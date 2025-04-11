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

const OnlineUsers = () => {
  const {
    onlineUsers,
    currentUserStatus,
    sendMessage,
    messages,
    getMessagesWithUser,
  } = useMultiplayer();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");

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

  return (
    <Card className="bg-neuro-bg border-neuro-primary/20 shadow-neuro-flat overflow-hidden">
      <CardHeader className="pb-2">
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
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {onlineUsers.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              <Users className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p>No other players online</p>
            </div>
          ) : (
            onlineUsers.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between p-2 rounded-md bg-neuro-bg shadow-neuro-flat border border-neuro-primary/10 neuro-hover neuro-glow"
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${user.status === "online" ? "bg-green-500" : user.status === "away" ? "bg-yellow-500" : "bg-gray-500"}`}
                    ></div>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{user.kingdomName}</p>
                    <p className="text-xs text-muted-foreground">{user.race}</p>
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
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full"
                    onClick={() => setSelectedUserId(user.id)}
                  >
                    <MessageCircle className="h-3 w-3 text-primary" />
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </CardContent>

      {/* Chat Dialog */}
      <Dialog
        open={!!selectedUserId}
        onOpenChange={(open) => !open && setSelectedUserId(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-3 w-3 text-primary" />
              </div>
              <span>{selectedUser?.kingdomName || "Kingdom"}</span>
              <Badge variant="outline" className="ml-1">
                {selectedUser?.race || "Unknown"}
              </Badge>
              <Badge variant="outline" className="ml-1">
                {selectedUser?.specialty || "Unknown"}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="h-[300px] p-4 border rounded-md">
            <div className="space-y-4">
              {userMessages.length === 0 ? (
                <p className="text-center text-muted-foreground text-sm">
                  No messages yet. Start a conversation!
                </p>
              ) : (
                userMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderId === selectedUserId ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${msg.senderId === selectedUserId ? "bg-muted" : "bg-primary/10"}`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          <div className="flex gap-2 mt-2">
            <Input
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} type="submit">
              Send
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default OnlineUsers;
