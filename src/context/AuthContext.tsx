import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase, ADMIN_EMAIL } from '../lib/supabase';
import { toast } from '../hooks/use-toast';
import { Session, User } from '@supabase/supabase-js';

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
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.warn('Auth session error:', error.message);
        }

        if (initialSession) {
          setSession(initialSession);
          setUser(initialSession.user);
          
          // Log user roles
          const userMetadata = initialSession.user.user_metadata;
          const role = userMetadata?.role;

          // Check if user is admin
          if (initialSession.user) {
            if (initialSession.user.email === ADMIN_EMAIL) {
              console.log('User is admin via ADMIN_EMAIL match');
              setIsAdmin(true);
            } else {
              const isAdminFromTable = role === 'admin';
              console.log(`User admin status from table: ${isAdminFromTable}`);
              setIsAdmin(isAdminFromTable);
            }
          }
        }

        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
              setSession(newSession);
              setUser(newSession?.user || null);
              
              const userMetadata = newSession.user.user_metadata;
              const role = userMetadata?.role;

              if (newSession?.user) {
                const isAdminUser = 
                  newSession.user.email === ADMIN_EMAIL ||
                  newSession.user.user_metadata?.role === 'admin' ||
                  newSession.user.user_metadata?.isAdmin === true;
                
                if (isAdminUser) {
                  console.log('User is admin via metadata check');
                  setIsAdmin(true);
                } else {
                  const isAdminFromTable = role === 'admin';
                  console.log(`User admin status from table: ${isAdminFromTable}`);
                  setIsAdmin(isAdminFromTable);
                }
              }
            }
            
            supabase.auth.onAuthStateChange((event, session) => {
              if (event === 'SIGNED_IN') {
                setSession(session);
                setUser(session?.user || null);
              }
              if (event === 'SIGNED_OUT') {
                setSession(null);
                setUser(null);
              }
            });
          }, []);
          
          

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
