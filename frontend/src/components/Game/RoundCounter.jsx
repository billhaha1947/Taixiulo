import React from 'react';
import { useGame } from '../../hooks/useGame';
import { motion } from 'framer-motion';

const RoundCounter = () => {
  const { currentRound } = useGame();

  const roundNumber = currentRound?.roundNumber || 0;

  return (
    <div className="round-counter">
      <motion.div
        key={roundNumber}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="flex items-center justify-center"
      >
        {/* Container */}
        <div
          className="px-8 py-4 rounded-2xl relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 0, 0, 0.2) 0%, rgba(139, 0, 0, 0.3) 100%)',
            border: '2px solid rgba(255, 215, 0, 0.4)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 0 20px rgba(255, 0, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)'
          }}
        >
          {/* Shine effect */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
              animation: 'shine 3s infinite'
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex items-center gap-3">
            {/* Icon */}
            <div className="text-2xl">🎲</div>

            {/* Label */}
            <div className="text-sm font-medium text-gray-300">
              VÒNG SỐ
            </div>

            {/* Round number */}
            <div 
              className="text-3xl font-black"
              style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
                filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8))'
              }}
            >
              #{roundNumber.toString().padStart(6, '0')}
            </div>
          </div>

          {/* Bottom glow line */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1"
            style={{
              background: 'linear-gradient(90deg, transparent, #FFD700, transparent)',
              boxShadow: '0 0 10px rgba(255, 215, 0, 0.8)'
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default RoundCounter;
