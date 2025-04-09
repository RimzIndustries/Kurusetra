import { createContext, useContext, useEffect, useState } from "react";
import { createClient, SupabaseClient, User } from "@supabase/supabase-js";

type UserProfile = {
  race?: string;
  kingdomName?: string;
  zodiac?: string;
  specialty?: string;
};

type AuthContextType = {
  user: User | null;
  userProfile: UserProfile;
  supabase: SupabaseClient;
  loading: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{
    error: Error | null;
    data: any | null;
  }>;
  signUp: (
    email: string,
    password: string,
  ) => Promise<{
    error: Error | null;
    data: any | null;
  }>;
  signOut: () => Promise<void>;
  updateUserProfile: (profile: UserProfile) => Promise<void>;
  hasCompletedSetup: () => boolean;
  isNewUser: () => boolean;
};

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string,
);

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AuthContext: Initializing auth state");
    // Check for active session on mount
    const getSession = async () => {
      console.log("AuthContext: Getting session");
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        const currentUser = data.session?.user || null;
        setUser(currentUser);
        console.log("AuthContext: User state set", !!currentUser);

        // Fetch user profile data if user is logged in
        if (currentUser) {
          try {
            const { data: profileData, error: profileError } = await supabase
              .from("user_profiles")
              .select("race, kingdom_name, zodiac, specialty")
              .eq("user_id", currentUser.id)
              .single();

            if (profileError && profileError.code !== "PGRST116") {
              console.error("Error fetching user profile:", profileError);
              // Still set loading to false even if there's an error fetching profile
              setLoading(false);
              return;
            }

            if (profileData) {
              setUserProfile({
                race: profileData.race,
                kingdomName: profileData.kingdom_name,
                zodiac: profileData.zodiac,
                specialty: profileData.specialty,
              });
              console.log("AuthContext: User profile loaded", !!profileData);
            } else {
              // If no profile data, still create an empty profile
              setUserProfile({});
            }
          } catch (error) {
            console.error("Error fetching user profile:", error);
          }
        }
      } catch (error) {
        console.error("Session error:", error);
      } finally {
        console.log("AuthContext: Session loaded, setting loading to false");
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    // Set up auth state change listener
    const { data } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log("AuthContext: Auth state changed", _event);
        try {
          const currentUser = session?.user || null;
          setUser(currentUser);

          // Reset user profile if logged out
          if (!currentUser) {
            setUserProfile({});
            setLoading(false); // Make sure to set loading to false when logged out
            return;
          } else {
            // Fetch user profile data if user is logged in
            try {
              const { data: profileData, error: profileError } = await supabase
                .from("user_profiles")
                .select("race, kingdom_name, zodiac, specialty")
                .eq("user_id", currentUser.id)
                .single();

              if (profileError && profileError.code !== "PGRST116") {
                console.error("Error fetching user profile:", profileError);
                // Still set loading to false even if there's an error fetching profile
                setLoading(false);
                return;
              }

              if (profileData) {
                setUserProfile({
                  race: profileData.race,
                  kingdomName: profileData.kingdom_name,
                  zodiac: profileData.zodiac,
                  specialty: profileData.specialty,
                });
              } else {
                // If no profile data, still create an empty profile
                setUserProfile({});
              }
            } catch (error) {
              console.error("Error fetching user profile:", error);
              setLoading(false); // Make sure to set loading to false on error
              return;
            }
          }
        } catch (error) {
          console.error("Auth state change error:", error);
        } finally {
          console.log(
            "AuthContext: Auth state change complete, setting loading to false",
          );
          setLoading(false);
        }
      },
    );

    const subscription = data.subscription;

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log("AuthContext: Attempting to sign in with email", email);
      const response = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (response.error) {
        console.error("AuthContext: Sign in error", response.error);
      } else {
        console.log("AuthContext: Sign in successful");
      }

      return {
        data: response.data,
        error: response.error,
      };
    } catch (error) {
      console.error("AuthContext: Unexpected error during sign in", error);
      return {
        data: null,
        error:
          error instanceof Error
            ? error
            : new Error("An unexpected error occurred during sign in"),
      };
    }
  };

  const signUp = async (email: string, password: string) => {
    const response = await supabase.auth.signUp({ email, password });
    return {
      data: response.data,
      error: response.error,
    };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const updateUserProfile = async (profile: UserProfile) => {
    if (!user) return;

    try {
      // Update local state immediately for a responsive UI
      setUserProfile((prev) => ({ ...prev, ...profile }));

      // Prepare data for database update
      const updateData = {
        user_id: user.id,
        race: profile.race || userProfile.race,
        kingdom_name: profile.kingdomName || userProfile.kingdomName,
        zodiac: profile.zodiac || userProfile.zodiac,
        specialty: profile.specialty || userProfile.specialty,
        updated_at: new Date().toISOString(),
      };

      console.log("Updating user profile in database:", updateData);

      // Update in database
      const { error } = await supabase
        .from("user_profiles")
        .upsert(updateData, { onConflict: "user_id" });

      if (error) {
        console.error("Database error updating profile:", error);
        throw error;
      }

      console.log("User profile updated successfully");
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  };

  const hasCompletedSetup = () => {
    console.log("Checking if setup completed:", userProfile);
    return !!(userProfile?.race && userProfile?.kingdomName);
  };

  const isNewUser = () => {
    return !hasCompletedSetup();
  };

  const value = {
    user,
    userProfile,
    supabase,
    loading,
    signIn,
    signUp,
    signOut,
    updateUserProfile,
    hasCompletedSetup,
    isNewUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook for accessing the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
