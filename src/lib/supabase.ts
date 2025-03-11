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
                  last_sign_in: new Date().toISOString(),
                  user_metadata: { name: 'Admin User', isAdmin: true, role: 'admin' },
                  app_metadata: { provider: 'google' }
                },
                {
                  id: '2',
                  email: 'user@example.com',
                  created_at: new Date().toISOString(),
                  last_sign_in: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                  user_metadata: { name: 'Regular User', isAdmin: false, role: 'user' },
                  app_metadata: { provider: 'email' }
                },
                {
                  id: '3',
                  email: 'banned@example.com',
                  created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                  last_sign_in: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                  user_metadata: { name: 'Banned User', isAdmin: false, role: 'user', banned: true },
                  app_metadata: { provider: 'github' }
                },
                {
                  id: '4',
                  email: 'pritamrouth2003@gmail.com',
                  created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                  last_sign_in: new Date().toISOString(),
                  user_metadata: { name: 'Pritam Routh', isAdmin: true, role: 'admin' },
                  app_metadata: { provider: 'google' }
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
      }),
      rpc: (fnName: string, params?: any) => ({
        then: (callback: Function) => {
          if (fnName === 'is_admin') {
            // Check if the user is admin based on the email in params
            const isAdmin = params?.email === ADMIN_EMAIL || 
                          params?.email === 'admin@example.com';
            return callback({ data: isAdmin, error: null });
          }
          if (fnName === 'get_all_user_data') {
            // Simulating fetching all user data (only returns if admin)
            if (params?.requestor_email === ADMIN_EMAIL || 
                params?.requestor_email === 'admin@example.com') {
              return callback({ 
                data: [
                  {
                    id: '1',
                    email: 'admin@example.com',
                    name: 'Admin User',
                    role: 'admin',
                    created_at: new Date().toISOString(),
                    last_sign_in: new Date().toISOString(),
                    app_metadata: { provider: 'email' },
                    user_metadata: { isAdmin: true, role: 'admin' }
                  },
                  {
                    id: '2',
                    email: 'user@example.com',
                    name: 'Regular User',
                    role: 'user',
                    created_at: new Date().toISOString(),
                    last_sign_in: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                    app_metadata: { provider: 'email' },
                    user_metadata: { isAdmin: false, role: 'user' }
                  },
                  {
                    id: '3',
                    email: 'banned@example.com',
                    name: 'Banned User',
                    role: 'user',
                    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                    last_sign_in: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                    app_metadata: { provider: 'email' },
                    user_metadata: { isAdmin: false, role: 'user', banned: true }
                  },
                  {
                    id: '4',
                    email: 'pritamrouth2003@gmail.com',
                    name: 'Pritam Routh',
                    role: 'admin',
                    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                    last_sign_in: new Date().toISOString(),
                    app_metadata: { provider: 'google' },
                    user_metadata: { isAdmin: true, role: 'admin' }
                  }
                ],
                error: null
              });
            } else {
              return callback({ 
                data: null, 
                error: { message: 'Unauthorized. Only admins can access all user data.' } 
              });
            }
          }
          return callback({ data: null, error: null });
        }
      })
    };
  }
  return createClient(supabaseUrl, supabaseKey);
})();

// Additional functions for user management
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

// New function to get all user data (only available to admins)
export const getAllUserData = async (requestorEmail: string) => {
  try {
    const { data, error } = await supabase.rpc('get_all_user_data', {
      requestor_email: requestorEmail
    });

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error fetching all user data:', error.message);
    throw error;
  }
};
