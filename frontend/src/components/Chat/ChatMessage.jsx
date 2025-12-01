import React from 'react';
import { formatTime } from '../../utils/helpers';
import { motion } from 'framer-motion';

const ChatMessage = ({ message }) => {
  const { username, avatar, message: text, timestamp } = message;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex gap-3"
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        <img
          src={avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`}
          alt={username}
          className="w-8 h-8 rounded-full border border-gray-600"
        />
      </div>

      {/* Message content */}
      <div className="flex-1 min-w-0">
        {/* Username and time */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-yellow-400">
            {username}
          </span>
          <span className="text-xs text-gray-500">
            {formatTime(timestamp)}
          </span>
        </div>

        {/* Message text */}
        <div 
          className="text-sm text-gray-200 break-words px-3 py-2 rounded-lg"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          {text}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
