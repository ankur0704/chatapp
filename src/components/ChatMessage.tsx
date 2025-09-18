import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCheck, Check } from 'lucide-react';

interface MessageProps {
  message: {
    _id: string;
    sender: string;
    content: string;
    read: boolean;
    createdAt: string;
  };
  senderInfo?: {
    username: string;
    profilePicture?: string;
  };
}

const ChatMessage: React.FC<MessageProps> = ({ message, senderInfo }) => {
  const { user } = useAuth();
  const isOwnMessage = user?._id === message.sender;
  
  const formattedTime = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-3 px-1`}>
      {!isOwnMessage && (
        <div className="flex-shrink-0 mr-2">
          {senderInfo?.profilePicture ? (
            <img
              className="h-8 w-8 rounded-full object-cover"
              src={senderInfo.profilePicture}
              alt={senderInfo.username}
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
              {senderInfo?.username.charAt(0).toUpperCase() || '?'}
            </div>
          )}
        </div>
      )}
      <div className={`relative max-w-xl px-3 py-2 rounded-2xl shadow ${
        isOwnMessage 
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
      }`}>
        <p className="whitespace-pre-wrap">{message.content}</p>
        <div className={`flex items-center text-[10px] mt-1 ${
          isOwnMessage ? 'text-blue-200 justify-end' : 'text-gray-500 dark:text-gray-400'
        }`}>
          <span>{formattedTime}</span>
          {isOwnMessage && (
            <span className="ml-1">
              {message.read ? (
                <CheckCheck size={14} className="text-blue-200" />
              ) : (
                <Check size={14} className="text-blue-200" />
              )}
            </span>
          )}
        </div>
        <div className={`absolute bottom-0 ${
          isOwnMessage ? 'left-0 -translate-x-1/2' : 'right-0 translate-x-1/2'
        } transform translate-y-1/2 rotate-45 w-2 h-2 ${
          isOwnMessage ? 'bg-blue-600' : 'bg-gray-100 dark:bg-gray-800'
        }`}>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;