import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase, isUserAdmin } from "@/lib/supabase";
import { Mail, Lock, Eye, EyeOff, Building2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import backgroundImage from "@/assets/download.jpg";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
  
    try {
      if (!navigator.onLine) {
        throw new Error('No internet connection');
      }
  
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }

      // Verify session exists
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No session created');
      }

      // Verify user exists
      if (!data.user) {
        throw new Error('No user returned');
      }

      const isAdmin = await isUserAdmin(data.user);
      
      toast({
        title: isAdmin ? "Welcome back Administrator!" : "Welcome back!",
        description: "You have successfully signed in.",
      });

      navigate(isAdmin ? "/dashboard" : "/");

    } catch (error: any) {
      console.error('Authentication error:', error);
      setError(error.message);
      toast({
        title: "Sign in failed",
        description: error.message || 'Authentication failed. Please try again.',
        variant: "destructive",
      });
      // Clear form on error
      setFormData({
        email: '',
        password: ''
      });

    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex justify-center items-center min-h-screen w-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="relative w-[400px] h-[600px] bg-transparent border-2 border-white rounded-[20px] backdrop-blur-[20px] flex justify-center items-center">
        <div className="form-value">
          <form onSubmit={handleSubmit}>
            <div className="flex justify-center mb-4">
              <Building2 className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-2xl text-white text-center mb-8">Admin Login</h2>
            
            <div className="relative my-[30px] w-[310px] border-b-2 border-white">
              <Mail className="absolute left-1 top-5 text-white w-5 h-5" />
              <input
                type="email"
                required
                className="w-full pr-3 py-2 h-[55px] bg-transparent border-none outline-none text-base px-[35px] py-2 text-white"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <label className="absolute top-1 left-[5px] transform -translate-y-1/2 text-white text-base pointer-events-none transition-all duration-500">Email</label>
            </div>

            <div className="relative my-[30px] w-[310px] border-b-2 border-white">
              <Lock className="absolute left-2 top-5 text-white w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="w-full pr-3 py-2 h-[55px] bg-transparent border-none outline-none text-base px-[35px] py-0 text-white"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                className="absolute right-2 top-5"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-white" />
                ) : (
                  <Eye className="h-5 w-5 text-white" />
                )}
              </button>
              <label className="absolute top-1 left-[5px] transform -translate-y-1/2 text-white text-base pointer-events-none transition-all duration-500">Password</label>
            </div>

            <div className="flex justify-between my-[10px] text-sm text-white">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" /> Remember me
              </label>
              <Link to="/forgot-password" className="hover:underline">Forgot password?</Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-[40px] rounded-[40px] bg-white border-none outline-none cursor-pointer text-base font-semibold"
            >
              {isSubmitting ? 'Signing in...' : 'Login'}
            </button>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-1/3 border-t border-white-300" />
                  <div className="w-1/3 absolute right-1 border-t border-white-300"/>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 backdrop-blur-[20px] text-white">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {/* Social login buttons */}
                <button className="w-full inline-flex justify-center py-2 px-4 border border-white rounded-md backdrop-blur-[20px] text-sm font-medium text-white hover:bg-white/10">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                  </svg>
                </button>

                <button className="w-full inline-flex justify-center py-2 px-4 border border-white rounded-md backdrop-blur-[20px] text-sm font-medium text-white hover:bg-white/10">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>

                <button className="w-full inline-flex justify-center py-2 px-4 border border-white rounded-md backdrop-blur-[20px] text-sm font-medium text-white hover:bg-white/10">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* <div className="text-sm text-white text-center mt-[25px] mb-[10px]">
              <p>Don't have an account? <Link to="/signup" className="font-semibold hover:underline">Register</Link></p>
            </div> */}
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignIn;
