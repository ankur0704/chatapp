import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import UserListItem from './UserListItem';

interface User {
  _id: string;
  username: string;
  profilePicture: string;
  status: string;
}

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [creatingId, setCreatingId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!user) return;

        const { data } = await axios.get(`${API_URL}/api/users`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });

        setUsers(data);
        setFilteredUsers(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const handleUserClick = (userId: string) => {
    navigate(`/chat/${userId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full p-2 pl-10 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search users"
            title="Search users"
          />
        </div>
      </div>

      <div className="overflow-y-auto flex-1">
        {filteredUsers.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {filteredUsers.map((u) => (
              <li key={u._id} className="hover:bg-gray-50 transition-colors">
                <button
                  className="w-full px-4 py-3 flex items-center justify-between"
                  onClick={() => handleUserClick(u._id)}
                >
                  <UserListItem
                    user={{
                      _id: u._id,
                      username: u.username,
                      profilePicture: u.profilePicture,
                      isOnline: u.status === 'online'
                    }}
                  />
                  <button
                    type="button"
                    className="p-2 rounded-md text-gray-400 hover:text-blue-500"
                    onClick={(e) => { e.stopPropagation();
                      (async () => {
                        try {
                          if (!user) return;
                          setCreatingId(u._id);
                          await axios.post(
                            `${API_URL}/api/friends/request`,
                            { recipientId: u._id },
                            { headers: { Authorization: `Bearer ${user.token}` } }
                          );
                        } catch (err) {
                          console.error('Error sending friend request:', err);
                        } finally {
                          setCreatingId(null);
                        }
                      })();
                    }}
                    disabled={creatingId === u._id}
                    aria-label="Send friend request"
                    title="Send friend request"
                  >
                    {creatingId === u._id ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-t-transparent"></div>
                    ) : (
                      <UserPlus size={18} />
                    )}
                  </button>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 p-4 text-gray-500">
            <UserPlus size={32} className="mb-2 text-gray-400" />
            <p className="text-center">No users found</p>
            {searchTerm && (
              <p className="text-center text-sm">Try a different search term</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersList;