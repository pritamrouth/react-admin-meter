
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { Card } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  User,
  LogOut,
  Mail,
  Shield,
  Calendar,
  Settings,
  Bell,
  Key,
  Lock
} from 'lucide-react';

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "Error logging out",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  return (
    <SidebarLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <span>Home</span>
          <span className="mx-2">/</span>
          <span>Profile</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-start gap-6">
              <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center">
                <User className="h-12 w-12 text-secondary-foreground" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{user.user_metadata?.name || "User"}</h2>
                <p className="text-gray-500 mb-4">{user.email}</p>
                <div className="flex gap-4">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Edit Profile
                  </Button>
                  <Button variant="destructive" onClick={handleLogout} className="flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="mt-6 p-6">
            <h3 className="text-lg font-semibold mb-4">Profile Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg">
                <Mail className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg">
                <Shield className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Role</p>
                  <p className="text-gray-500 capitalize">{user.user_metadata?.role || "customer"}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Joined</p>
                  <p className="text-gray-500">{new Date(user.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Key className="h-4 w-4" />
                Password
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Lock className="h-4 w-4" />
                Privacy
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Account Status</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Status</span>
                <span className="text-sm font-medium text-green-600">Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Verified</span>
                <span className="text-sm font-medium text-blue-600">Yes</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default Profile;
