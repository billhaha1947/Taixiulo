import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { formatMoney } from '../../utils/helpers';
import { Coins } from 'lucide-react';
import { motion } from 'framer-motion';

const UserProfile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="user-profile">
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="flex items-center gap-4 px-6 py-3 rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 165, 0, 0.05) 100%)',
          border: '2px solid rgba(255, 215, 0, 0.3)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.05)'
        }}
      >
        {/* Avatar */}
        <div className="relative">
          <div
            className="w-14 h-14 rounded-full overflow-hidden"
            style={{
              border: '3px solid rgba(255, 215, 0, 0.5)',
              boxShadow: '0 0 15px rgba(255, 215, 0, 0.4)'
            }}
          >
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
              alt={user.username}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Online indicator */}
          <div
            className="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-gray-900"
            style={{
              background: '#00FF00',
              boxShadow: '0 0 8px rgba(0, 255, 0, 0.8)'
            }}
          />
        </div>

        {/* User info */}
        <div className="flex-1">
          {/* Username */}
          <div className="text-sm font-bold text-white mb-1">
            {user.username}
          </div>

          {/* Coins */}
          <div className="flex items-center gap-2">
            <Coins size={16} className="text-yellow-400" />
            <motion.div
              key={user.coins}
              initial={{ scale: 1.2, color: '#FFD700' }}
              animate={{ scale: 1, color: '#FFA500' }}
              className="text-lg font-black"
              style={{
                color: '#FFD700',
                textShadow: '0 0 10px rgba(255, 215, 0, 0.5)'
              }}
            >
              {formatMoney(user.coins || 0)}
            </motion.div>
          </div>
        </div>

        {/* VIP badge (nếu có) */}
        {user.is_admin && (
          <div
            className="px-3 py-1 rounded-full text-xs font-black"
            style={{
              background: 'linear-gradient(135deg, #FF0000 0%, #8B0000 100%)',
              color: '#FFD700',
              border: '1px solid rgba(255, 215, 0, 0.5)',
              boxShadow: '0 0 10px rgba(255, 0, 0, 0.5)'
            }}
          >
            ADMIN
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default UserProfile;
