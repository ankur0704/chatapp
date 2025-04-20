import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  onTyping: (isTyping: boolean) => void;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  onTyping,
  disabled = false 
}) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      
      // Focus input after sending
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Handle typing indicator
    if (!isTyping) {
      setIsTyping(true);
      onTyping(true);
    }
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      onTyping(false);
    }, 2000);
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  return (
    <form 
      onSubmit={handleSubmit} 
      className="border-t p-3 bg-white relative"
    >
      <div className="flex items-end bg-gray-100 rounded-lg overflow-hidden p-1">
        <button
          type="button"
          className="p-2 text-gray-500 rounded-full hover:text-gray-700"
          aria-label="Add emoji"
        >
          <Smile size={20} />
        </button>
        <textarea
          ref={inputRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="block w-full py-2 pl-3 pr-10 bg-gray-100 border-none resize-none focus:ring-0 focus:outline-none"
          rows={1}
          disabled={disabled}
        />
        <button
          type="submit"
          className={`p-2 rounded-full ${
            message.trim() && !disabled
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          disabled={!message.trim() || disabled}
        >
          <Send size={20} />
        </button>
      </div>
    </form>
  );
};

export default MessageInput;