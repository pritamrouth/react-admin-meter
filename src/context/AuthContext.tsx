
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase, ADMIN_EMAIL } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const setupAuth = async () => {
      try {
        // Get initial session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.warn('Auth session error:', error.message);
        }

        if (initialSession) {
          setSession(initialSession);
          setUser(initialSession.user);
          
          // Check if user is admin
          if (initialSession.user) {
            // First check if email matches admin email for quick access
            if (initialSession.user.email === ADMIN_EMAIL) {
              setIsAdmin(true);
            } else {
              try {
                const { data, error } = await supabase
                  .from('user_roles')
                  .select('role')
                  .eq('user_id', initialSession.user.id)
                  .single();
                  
                if (!error && data && data.role === 'admin') {
                  setIsAdmin(true);
                }
              } catch (error) {
                console.warn('Error checking admin status:', error);
              }
            }
          }
        }

        // Listen for auth changes
        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
              setSession(newSession);
              setUser(newSession?.user || null);
              
              // Check if user is admin
              if (newSession?.user) {
                if (newSession.user.email === ADMIN_EMAIL) {
                  setIsAdmin(true);
                } else {
                  try {
                    const { data, error } = await supabase
                      .from('user_roles')
                      .select('role')
                      .eq('user_id', newSession.user.id)
                      .single();
                      
                    if (!error && data && data.role === 'admin') {
                      setIsAdmin(true);
                    } else {
                      setIsAdmin(false);
                    }
                  } catch (error) {
                    console.warn("Error checking admin status:", error);
                    setIsAdmin(false);
                  }
                }
              }
            }
            
            if (event === 'SIGNED_OUT') {
              setSession(null);
              setUser(null);
              setIsAdmin(false);
            }
          }
        );

        setLoading(false);
        
        return () => {
          authListener?.subscription?.unsubscribe();
        };
      } catch (error) {
        console.error('Error setting up auth:', error);
        setLoading(false);
      }
    };

    setupAuth();
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const value = {
    session,
    user,
    loading,
    signOut,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
