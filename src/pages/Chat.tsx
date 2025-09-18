import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import Layout from '../components/Layout';
import ChatMessage from '../components/ChatMessage';
import MessageInput from '../components/MessageInput';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';

const Chat: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    currentChat,
    loadMessages,
    sendMessage,
    userTyping,
    setUserTyping 
  } = useChat();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      loadMessages(id);
    }

    // Set up interval to refresh messages every 10 seconds
    const interval = setInterval(() => {
      if (id) {
        loadMessages(id);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [id, loadMessages]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentChat?.messages]);

  const handleSendMessage = (content: string) => {
    if (id) {
      sendMessage(content, id);
    }
  };

  const handleTyping = (isTyping: boolean) => {
    if (id) {
      setUserTyping(isTyping, id);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col h-full">
        {/* Chat header */}
        <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => navigate('/')}
            className="p-1 mr-2 text-gray-500 dark:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 md:mr-4"
            aria-label="Back"
            title="Back"
          >
            <ArrowLeft size={20} />
          </button>
          
          {currentChat?.user && (
            <div className="flex items-center flex-1">
              <div className="relative">
                {currentChat.user.profilePicture ? (
                  <img
                    src={currentChat.user.profilePicture}
                    alt={currentChat.user.username}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    {currentChat.user.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white ${
                  currentChat.user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                }`}></span>
              </div>
              
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{currentChat.user.username}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {userTyping?.userId === id && userTyping.isTyping 
                    ? 'Typing...' 
                    : currentChat.user.status === 'online'
                      ? 'Online'
                      : 'Offline'
                  }
                </p>
              </div>
            </div>
          )}
          
          <button
            className="p-1 text-gray-500 dark:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="More"
            title="More"
          >
            <MoreVertical size={20} />
          </button>
        </div>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-gray-900">
          {currentChat?.messages && currentChat.messages.length > 0 ? (
            <>
              {currentChat.messages.map((message) => (
                <ChatMessage
                  key={message._id}
                  message={message}
                  senderInfo={{
                    username: message.sender === user?._id 
                      ? user.username 
                      : currentChat.user?.username || '',
                    profilePicture: message.sender === user?._id
                      ? user.profilePicture
                      : currentChat.user?.profilePicture
                  }}
                />
              ))}
              <div ref={messagesEndRef} />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p>No messages yet</p>
              <p className="text-sm">Start a conversation</p>
            </div>
          )}
        </div>
        
        {/* Message input */}
        <MessageInput 
          onSendMessage={handleSendMessage}
          onTyping={handleTyping}
          disabled={!currentChat?.user}
        />
      </div>
    </Layout>
  );
};

export default Chat;