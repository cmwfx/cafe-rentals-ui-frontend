
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signIn: (email: string, password: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // Sign up new user
  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          },
        },
      });
      return { data, error };
    } catch (error) {
      return { error, data: null };
    }
  };

  // Sign in existing user
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { data, error };
    } catch (error) {
      return { error, data: null };
    }
  };

  // Sign out user
  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const user = session?.user ?? null;
        setUser(user);
        setIsAdmin(user?.app_metadata?.role === "admin" || false);
        setLoading(false);

        // Redirect based on role when auth state changes
        if (event === "SIGNED_IN") {
          if (user?.app_metadata?.role === "admin") {
            navigate("/admin-dashboard");
          } else {
            navigate("/dashboard");
          }
        } else if (event === "SIGNED_OUT") {
          navigate("/login");
        }
      }
    );

    // Check if user is already logged in
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      setUser(user);
      setIsAdmin(user?.app_metadata?.role === "admin" || false);
      setLoading(false);
    };
    checkUser();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
