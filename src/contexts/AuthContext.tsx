import { createContext, useContext, useEffect, useState } from "react";
import { createClient, SupabaseClient, User } from "@supabase/supabase-js";

type UserProfile = {
  race?: string;
  kingdomName?: string;
  zodiac?: string;
  specialty?: string;
  kingdomDescription?: string;
  kingdomMotto?: string;
  kingdomCapital?: string;
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
  fetchUserProfile: (userId: string) => Promise<boolean>;
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

  // Function to fetch user profile data
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from("user_profiles")
        .select(
          "race, kingdom_name, zodiac, specialty, kingdom_description, kingdom_motto, kingdom_capital",
        )
        .eq("user_id", userId)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        console.error("Error fetching user profile:", profileError);
        return false;
      }

      if (profileData) {
        setUserProfile({
          race: profileData.race,
          kingdomName: profileData.kingdom_name,
          zodiac: profileData.zodiac,
          specialty: profileData.specialty,
          kingdomDescription: profileData.kingdom_description,
          kingdomMotto: profileData.kingdom_motto,
          kingdomCapital: profileData.kingdom_capital,
        });
        console.log("AuthContext: User profile loaded", !!profileData);
        return true;
      } else {
        // If no profile data, create an empty profile
        setUserProfile({});
        return false;
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return false;
    }
  };

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
          await fetchUserProfile(currentUser.id);
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
            await fetchUserProfile(currentUser.id);
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

        // Update last login time in user_registrations table
        if (response.data?.user?.id) {
          const { error: updateError } = await supabase
            .from("user_registrations")
            .update({
              last_login: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", response.data.user.id);

          if (updateError) {
            console.error("Error updating last login time:", updateError);
          }
        }
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
    try {
      const response = await supabase.auth.signUp({ email, password });

      // If signup is successful and we have a user, create an initial profile
      if (response.data?.user?.id && !response.error) {
        // Create an initial empty profile in the database
        const { error: profileError } = await supabase
          .from("user_profiles")
          .upsert(
            {
              user_id: response.data.user.id,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" },
          );

        if (profileError) {
          console.error("Error creating initial user profile:", profileError);
        } else {
          console.log("Initial user profile created successfully");
        }

        // Also store registration data in the user_registrations table
        const { error: registrationError } = await supabase
          .from("user_registrations")
          .upsert(
            {
              user_id: response.data.user.id,
              email: email,
              registered_at: new Date().toISOString(),
              last_login: new Date().toISOString(),
              registration_source: "web",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" },
          );

        if (registrationError) {
          console.error(
            "Error storing user registration data:",
            registrationError,
          );
        } else {
          console.log("User registration data stored successfully");
        }
      }

      return {
        data: response.data,
        error: response.error,
      };
    } catch (error) {
      console.error("Unexpected error during sign up:", error);
      return {
        data: null,
        error:
          error instanceof Error
            ? error
            : new Error("An unexpected error occurred during sign up"),
      };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
        throw error;
      }
      console.log("User signed out successfully");
      // Clear user state
      setUser(null);
      setUserProfile({});
    } catch (error) {
      console.error("Error during sign out:", error);
      throw error;
    }
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
        kingdom_description:
          profile.kingdomDescription || userProfile.kingdomDescription,
        kingdom_motto: profile.kingdomMotto || userProfile.kingdomMotto,
        kingdom_capital: profile.kingdomCapital || userProfile.kingdomCapital,
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

      // Fetch the updated profile to ensure consistency
      await fetchUserProfile(user.id);
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
    fetchUserProfile,
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
