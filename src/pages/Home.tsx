import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import UsersList from '../components/UsersList';
import { MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="p-4 h-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.username}!</h1>
          <p className="text-gray-600">Start a conversation with someone</p>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden h-[calc(100%-6rem)]">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <MessageSquare size={20} className="mr-2 text-blue-600" />
              People
            </h2>
          </div>

          <UsersList />
        </div>
      </div>
    </Layout>
  );
};

export default Home;