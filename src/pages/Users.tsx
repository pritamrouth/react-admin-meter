import React, { useState, useEffect } from 'react';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase, getCurrentUser } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  UserX, 
  Trash2, 
  UserCog,
  RefreshCw,
  CheckCircle,
  XCircle 
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// Define the User interface to match Supabase's response
interface User {
  id: string;
  email: string;
  created_at: string;
  user_metadata: {
    name?: string;
    isAdmin?: boolean;
    role?: string;
    banned?: boolean;
  };
  last_sign_in?: string;
  app_metadata?: {
    provider?: string;
  };
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  const fetchCurrentUser = async () => {
    try {
      const user = await getCurrentUser();
      if (user?.email) {
        setCurrentUserEmail(user.email);
        setIsAdmin(user.user_metadata?.isAdmin || false);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.admin.listUsers();
      
      if (error) throw error;
      
      if (data?.users) {
        setUsers(data.users);
      }
    } catch (error: any) {
      console.error('Error fetching users:', error.message);
      toast({
        title: "Error",
        description: `Failed to load users: ${error.message}`,
        variant: "destructive"
      });
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUserEmail) {
      fetchUsers();
    }
  }, [currentUserEmail]);

  const handleBanUser = async (userId: string, isBanned: boolean) => {
    setActionLoading(userId);
    try {
      const { error } = await supabase.auth.admin.updateUserById(
        userId,
        { user_metadata: { banned: isBanned } }
      );
      
      if (error) throw error;
      
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, user_metadata: { ...user.user_metadata, banned: isBanned } }
          : user
      ));
      
      toast({
        title: "Success",
        description: `User ${isBanned ? 'banned' : 'unbanned'} successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to ${isBanned ? 'ban' : 'unban'} user: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }
    
    setActionLoading(userId);
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      
      if (error) throw error;
      
      setUsers(users.filter(user => user.id !== userId));
      
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to delete user: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleAdmin = async (userId: string, makeAdmin: boolean) => {
    setActionLoading(userId);
    try {
      const { error } = await supabase.auth.admin.updateUserById(
        userId,
        { 
          user_metadata: { 
            isAdmin: makeAdmin,
            role: makeAdmin ? 'admin' : 'user'
          } 
        }
      );
      
      if (error) throw error;
      
      setUsers(users.map(user => 
        user.id === userId 
          ? { 
              ...user, 
              user_metadata: { 
                ...user.user_metadata,
                isAdmin: makeAdmin,
                role: makeAdmin ? 'admin' : 'user'
              } 
            } 
          : user
      ));
      
      toast({
        title: "Success",
        description: `User ${makeAdmin ? 'promoted to admin' : 'demoted from admin'} successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to change admin status: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (email: string) => {
    const name = email.split('@')[0];
    return name
      .split('.')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getProviderInfo = (provider: string | undefined) => {
    switch (provider?.toLowerCase()) {
      case 'google':
        return { name: 'Google', color: 'text-red-600' };
      case 'github':
        return { name: 'GitHub', color: 'text-gray-800' };
      case 'facebook':
        return { name: 'Facebook', color: 'text-blue-600' };
      case 'twitter':
        return { name: 'Twitter', color: 'text-blue-400' };
      default:
        return { name: 'Email', color: 'text-gray-600' };
    }
  };

  return (
    <SidebarLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <span>Dashboard</span>
          <span className="mx-2">/</span>
          <span>Users</span>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            All Users
            {isAdmin && (
              <span className="ml-2 text-xs font-normal text-gray-500">
                (Admin View)
              </span>
            )}
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchUsers}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <RefreshCw className="h-6 w-6 animate-spin text-gray-500" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">USER</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">STATUS</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">ROLE</th>
                    {isAdmin && (
                      <th className="px-4 py-3 text-left font-medium text-gray-500">PROVIDER</th>
                    )}
                    <th className="px-4 py-3 text-left font-medium text-gray-500">JOINED</th>
                    {isAdmin && (
                      <th className="px-4 py-3 text-left font-medium text-gray-500">LAST SIGN IN</th>
                    )}
                    <th className="px-4 py-3 text-right font-medium text-gray-500">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.user_metadata?.name || user.email.split('@')[0]}</div>
                              <div className="text-gray-500 text-xs">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {user.user_metadata?.banned ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <XCircle className="w-3 h-3 mr-1" />
                              Banned
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Active
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {user.user_metadata?.isAdmin ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              <Shield className="w-3 h-3 mr-1" />
                              Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              User
                            </span>
                          )}
                        </td>
                        {isAdmin && (
                          <td className="px-4 py-3">
                            <span className={`text-xs ${getProviderInfo(user.app_metadata?.provider).color}`}>
                              {getProviderInfo(user.app_metadata?.provider).name}
                            </span>
                          </td>
                        )}
                        <td className="px-4 py-3 text-gray-500">
                          {formatDate(user.created_at)}
                        </td>
                        {isAdmin && (
                          <td className="px-4 py-3 text-gray-500">
                            {user.last_sign_in ? formatDate(user.last_sign_in) : 'Never'}
                          </td>
                        )}
                        <td className="px-4 py-3 text-right space-x-2">
                          {!user.user_metadata?.isAdmin && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleAdmin(user.id, true)}
                              disabled={actionLoading === user.id}
                              className="h-8 px-2"
                            >
                              <Shield className="h-4 w-4" />
                              <span className="sr-only">Make Admin</span>
                            </Button>
                          )}
                          
                          {user.user_metadata?.isAdmin && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleAdmin(user.id, false)}
                              disabled={actionLoading === user.id}
                              className="h-8 px-2"
                            >
                              <UserCog className="h-4 w-4" />
                              <span className="sr-only">Remove Admin</span>
                            </Button>
                          )}
                          
                          {!user.user_metadata?.banned ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleBanUser(user.id, true)}
                              disabled={actionLoading === user.id}
                              className="h-8 px-2"
                            >
                              <UserX className="h-4 w-4" />
                              <span className="sr-only">Ban User</span>
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleBanUser(user.id, false)}
                              disabled={actionLoading === user.id}
                              className="h-8 px-2 text-green-600 border-green-200 hover:bg-green-50"
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span className="sr-only">Unban User</span>
                            </Button>
                          )}
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={actionLoading === user.id}
                            className="h-8 px-2 text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={isAdmin ? 7 : 5} className="text-center py-8 text-gray-500">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </SidebarLayout>
  );
};

export default Users;
