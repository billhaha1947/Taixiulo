import React from 'react';
import { useGame } from '../../hooks/useGame';
import { useAuth } from '../../hooks/useAuth';
import { formatMoney } from '../../utils/helpers';
import { GAME_STATUS } from '../../utils/constants';
import { motion } from 'framer-motion';

const BettingPanel = ({ selectedChip, onBetClick }) => {
  const { currentBet, gameStatus } = useGame();
  const { user } = useAuth();

  const isOpen = gameStatus === GAME_STATUS.OPEN;

  // Button component
  const BetButton = ({ side, label, amount }) => {
    const isActive = amount > 0;
    const bgColor = side === 'tai' ? 
      'linear-gradient(135deg, #FF0000 0%, #8B0000 100%)' : 
      'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)';

    return (
      <motion.button
        whileHover={isOpen ? { scale: 1.02 } : {}}
        whileTap={isOpen ? { scale: 0.98 } : {}}
        onClick={() => isOpen && onBetClick(side)}
        disabled={!isOpen || !selectedChip}
        className={`bet-button relative overflow-hidden ${!isOpen && 'opacity-50 cursor-not-allowed'}`}
        style={{
          background: bgColor,
          borderRadius: '20px',
          padding: '20px',
          border: '3px solid rgba(255, 215, 0, 0.5)',
          boxShadow: isActive ? 
            '0 0 30px rgba(255, 215, 0, 0.8), inset 0 0 20px rgba(255, 215, 0, 0.2)' :
            '0 0 15px rgba(255, 215, 0, 0.3)',
          transition: 'all 0.3s ease',
          minWidth: '200px',
          minHeight: '150px'
        }}
      >
        {/* Glow effect khi active */}
        {isActive && (
          <div 
            className="absolute inset-0 animate-pulse"
            style={{
              background: 'radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%)',
              pointerEvents: 'none'
            }}
          />
        )}

        {/* Label TÀI/XỈU */}
        <div className="relative z-10">
          <div className={`text-6xl font-black mb-3 ${
            side === 'tai' ? 'text-white neon-gold' : 'text-white'
          }`}>
            {label}
          </div>

          {/* Total bet amount */}
          <div className="text-2xl font-bold text-yellow-400 mb-2">
            {formatMoney(amount)}
          </div>

          {/* ĐẶT CƯỢC button */}
          {isOpen && (
            <div 
              className="mt-3 px-6 py-2 rounded-lg text-sm font-bold"
              style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                color: '#000',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)'
              }}
            >
              ĐẶT CƯỢC
            </div>
          )}

          {/* Locked state */}
          {!isOpen && (
            <div className="mt-3 text-sm font-medium text-gray-400">
              {gameStatus === GAME_STATUS.LOCKED ? 'ĐÃ KHÓA' : 'CHỜ VÒNG MỚI'}
            </div>
          )}
        </div>
      </motion.button>
    );
  };

  return (
    <div className="betting-panel">
      {/* Container với 2 nút TÀI và XỈU */}
      <div className="flex items-center justify-center gap-8 px-8">
        {/* Nút TÀI */}
        <BetButton 
          side="tai" 
          label="TÀI" 
          amount={currentBet.tai}
        />

        {/* Nút XỈU */}
        <BetButton 
          side="xiu" 
          label="XỈU" 
          amount={currentBet.xiu}
        />
      </div>

      {/* User balance display */}
      <div className="text-center mt-6">
        <div className="inline-block px-6 py-3 rounded-lg"
          style={{
            background: 'rgba(0, 0, 0, 0.6)',
            border: '2px solid rgba(255, 215, 0, 0.3)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <div className="text-sm text-gray-400 mb-1">Số dư khả dụng</div>
          <div className="text-2xl font-bold text-yellow-400">
            {formatMoney(user?.coins || 0)}
          </div>
        </div>
      </div>

      {/* Guide text */}
      {isOpen && (
        <div className="text-center mt-4 text-sm text-gray-400">
          <p>Chọn chip bên dưới và click TÀI hoặc XỈU để đặt cược</p>
        </div>
      )}
    </div>
  );
};

export default BettingPanel;
