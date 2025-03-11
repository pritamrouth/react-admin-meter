
import React from 'react';
import { UserListItem } from './UserListItem';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { User } from '@/types/user';

interface UserListProps {
  users: User[];
  loading: boolean;
  isAdmin: boolean;
  onRefresh: () => void;
  onBanUser: (userId: string, isBanned: boolean) => void;
  onDeleteUser: (userId: string) => void;
  onToggleAdmin: (userId: string, makeAdmin: boolean) => void;
  actionLoading: string | null;
}

export const UserList = ({ 
  users, 
  loading, 
  isAdmin, 
  onRefresh, 
  onBanUser, 
  onDeleteUser, 
  onToggleAdmin,
  actionLoading 
}: UserListProps) => {
  return (
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
          onClick={onRefresh}
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
                    <UserListItem
                      key={user.id}
                      user={user}
                      isAdmin={isAdmin}
                      onBanUser={onBanUser}
                      onDeleteUser={onDeleteUser}
                      onToggleAdmin={onToggleAdmin}
                      actionLoading={actionLoading}
                    />
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
  );
};
