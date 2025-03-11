
export interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in?: string;
  user_metadata?: {
    name?: string;
    isAdmin?: boolean;
    role?: string;
    banned?: boolean;
  };
  app_metadata?: {
    provider?: string;
  };
}
