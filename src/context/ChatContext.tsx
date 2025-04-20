import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { API_URL, SOCKET_URL } from '../config';

interface Message {
  _id: string;
  sender: string;
  recipient: string;
  content: string;
  read: boolean;
  createdAt: string;
}

interface Conversation {
  _id: string;
  username: string;
  profilePicture: string;
  status: string;
  lastMessage: Message;
  unreadCount: number;
}

interface User {
  _id: string;
  username: string;
  profilePicture: string;
  status: string;
}

interface ChatContextType {
  socket: Socket | null;
  conversations: Conversation[];
  currentChat: { messages: Message[]; user: User | null } | null;
  userTyping: { userId: string; isTyping: boolean } | null;
  onlineUsers: Record<string, boolean>;
  loadConversations: () => Promise<void>;
  loadMessages: (userId: string) => Promise<void>;
  sendMessage: (content: string, recipientId: string) => Promise<void>;
  setUserTyping: (isTyping: boolean, recipientId: string) => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentChat, setCurrentChat] = useState<{ messages: Message[]; user: User | null } | null>(null);
  const [userTyping, setUserTyping] = useState<{ userId: string; isTyping: boolean } | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({});
  
  const auth = useAuth();

  // Initialize socket connection
  useEffect(() => {
    if (auth.user) {
      const newSocket = io(SOCKET_URL);
      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [auth.user]);

  // Socket events
  useEffect(() => {
    if (!socket || !auth.user) return;

    socket.emit('user_connected', auth.user._id);

    socket.on('user_status', ({ userId, status }) => {
      setOnlineUsers(prev => ({
        ...prev,
        [userId]: status === 'online'
      }));
    });

    socket.on('receive_message', (data) => {
      // Update conversations
      loadConversations();
      
      // Update current chat if we're in the same conversation
      if (currentChat?.user?._id === data.sender) {
        loadMessages(data.sender);
        
        // Mark message as read
        axios.put(
          `${API_URL}/api/messages/read`,
          { messageIds: [data._id] },
          {
            headers: {
              Authorization: `Bearer ${auth.user?.token}`
            }
          }
        );
      }
    });

    socket.on('typing', (data) => {
      if (data.sender !== auth.user._id) {
        setUserTyping({ userId: data.sender, isTyping: data.isTyping });
        
        // Clear typing indicator after 3 seconds
        if (data.isTyping) {
          setTimeout(() => {
            setUserTyping(prev => 
              prev?.userId === data.sender ? { userId: data.sender, isTyping: false } : prev
            );
          }, 3000);
        }
      }
    });

    return () => {
      socket.off('receive_message');
      socket.off('user_status');
      socket.off('typing');
    };
  }, [socket, auth.user, currentChat]);

  const loadConversations = async () => {
    try {
      if (!auth.user) return;

      const { data } = await axios.get(`${API_URL}/api/messages/conversations`, {
        headers: {
          Authorization: `Bearer ${auth.user.token}`
        }
      });

      setConversations(data);
      
      // Update online users status
      const onlineStatus: Record<string, boolean> = {};
      data.forEach((conversation: Conversation) => {
        onlineStatus[conversation._id] = conversation.status === 'online';
      });
      setOnlineUsers(onlineStatus);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadMessages = async (userId: string) => {
    try {
      if (!auth.user) return;

      const userResponse = await axios.get(`${API_URL}/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${auth.user.token}`
        }
      });

      const messagesResponse = await axios.get(`${API_URL}/api/messages/conversation/${userId}`, {
        headers: {
          Authorization: `Bearer ${auth.user.token}`
        }
      });

      setCurrentChat({
        user: userResponse.data,
        messages: messagesResponse.data
      });
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async (content: string, recipientId: string) => {
    try {
      if (!auth.user || !socket) return;

      const { data } = await axios.post(
        `${API_URL}/api/messages`,
        { recipient: recipientId, content },
        {
          headers: {
            Authorization: `Bearer ${auth.user.token}`
          }
        }
      );

      // Emit socket event
      socket.emit('send_message', {
        _id: data._id,
        sender: auth.user._id,
        senderName: auth.user.username,
        senderProfilePic: auth.user.profilePicture,
        receiverId: recipientId,
        content,
        createdAt: data.createdAt
      });

      // Update current conversation
      if (currentChat?.user?._id === recipientId) {
        loadMessages(recipientId);
      }

      // Update conversations list
      loadConversations();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const setTypingStatus = (isTyping: boolean, recipientId: string) => {
    if (!auth.user || !socket) return;

    socket.emit('typing', {
      sender: auth.user._id,
      receiverId: recipientId,
      isTyping
    });
  };

  return (
    <ChatContext.Provider
      value={{
        socket,
        conversations,
        currentChat,
        userTyping,
        onlineUsers,
        loadConversations,
        loadMessages,
        sendMessage,
        setUserTyping: setTypingStatus
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};