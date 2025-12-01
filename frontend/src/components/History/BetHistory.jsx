import React, { useState, useEffect } from 'react';
import { historyAPI } from '../../services/api';
import { formatMoney, formatDate, getResultText } from '../../utils/helpers';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, History } from 'lucide-react';

const BetHistory = () => {
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ wins: 0, losses: 0, total: 0 });

  useEffect(() => {
    loadBetHistory();
  }, []);

  const loadBetHistory = async () => {
    try {
      const response = await historyAPI.getBetHistory(50);
      const betData = response.data.data;
      setBets(betData);

      // Calculate stats
      const wins = betData.filter(b => b.win).length;
      const losses = betData.filter(b => !b.win).length;
      setStats({ wins, losses, total: betData.length });

    } catch (error) {
      console.error('Failed to load bet history:', error);
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

  return (
    <div className="bet-history">
      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-lg text-center"
          style={{
            background: 'rgba(0, 100, 0, 0.2)',
            border: '1px solid rgba(0, 255, 0, 0.3)'
          }}
        >
          <TrendingUp size={24} className="text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-400">{stats.wins}</div>
          <div className="text-xs text-gray-400">Thắng</div>
        </div>

        <div className="p-4 rounded-lg text-center"
          style={{
            background: 'rgba(100, 0, 0, 0.2)',
            border: '1px solid rgba(255, 0, 0, 0.3)'
          }}
        >
          <TrendingDown size={24} className="text-red-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-red-400">{stats.losses}</div>
          <div className="text-xs text-gray-400">Thua</div>
        </div>

        <div className="p-4 rounded-lg text-center"
          style={{
            background: 'rgba(255, 215, 0, 0.1)',
            border: '1px solid rgba(255, 215, 0, 0.3)'
          }}
        >
          <History size={24} className="text-yellow-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-yellow-400">{stats.total}</div>
          <div className="text-xs text-gray-400">Tổng cược</div>
        </div>
      </div>

      {/* Bet list */}
      <div className="space-y-3">
        {bets.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Chưa có lịch sử cược
          </div>
        ) : (
          bets.map((bet, idx) => (
            <motion.div
              key={bet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-4 rounded-lg"
              style={{
                background: bet.win 
                  ? 'rgba(0, 100, 0, 0.1)'
                  : 'rgba(100, 0, 0, 0.1)',
                border: `1px solid ${bet.win ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)'}`
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-400">
                  Vòng #{bet.round_number}
                </div>
                <div className={`text-xs font-bold px-2 py-1 rounded ${
                  bet.win ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                }`}>
                  {bet.win ? 'THẮNG' : 'THUA'}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-300">
                    Cược: <span className="font-bold text-yellow-400">
                      {bet.side.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-300">
                    Kết quả: <span className="font-bold">
                      {getResultText(bet.round_result)} ({bet.total})
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-bold text-yellow-400">
                    {formatMoney(bet.amount)}
                  </div>
                  <div className={`text-xs ${bet.win ? 'text-green-400' : 'text-red-400'}`}>
                    {bet.win ? `+${formatMoney(bet.amount)}` : `-${formatMoney(bet.amount)}`}
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-500 mt-2">
                {formatDate(bet.created_at)}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default BetHistory;
