import React, { useState } from 'react';
import { useGame } from '../../hooks/useGame';
import { useAuth } from '../../hooks/useAuth';
import { placeBet as placeBetSocket } from '../../services/socket';
import { GAME_STATUS } from '../../utils/constants';
import { motion } from 'framer-motion';

const ActionButtons = ({ selectedChip, onClearBet, onAllIn }) => {
  const { currentBet, gameStatus, clearBet } = useGame();
  const { user, updateBalance } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const isOpen = gameStatus === GAME_STATUS.OPEN;
  const hasBets = currentBet.tai > 0 || currentBet.xiu > 0;

  // Handle ALL-IN
  const handleAllIn = () => {
    if (!isOpen || !user?.coins) return;
    onAllIn(user.coins);
    setMessage({ type: 'success', text: 'Đã chọn ALL-IN!' });
    setTimeout(() => setMessage({ type: '', text: '' }), 2000);
  };

  // Handle ĐẶT CƯỢC
  const handlePlaceBet = async () => {
    if (!hasBets || !isOpen) return;

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Place bets for both sides if any
      const promises = [];

      if (currentBet.tai > 0) {
        promises.push(
          new Promise((resolve, reject) => {
            placeBetSocket('tai', currentBet.tai, (result) => {
              if (result.success) resolve(result);
              else reject(new Error(result.error));
            });
          })
        );
      }

      if (currentBet.xiu > 0) {
        promises.push(
          new Promise((resolve, reject) => {
            placeBetSocket('xiu', currentBet.xiu, (result) => {
              if (result.success) resolve(result);
              else reject(new Error(result.error));
            });
          })
        );
      }

      await Promise.all(promises);

      // Success
      setMessage({ type: 'success', text: 'Đặt cược thành công!' });
      clearBet();
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);

    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Đặt cược thất bại!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Handle HỦY
  const handleCancel = () => {
    clearBet();
    onClearBet();
    setMessage({ type: 'info', text: 'Đã hủy cược' });
    setTimeout(() => setMessage({ type: '', text: '' }), 2000);
  };

  const ActionButton = ({ onClick, disabled, children, variant = 'primary' }) => {
    const backgrounds = {
      primary: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
      danger: 'linear-gradient(135deg, #FF4444 0%, #CC0000 100%)',
      secondary: 'linear-gradient(135deg, #666666 0%, #333333 100%)'
    };

    const textColors = {
      primary: '#000000',
      danger: '#FFFFFF',
      secondary: '#FFFFFF'
    };

    return (
      <motion.button
        whileHover={!disabled ? { scale: 1.05 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
        onClick={onClick}
        disabled={disabled}
        className={`btn-casino ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        style={{
          background: backgrounds[variant],
          color: textColors[variant],
          padding: '16px 32px',
          borderRadius: '12px',
          fontSize: '18px',
          fontWeight: '900',
          textTransform: 'uppercase',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          boxShadow: disabled 
            ? 'none'
            : '0 4px 15px rgba(0, 0, 0, 0.5), inset 0 2px 5px rgba(255, 255, 255, 0.3)',
          minWidth: '140px',
          transition: 'all 0.3s ease'
        }}
      >
        {children}
      </motion.button>
    );
  };

  return (
    <div className="action-buttons py-6">
      {/* Buttons row */}
      <div className="flex items-center justify-center gap-6">
        {/* ALL-IN */}
        <ActionButton
          onClick={handleAllIn}
          disabled={!isOpen || !user?.coins || loading}
          variant="danger"
        >
          ALL-IN
        </ActionButton>

        {/* ĐẶT CƯỢC */}
        <ActionButton
          onClick={handlePlaceBet}
          disabled={!hasBets || !isOpen || loading}
          variant="primary"
        >
          {loading ? 'ĐANG ĐẶT...' : 'ĐẶT CƯỢC'}
        </ActionButton>

        {/* HỦY */}
        <ActionButton
          onClick={handleCancel}
          disabled={!hasBets || loading}
          variant="secondary"
        >
          HỦY
        </ActionButton>
      </div>

      {/* Message display */}
      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-center mt-4"
        >
          <div
            className={`inline-block px-6 py-3 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-600 bg-opacity-20 border border-green-500'
                : message.type === 'error'
                  ? 'bg-red-600 bg-opacity-20 border border-red-500'
                  : 'bg-blue-600 bg-opacity-20 border border-blue-500'
            }`}
          >
            <div
              className={`text-sm font-medium ${
                message.type === 'success'
                  ? 'text-green-400'
                  : message.type === 'error'
                    ? 'text-red-400'
                    : 'text-blue-400'
              }`}
            >
              {message.text}
            </div>
          </div>
        </motion.div>
      )}

      {/* Status text */}
      {!isOpen && (
        <div className="text-center mt-4">
          <div className="text-sm text-gray-500">
            {gameStatus === GAME_STATUS.LOCKED 
              ? '⏳ Đã khóa cược - Chờ kết quả...'
              : gameStatus === GAME_STATUS.ROLLING
                ? '🎲 Đang lắc xúc sắc...'
                : '🔄 Đang xử lý vòng mới...'}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionButtons;
