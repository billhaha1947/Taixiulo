import React, { useState, useEffect } from 'react';
import { gameAPI } from '../../services/api';
import { getResultText, formatDate } from '../../utils/helpers';
import { motion } from 'framer-motion';

const RoundHistory = () => {
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoundHistory();
  }, []);

  const loadRoundHistory = async () => {
    try {
      const response = await gameAPI.getRecentRounds(20);
      setRounds(response.data.data);
    } catch (error) {
      console.error('Failed to load round history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="spinner" />
      </div>
    );
  }

  const DiceDot = ({ count }) => {
    const dots = Array(count).fill(0);
    return (
      <div 
        className="w-10 h-10 rounded flex items-center justify-center flex-wrap gap-0.5 p-1"
        style={{
          background: 'linear-gradient(135deg, #FF0000 0%, #8B0000 100%)',
          boxShadow: '0 2px 8px rgba(255, 0, 0, 0.4)'
        }}
      >
        {dots.map((_, idx) => (
          <div 
            key={idx}
            className="w-1.5 h-1.5 bg-white rounded-full"
          />
        ))}
      </div>
    );
  };

  return (
    <div className="round-history">
      <div className="space-y-3">
        {rounds.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Chưa có lịch sử vòng chơi
          </div>
        ) : (
          rounds.map((round, idx) => (
            <motion.div
              key={round.round_number}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-4 rounded-lg"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              {/* Round number and result */}
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-gray-400">
                  Vòng #{round.round_number}
                </div>
                <div 
                  className="px-4 py-1 rounded-lg font-bold"
                  style={{
                    background: round.result === 'tai' 
                      ? 'linear-gradient(135deg, #FF0000 0%, #8B0000 100%)'
                      : 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
                    color: '#FFD700',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  {getResultText(round.result)}
                </div>
              </div>

              {/* Dice display */}
              <div className="flex items-center justify-center gap-3 mb-3">
                <DiceDot count={round.dice1} />
                <DiceDot count={round.dice2} />
                <DiceDot count={round.dice3} />
              </div>

              {/* Total */}
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">Tổng</div>
                <div className="text-2xl font-black text-yellow-400">
                  {round.total}
                </div>
              </div>

              {/* Date */}
              <div className="text-xs text-gray-600 text-center mt-3">
                {formatDate(round.created_at)}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default RoundHistory;
