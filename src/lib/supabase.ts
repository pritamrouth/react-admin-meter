
import { createClient } from '@supabase/supabase-js';

// Get environment variables with fallbacks for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Define allowed admin emails
export const ADMIN_EMAIL = 'pritamrouth2003@gmail.com';

// Create a single supabase client for interacting with your database
export const supabase = (() => {
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase credentials are missing. Using mock client for development.');
    return {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        getUser: async () => ({ data: { user: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } }, error: null }),
        signInWithPassword: async () => ({ 
          data: { user: null, session: null }, 
          error: { message: 'This is a mock client. Set up Supabase credentials to enable authentication.' } 
        }),
        signUp: async () => ({
          data: { user: null, session: null },
          error: { message: 'This is a mock client. Set up Supabase credentials to enable authentication.' }
        }),
        signOut: async () => ({ error: null }),
        admin: {
          listUsers: async () => ({ 
            data: { 
              users: [
                {
                  id: '1',
                  email: 'admin@example.com',
                  created_at: new Date().toISOString(),
                  user_metadata: { name: 'Admin User', isAdmin: true, role: 'admin' }
                },
                {
                  id: '2',
                  email: 'user@example.com',
                  created_at: new Date().toISOString(),
                  user_metadata: { name: 'Regular User', isAdmin: false, role: 'user' }
                },
                {
                  id: '3',
                  email: 'banned@example.com',
                  created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                  user_metadata: { name: 'Banned User', isAdmin: false, role: 'user', banned: true }
                },
                {
                  id: '4',
                  email: 'pritamrouth2003@gmail.com',
                  created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                  user_metadata: { name: 'Pritam Routh', isAdmin: true, role: 'admin' }
                }
              ]
            }, 
            error: null 
          }),
          deleteUser: async (id) => ({ error: null }),
          updateUserById: async (id, data) => ({ error: null })
        }
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: null }),
            limit: () => ({ data: [], error: null })
          })
        })
      })
    };
  }
  return createClient(supabaseUrl, supabaseKey);
})();

export const signUp = async (email: string, password: string, name?: string, isAdmin = false) => {
  const forceAdmin = email.toLowerCase() === ADMIN_EMAIL;

  const { data, error } = await supabase.auth.signUp({
    email: email.toLowerCase(),
    password,
    options: {
      data: {
        name: name || email.split('@')[0],
        isAdmin: forceAdmin || isAdmin,
        role: forceAdmin ? 'admin' : 'user'
      }
    }
  });

  if (error) {
    throw error;
  }

  return data;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.toLowerCase(),
    password
  });

  if (error) {
    throw error;
  }

  const user = data.user;
  if (user && isUserAdmin(user)) {
    user.role = 'admin';
  }

  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw error;
  }
};

export const getCurrentUser = async () => {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return null;
  }

  const { data: { user } } = await supabase.auth.getUser();

  if (user && isUserAdmin(user)) {
    user.role = 'admin';
  }

  return user;
};

export const isUserAdmin = (user: any) => {
  return (
    user?.email?.toLowerCase() === ADMIN_EMAIL ||
    user?.user_metadata?.isAdmin === true ||
    user?.user_metadata?.role === 'admin'
  );
};
