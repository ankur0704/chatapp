import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageSquare, Users, Clock } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import UserListItem from './UserListItem';

const Sidebar: React.FC = () => {
  const { conversations, loadConversations, onlineUsers } = useChat();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadConversations();

    // Refresh conversations every 30 seconds
    const interval = setInterval(() => {
      loadConversations();
    }, 30000);

    return () => clearInterval(interval);
  }, [loadConversations]);

  // Determine latest conversation (by lastMessage.createdAt)
  const latestConversation = conversations
    .slice()
    .sort((a: any, b: any) => new Date(b.lastMessage?.createdAt || 0).getTime() - new Date(a.lastMessage?.createdAt || 0).getTime())
  [0];

  const openLatestConversation = () => {
    if (latestConversation?._id) {
      navigate(`/chat/${latestConversation._id}`);
    }
  };

  return (
    <aside className="hidden md:flex md:flex-col w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Messages</h2>
      </div>
      <div className="overflow-y-auto">
        {conversations.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {conversations.map((conversation) => (
              <li
                key={conversation._id}
                className={`hover:bg-gray-50 transition-colors ${location.pathname === `/chat/${conversation._id}` ? 'bg-blue-50 dark:bg-gray-800' : ''
                  }`}
              >
                <button
                  className="w-full px-4 py-3 flex items-start"
                  onClick={() => navigate(`/chat/${conversation._id}`)}
                >
                  <UserListItem
                    user={{
                      _id: conversation._id,
                      username: conversation.username,
                      profilePicture: conversation.profilePicture,
                      isOnline: onlineUsers[conversation._id] || false
                    }}
                    lastMessage={conversation.lastMessage.content}
                    time={new Date(conversation.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    unreadCount={conversation.unreadCount}
                  />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 p-4 text-gray-500">
            <MessageSquare size={32} className="mb-2 text-gray-400" />
            <p className="text-center">No conversations yet</p>
            <p className="text-center text-sm">Start chatting with someone</p>
          </div>
        )}
      </div>
      <div className="mt-auto border-t border-gray-200">
        <nav className="flex items-center justify-around p-2">
          <button
            className={`p-2 transition-colors ${location.pathname === '/' ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'} dark:text-gray-400 dark:hover:text-blue-400`}
            onClick={() => navigate('/')}
            aria-label="People"
            title="People"
          >
            <Users size={20} />
          </button>
          <button
            className={`p-2 transition-colors ${location.pathname.startsWith('/chat') ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'} dark:text-gray-400 dark:hover:text-blue-400`}
            onClick={openLatestConversation}
            disabled={!latestConversation}
            aria-label="Messages"
            title="Messages"
          >
            <MessageSquare size={20} />
          </button>
          <button
            className="p-2 text-gray-500 hover:text-blue-600 transition-colors dark:text-gray-400 dark:hover:text-blue-400"
            onClick={openLatestConversation}
            disabled={!latestConversation}
            aria-label="Recents"
            title="Recents"
          >
            <Clock size={20} />
          </button>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;