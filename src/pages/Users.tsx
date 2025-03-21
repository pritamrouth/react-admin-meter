import React, { useState, useEffect } from 'react';
import { SidebarLayout } from '../components/layout/SidebarLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { supabase, isUserAdmin, fetchRegisteredUsers } from '../lib/supabase';
import { useToast } from '../hooks/use-toast';

import { 
  Shield, 
  UserX, 
  Trash2, 
  UserCog,
  RefreshCw,
  CheckCircle,
  XCircle 
} from 'lucide-react';

interface LocalUser {
  id: string;
  email: string;
  created_at: string;
  user_metadata: {
    name?: string;
    isAdmin?: boolean;
    role?: string;
    banned?: boolean;
  } | null; // Allow user_metadata to be null
}

const Users = () => {
  const [users, setUsers] = useState<LocalUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { toast } = useToast();
  
// Modify the fetchUsers function in Users.tsx
// Modify the fetchUsers function in Users.tsx
const fetchUsers = async () => {
  setLoading(true);
  try {
    const users = await fetchRegisteredUsers();
    setUsers(users.map(user => ({
      ...user,
      user_metadata: user.user_metadata || null
    })));
  } catch (error: any) {
    console.error('Error fetching users:', error.message);
    toast({
      title: "Error",
      description: `Failed to load users: ${error.message}`,
      variant: "destructive"
    });
  } finally {
    setLoading(false);
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
          <CardTitle>All Users</CardTitle>
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
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">USER</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">STATUS</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">ROLE</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">JOINED</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.map((user: LocalUser) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium">{user.user_metadata?.name || 'No Name'}</div>
                          <div className="text-gray-500">{user.email}</div>
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
                        {isUserAdmin(user) || user.user_metadata?.role === 'admin' ? (

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
                      <td className="px-4 py-3 text-gray-500">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        {!isUserAdmin(user) && (
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
                        
                        {isUserAdmin(user) && (
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
                  ))}
                </tbody>
              </table>
              
              {users.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No users found
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </SidebarLayout>
  );
};

export default Users;
