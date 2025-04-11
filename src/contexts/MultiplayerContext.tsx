import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import { RealtimeChannel } from "@supabase/supabase-js";

type OnlineUser = {
  id: string;
  username: string;
  kingdomName: string;
  race: string;
  lastSeen: string;
  status: "online" | "offline" | "away";
  specialty?: string;
  zodiac?: string;
};

type Message = {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  message: string;
  timestamp: string;
};

type MultiplayerContextType = {
  onlineUsers: OnlineUser[];
  currentUserStatus: "online" | "offline" | "away";
  setUserStatus: (status: "online" | "offline" | "away") => void;
  sendMessage: (receiverId: string, message: string) => Promise<void>;
  messages: Message[];
  getMessagesWithUser: (userId: string) => Message[];
  getUserById: (userId: string) => OnlineUser | undefined;
  isUserOnline: (userId: string) => boolean;
};

const MultiplayerContext = createContext<MultiplayerContextType | undefined>(
  undefined,
);

export function MultiplayerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, supabase, userProfile } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [currentUserStatus, setCurrentUserStatus] = useState<
    "online" | "offline" | "away"
  >("offline");
  const [presenceChannel, setPresenceChannel] =
    useState<RealtimeChannel | null>(null);
  const [messages, setMessages] = useState<
    Array<{
      id: string;
      senderId: string;
      senderName: string;
      receiverId: string;
      message: string;
      timestamp: string;
    }>
  >([]);

  // Initialize presence channel when user logs in
  useEffect(() => {
    if (!user) return;

    console.log("MultiplayerContext: Initializing presence channel");

    // Create a presence channel for online users
    const channel = supabase.channel("online-users", {
      config: {
        presence: {
          key: user.id,
        },
        broadcast: {
          self: true,
        },
      },
    });

    // Set up presence tracking
    channel
      .on("presence", { event: "sync" }, () => {
        // Get all online users
        const presenceState = channel.presenceState();
        const users: OnlineUser[] = [];

        Object.keys(presenceState).forEach((presenceId) => {
          const userPresence = presenceState[presenceId][0];
          users.push({
            id: userPresence.user_id,
            username: userPresence.username || "Unknown",
            kingdomName: userPresence.kingdom_name || "Unknown Kingdom",
            race: userPresence.race || "Unknown",
            specialty: userPresence.specialty || "Unknown",
            zodiac: userPresence.zodiac || "Unknown",
            lastSeen: new Date().toISOString(),
            status: userPresence.status,
          });
        });

        setOnlineUsers(users);
        console.log("MultiplayerContext: Online users updated", users.length);
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        console.log("User joined:", newPresences[0]?.username);
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        console.log("User left:", leftPresences[0]?.username);
      });

    // Subscribe to the messages channel
    channel.on("broadcast", { event: "message" }, ({ payload }) => {
      if (payload.receiverId === user.id || payload.senderId === user.id) {
        setMessages((prev) => [
          ...prev,
          {
            id: payload.id,
            senderId: payload.senderId,
            senderName: payload.senderName,
            receiverId: payload.receiverId,
            message: payload.message,
            timestamp: payload.timestamp,
          },
        ]);
      }
    });

    // Subscribe to the channel
    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        // Track user presence
        await channel.track({
          user_id: user.id,
          username: user.email?.split("@")[0] || "Unknown",
          kingdom_name: userProfile.kingdomName || "New Kingdom",
          race: userProfile.race || "Unknown",
          specialty: userProfile.specialty || "Unknown",
          zodiac: userProfile.zodiac || "Unknown",
          status: "online",
        });
        setCurrentUserStatus("online");
        console.log("MultiplayerContext: User presence tracked");
      }
    });

    setPresenceChannel(channel);

    // Cleanup on unmount
    return () => {
      channel.unsubscribe();
    };
  }, [user, supabase, userProfile]);

  // Update user status
  const setUserStatus = async (status: "online" | "offline" | "away") => {
    if (!presenceChannel || !user) return;

    await presenceChannel.track({
      user_id: user.id,
      username: user.email?.split("@")[0] || "Unknown",
      kingdom_name: userProfile.kingdomName || "New Kingdom",
      race: userProfile.race || "Unknown",
      specialty: userProfile.specialty || "Unknown",
      zodiac: userProfile.zodiac || "Unknown",
      status,
    });

    setCurrentUserStatus(status);
  };

  // Send a message to another user
  const sendMessage = async (receiverId: string, message: string) => {
    if (!presenceChannel || !user) return;

    const messageData = {
      id: crypto.randomUUID(),
      senderId: user.id,
      senderName: user.email?.split("@")[0] || "Unknown",
      receiverId,
      message,
      timestamp: new Date().toISOString(),
      read: false,
    };

    await presenceChannel.send({
      type: "broadcast",
      event: "message",
      payload: messageData,
    });

    // Add to local messages
    setMessages((prev) => [...prev, messageData]);

    // Show browser notification for new messages if supported
    const receiverUser = onlineUsers.find((u) => u.id === receiverId);
    if (
      "Notification" in window &&
      Notification.permission === "granted" &&
      receiverUser
    ) {
      new Notification(
        `New message from ${userProfile.kingdomName || "Your Kingdom"}`,
        {
          body:
            message.length > 50 ? message.substring(0, 50) + "..." : message,
          icon: "/favicon.ico",
        },
      );
    }
  };

  // Set up automatic away status
  useEffect(() => {
    if (!user) return;

    let inactivityTimer: number;

    const resetTimer = () => {
      if (currentUserStatus === "away") {
        setUserStatus("online");
      }

      clearTimeout(inactivityTimer);
      inactivityTimer = window.setTimeout(
        () => {
          if (currentUserStatus === "online") {
            setUserStatus("away");
            // Show notification if browser supports it
            if (
              "Notification" in window &&
              Notification.permission === "granted"
            ) {
              new Notification("Kurusetra", {
                body: "Your status has been set to away due to inactivity",
                icon: "/favicon.ico",
              });
            }
          }
        },
        3 * 60 * 1000, // 3 minutes of inactivity (reduced from 5)
      );
    };

    // Reset timer on user activity
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);
    window.addEventListener("scroll", resetTimer);

    // Initial timer
    resetTimer();

    // Request notification permission
    if ("Notification" in window && Notification.permission !== "denied") {
      Notification.requestPermission();
    }

    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("scroll", resetTimer);
    };
  }, [user, currentUserStatus]);

  // Set offline status when window is closed/refreshed
  useEffect(() => {
    if (!user) return;

    const handleBeforeUnload = () => {
      setUserStatus("offline");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [user]);

  // Helper functions for working with users and messages
  const getUserById = useCallback(
    (userId: string) => {
      return onlineUsers.find((user) => user.id === userId);
    },
    [onlineUsers],
  );

  const isUserOnline = useCallback(
    (userId: string) => {
      const user = getUserById(userId);
      return user?.status === "online" || user?.status === "away";
    },
    [getUserById],
  );

  const getMessagesWithUser = useCallback(
    (userId: string) => {
      return messages.filter(
        (msg) => msg.senderId === userId || msg.receiverId === userId,
      );
    },
    [messages],
  );

  const value = {
    onlineUsers,
    currentUserStatus,
    setUserStatus,
    sendMessage,
    messages,
    getMessagesWithUser,
    getUserById,
    isUserOnline,
  };

  return (
    <MultiplayerContext.Provider value={value}>
      {children}
    </MultiplayerContext.Provider>
  );
}

// Custom hook must be a named function declaration at the top level for Fast Refresh compatibility
export function useMultiplayer() {
  const context = useContext(MultiplayerContext);
  if (context === undefined) {
    throw new Error("useMultiplayer must be used within a MultiplayerProvider");
  }
  return context;
}
