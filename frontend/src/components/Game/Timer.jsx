import React, { useEffect, useState } from 'react';
import { useGame } from '../../hooks/useGame';
import { GAME_STATUS } from '../../utils/constants';
import { motion } from 'framer-motion';

const Timer = () => {
  const { timeLeft, gameStatus } = useGame();
  const [pulse, setPulse] = useState(false);

  // Pulse effect when time is low
  useEffect(() => {
    if (timeLeft <= 5 && timeLeft > 0) {
      setPulse(true);
    } else {
      setPulse(false);
    }
  }, [timeLeft]);

  // Calculate percentage for circular progress
  const percentage = (timeLeft / 15) * 100;
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Get color based on time left
  const getColor = () => {
    if (timeLeft <= 3) return '#FF0000'; // Red
    if (timeLeft <= 5) return '#FFA500'; // Orange
    return '#FFD700'; // Gold
  };

  // Get status text
  const getStatusText = () => {
    switch (gameStatus) {
      case GAME_STATUS.OPEN:
        return 'Đang mở cược';
      case GAME_STATUS.LOCKED:
        return 'Đã khóa';
      case GAME_STATUS.ROLLING:
        return 'Đang lắc';
      case GAME_STATUS.RESULT:
        return 'Kết quả';
      default:
        return 'Chờ...';
    }
  };

  return (
    <div className="timer-container flex flex-col items-center">
      {/* Circular timer */}
      <div className="relative">
        <motion.div
          animate={pulse ? {
            scale: [1, 1.1, 1],
          } : {}}
          transition={{
            duration: 0.5,
            repeat: pulse ? Infinity : 0
          }}
          className="relative"
        >
          {/* SVG Circle */}
          <svg width="120" height="120" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r="45"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="8"
              fill="none"
            />
            
            {/* Progress circle */}
            <circle
              cx="60"
              cy="60"
              r="45"
              stroke={getColor()}
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{
                transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease',
                filter: pulse ? 'drop-shadow(0 0 10px currentColor)' : 'none'
              }}
            />
          </svg>

          {/* Timer number in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              key={timeLeft}
              initial={{ scale: 1.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <div 
                className="text-5xl font-black"
                style={{
                  color: getColor(),
                  textShadow: pulse 
                    ? `0 0 20px ${getColor()}, 0 0 40px ${getColor()}`
                    : `0 2px 10px rgba(0, 0, 0, 0.8)`
                }}
              >
                {timeLeft > 0 ? timeLeft : '0'}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Status text */}
      <div className="mt-4 text-center">
        <div 
          className="text-sm font-bold uppercase tracking-wider"
          style={{
            color: getColor(),
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'
          }}
        >
          {getStatusText()}
        </div>
      </div>

      {/* Time warning */}
      {timeLeft <= 3 && timeLeft > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="mt-2 text-xs text-red-400 font-medium"
        >
          ⚠️ Sắp hết giờ!
        </motion.div>
      )}
    </div>
  );
};

export default Timer;
