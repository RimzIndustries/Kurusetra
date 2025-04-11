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
  lastKingdomVisit?: string;
  lastBuildingVisit?: string;
  lastResourcesVisit?: string;
  lastMilitaryVisit?: string;
  lastAllianceVisit?: string;
  lastCombatVisit?: string;
  lastMapVisit?: string;
  lastProfileVisit?: string;
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
  updateNavigationTimestamp: (page: string) => Promise<void>;
  getNavigationStats: () => Promise<Record<string, any> | null>;
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
          "race, kingdom_name, zodiac, specialty, kingdom_description, kingdom_motto, kingdom_capital, last_kingdom_visit, last_building_visit, last_resources_visit, last_military_visit, last_alliance_visit, last_combat_visit, last_map_visit, last_profile_visit",
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
          lastKingdomVisit: profileData.last_kingdom_visit,
          lastBuildingVisit: profileData.last_building_visit,
          lastResourcesVisit: profileData.last_resources_visit,
          lastMilitaryVisit: profileData.last_military_visit,
          lastAllianceVisit: profileData.last_alliance_visit,
          lastCombatVisit: profileData.last_combat_visit,
          lastMapVisit: profileData.last_map_visit,
          lastProfileVisit: profileData.last_profile_visit,
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

        // Update last login time and reset navigation timestamps in user_registrations table
        if (response.data?.user?.id) {
          const timestamp = new Date().toISOString();
          const { error: updateError } = await supabase
            .from("user_registrations")
            .update({
              last_login: timestamp,
              updated_at: timestamp,
              // Reset all navigation timestamps to current time on login
              last_kingdom_visit: timestamp,
              last_building_visit: timestamp,
              last_resources_visit: timestamp,
              last_military_visit: timestamp,
              last_alliance_visit: timestamp,
              last_combat_visit: timestamp,
              last_map_visit: timestamp,
              last_profile_visit: timestamp,
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
        const timestamp = new Date().toISOString();

        // Create an initial empty profile in the database
        const { error: profileError } = await supabase
          .from("user_profiles")
          .upsert(
            {
              user_id: response.data.user.id,
              created_at: timestamp,
              updated_at: timestamp,
            },
            { onConflict: "user_id" },
          );

        if (profileError) {
          console.error("Error creating initial user profile:", profileError);
        } else {
          console.log("Initial user profile created successfully");

          // Fetch the newly created profile to update local state
          await fetchUserProfile(response.data.user.id);
        }

        // Also store registration data in the user_registrations table
        const { error: registrationError } = await supabase
          .from("user_registrations")
          .upsert(
            {
              user_id: response.data.user.id,
              email: email,
              registered_at: timestamp,
              last_login: timestamp,
              registration_source: "web",
              created_at: timestamp,
              updated_at: timestamp,
              // Initialize navigation timestamps
              last_kingdom_visit: timestamp,
              last_building_visit: timestamp,
              last_resources_visit: timestamp,
              last_military_visit: timestamp,
              last_alliance_visit: timestamp,
              last_combat_visit: timestamp,
              last_map_visit: timestamp,
              last_profile_visit: timestamp,
              // Initialize navigation counts
              navigation_count_kingdom: 0,
              navigation_count_building: 0,
              navigation_count_resources: 0,
              navigation_count_military: 0,
              navigation_count_alliance: 0,
              navigation_count_combat: 0,
              navigation_count_map: 0,
              navigation_count_profile: 0,
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
      console.log("AuthContext: Attempting to sign out");
      // Clear user state first for immediate UI response
      setUser(null);
      setUserProfile({});

      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
        throw error;
      }
      console.log("User signed out successfully");
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
        last_kingdom_visit:
          profile.lastKingdomVisit || userProfile.lastKingdomVisit,
        last_building_visit:
          profile.lastBuildingVisit || userProfile.lastBuildingVisit,
        last_resources_visit:
          profile.lastResourcesVisit || userProfile.lastResourcesVisit,
        last_military_visit:
          profile.lastMilitaryVisit || userProfile.lastMilitaryVisit,
        last_alliance_visit:
          profile.lastAllianceVisit || userProfile.lastAllianceVisit,
        last_combat_visit:
          profile.lastCombatVisit || userProfile.lastCombatVisit,
        last_map_visit: profile.lastMapVisit || userProfile.lastMapVisit,
        last_profile_visit:
          profile.lastProfileVisit || userProfile.lastProfileVisit,
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
    // Check localStorage first for faster response
    if (localStorage.getItem("setupCompleted") === "true") {
      return true;
    }
    // Then check actual profile data more thoroughly
    const isCompleted = !!(userProfile?.race && userProfile?.kingdomName);
    // If completed, store in localStorage for future checks
    if (isCompleted) {
      localStorage.setItem("setupCompleted", "true");
      console.log("Setup completed, setting localStorage flag");
    }
    return isCompleted;
  };

  const isNewUser = () => {
    return !hasCompletedSetup();
  };

  // Function to update navigation timestamps in user_registrations table
  const updateNavigationTimestamp = async (page: string) => {
    if (!user) return;

    try {
      const timestamp = new Date().toISOString();
      const updateData: Record<string, any> = {
        updated_at: timestamp,
      };

      let countField = "";

      // Map route path to database column
      switch (page) {
        case "/kingdom":
          updateData.last_kingdom_visit = timestamp;
          countField = "navigation_count_kingdom";
          break;
        case "/building":
          updateData.last_building_visit = timestamp;
          countField = "navigation_count_building";
          break;
        case "/resources":
          updateData.last_resources_visit = timestamp;
          countField = "navigation_count_resources";
          break;
        case "/military":
          updateData.last_military_visit = timestamp;
          countField = "navigation_count_military";
          break;
        case "/alliance":
          updateData.last_alliance_visit = timestamp;
          countField = "navigation_count_alliance";
          break;
        case "/combat":
          updateData.last_combat_visit = timestamp;
          countField = "navigation_count_combat";
          break;
        case "/map":
          updateData.last_map_visit = timestamp;
          countField = "navigation_count_map";
          break;
        case "/profile":
          updateData.last_profile_visit = timestamp;
          countField = "navigation_count_profile";
          break;
        default:
          // For other pages, just update the last_login
          updateData.last_login = timestamp;
          break;
      }

      // If we have a count field to update, increment it
      if (countField) {
        // First get the current count
        const { data: currentData, error: fetchError } = await supabase
          .from("user_registrations")
          .select(countField)
          .eq("user_id", user.id)
          .single();

        if (fetchError) {
          console.error("Error fetching current navigation count:", fetchError);
        } else if (currentData) {
          // Increment the count
          updateData[countField] = (currentData[countField] || 0) + 1;
        }
      }

      console.log(`Updating navigation timestamp for ${page}:`, updateData);

      const { error } = await supabase
        .from("user_registrations")
        .update(updateData)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error updating navigation timestamp:", error);
      }
    } catch (error) {
      console.error("Error in updateNavigationTimestamp:", error);
    }
  };

  // Function to get navigation statistics for the current user
  const getNavigationStats = async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from("user_registrations")
        .select(
          `
          last_kingdom_visit, last_building_visit, last_resources_visit, 
          last_military_visit, last_alliance_visit, last_combat_visit, 
          last_map_visit, last_profile_visit, last_login,
          navigation_count_kingdom, navigation_count_building, navigation_count_resources,
          navigation_count_military, navigation_count_alliance, navigation_count_combat,
          navigation_count_map, navigation_count_profile
          `,
        )
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching navigation stats:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error in getNavigationStats:", error);
      return null;
    }
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
    updateNavigationTimestamp,
    getNavigationStats,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook for accessing the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
