import React from 'react';
import { useGame } from '../../hooks/useGame';
import { motion } from 'framer-motion';

const DiceArena = () => {
  const { diceResult, isRolling } = useGame();

  // Dice face component
  const DiceFace = ({ value, isRolling }) => {
    const getDots = (num) => {
      const positions = {
        1: [[50, 50]],
        2: [[25, 25], [75, 75]],
        3: [[25, 25], [50, 50], [75, 75]],
        4: [[25, 25], [75, 25], [25, 75], [75, 75]],
        5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
        6: [[25, 25], [75, 25], [25, 50], [75, 50], [25, 75], [75, 75]]
      };
      return positions[num] || [];
    };

    return (
      <motion.div
        className={`dice-face ${isRolling ? 'dice-rolling' : ''}`}
        animate={isRolling ? {
          rotateX: [0, 360, 720, 1080],
          rotateY: [0, 360, 720, 1080],
          rotateZ: [0, 180, 360, 540]
        } : {}}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #FF0000 0%, #8B0000 100%)',
          borderRadius: '12px',
          position: 'relative',
          boxShadow: '0 0 20px rgba(255, 0, 0, 0.6), inset 0 0 10px rgba(0, 0, 0, 0.5)',
          border: '2px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        {value && getDots(value).map((pos, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: `${pos[0]}%`,
              top: `${pos[1]}%`,
              transform: 'translate(-50%, -50%)',
              width: '12px',
              height: '12px',
              background: '#FFFFFF',
              borderRadius: '50%',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
            }}
          />
        ))}
      </motion.div>
    );
  };

  return (
    <div className="dice-arena relative">
      {/* Background glow */}
      <div className="absolute inset-0 bg-red-glow opacity-30 blur-3xl pointer-events-none" />

      {/* Dice container */}
      <div className="relative z-10 flex items-center justify-center gap-6 py-8">
        {/* Dice 1 */}
        <DiceFace 
          value={diceResult?.dice1 || (isRolling ? null : 1)} 
          isRolling={isRolling} 
        />

        {/* Dice 2 */}
        <DiceFace 
          value={diceResult?.dice2 || (isRolling ? null : 1)} 
          isRolling={isRolling} 
        />

        {/* Dice 3 */}
        <DiceFace 
          value={diceResult?.dice3 || (isRolling ? null : 1)} 
          isRolling={isRolling} 
        />
      </div>

      {/* Result display */}
      {diceResult && !isRolling && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center mt-4"
        >
          <div className="inline-block px-8 py-3 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              boxShadow: '0 0 30px rgba(255, 215, 0, 0.6)'
            }}
          >
            <div className="text-sm text-gray-900 font-medium mb-1">
              Tổng: {diceResult.total}
            </div>
            <div className={`text-3xl font-black ${
              diceResult.result === 'tai' ? 'text-red-600' : 'text-black'
            }`}>
              {diceResult.result === 'tai' ? 'TÀI' : 'XỈU'}
            </div>
          </div>
        </motion.div>
      )}

      {/* Rolling text */}
      {isRolling && (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="text-center mt-4"
        >
          <div className="text-2xl font-bold text-gold-gradient neon-gold">
            ĐANG LẮC...
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DiceArena;
