import React from 'react';

interface UserListItemProps {
  user: {
    _id: string;
    username: string;
    profilePicture?: string;
    isOnline: boolean;
  };
  lastMessage?: string;
  time?: string;
  unreadCount?: number;
}

const UserListItem: React.FC<UserListItemProps> = ({
  user,
  lastMessage,
  time,
  unreadCount = 0
}) => {
  return (
    <div className="flex w-full">
      <div className="relative flex-shrink-0">
        {user.profilePicture ? (
          <img
            src={user.profilePicture}
            alt={user.username}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
            {user.username.charAt(0).toUpperCase()}
          </div>
        )}
        {user.isOnline && (
          <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white"></span>
        )}
      </div>
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-900 truncate">
            {user.username}
          </p>
          {time && (
            <p className="text-xs text-gray-500">{time}</p>
          )}
        </div>
        <div className="flex items-center justify-between">
          {lastMessage && (
            <p className="text-xs text-gray-500 truncate">
              {lastMessage.length > 30 ? `${lastMessage.substring(0, 30)}...` : lastMessage}
            </p>
          )}
          {unreadCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-600 rounded-full">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserListItem;