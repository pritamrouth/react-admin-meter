import { createClient } from '@supabase/supabase-js';

// Get environment variables with fallbacks for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''; 
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''; 

console.log('Supabase URL:', supabaseUrl); 
console.log('Supabase Key:', supabaseKey); 

// Define allowed admin emails
export const ADMIN_EMAIL = 'pritamrouth2003@gmail.com';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseKey);

// Add this new function to supabase.ts
export const fetchRegisteredUsers = async () => {
  const { data: adminData, error: adminError } = await supabase.auth.admin.listUsers();
  
  if (adminError) {
    // Fallback to RLS-compatible approach
    const { data, error } = await supabase
      .from('all_registered_users')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  }
  
  return adminData.users;
};


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
    password,
  }, {
    persistSession: true // Explicitly enable session persistence
  });

  if (error) {
    console.error('Sign-in error:', error);
    throw error;
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
  console.log('Current user data:', user); 
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

// New function to fetch all registered users
export const fetchAllUsers = async () => {
  const { data, error } = await supabase
      .from('all_registered_users_with_details')
      .select('*');

  if (error) {
    throw error;
  }

  return data;
};

// Fetch all registered users with sign-in time and role
