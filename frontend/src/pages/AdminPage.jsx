import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { adminAPI } from '../services/api';
import { formatMoney } from '../utils/helpers';
import { Settings, Users, TrendingUp, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [winrate, setWinrate] = useState(48);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.is_admin) {
      navigate('/game');
      return;
    }
    loadAdminData();
  }, [user, navigate]);

  const loadAdminData = async () => {
    try {
      const [usersRes, settingsRes] = await Promise.all([
        adminAPI.getAllUsers(50),
        adminAPI.getSettings()
      ]);

      setUsers(usersRes.data.data);
      setWinrate(parseFloat(settingsRes.data.data.winrate_percentage) || 48);
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateWinrate = async () => {
    const newWinrate = prompt('Nhập winrate mới (0-100):', winrate);
    if (newWinrate === null) return;

    const value = parseFloat(newWinrate);
    if (isNaN(value) || value < 0 || value > 100) {
      alert('Winrate không hợp lệ!');
      return;
    }

    try {
      await adminAPI.updateWinrate(value);
      setWinrate(value);
      alert('Cập nhật winrate thành công!');
    } catch (error) {
      alert('Cập nhật thất bại!');
    }
  };

  const handleBanUser = async (userId, currentBanned) => {
    if (!confirm(`${currentBanned ? 'Unban' : 'Ban'} user này?`)) return;

    try {
      await adminAPI.banUser(userId, !currentBanned);
      loadAdminData();
      alert('Cập nhật thành công!');
    } catch (error) {
      alert('Cập nhật thất bại!');
    }
  };

  const handleUpdateCoins = async (userId, currentCoins) => {
    const newCoins = prompt('Nhập số xu mới:', currentCoins);
    if (newCoins === null) return;

    const value = parseInt(newCoins);
    if (isNaN(value) || value < 0) {
      alert('Số xu không hợp lệ!');
      return;
    }

    try {
      await adminAPI.updateUserCoins(userId, value);
      loadAdminData();
      alert('Cập nhật thành công!');
    } catch (error) {
      alert('Cập nhật thất bại!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen casino-bg flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="min-h-screen casino-bg">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/game')}
              className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition"
            >
              <ArrowLeft size={24} className="text-yellow-400" />
            </button>
            <h1 className="text-3xl font-black text-yellow-400">
              ADMIN PANEL
            </h1>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
          >
            Đăng xuất
          </button>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-2xl"
            style={{
              background: 'rgba(255, 215, 0, 0.1)',
              border: '2px solid rgba(255, 215, 0, 0.3)'
            }}
          >
            <Users size={32} className="text-yellow-400 mb-3" />
            <div className="text-3xl font-black text-white mb-1">
              {users.length}
            </div>
            <div className="text-sm text-gray-400">Tổng users</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-2xl cursor-pointer"
            onClick={handleUpdateWinrate}
            style={{
              background: 'rgba(255, 0, 0, 0.1)',
              border: '2px solid rgba(255, 0, 0, 0.3)'
            }}
          >
            <TrendingUp size={32} className="text-red-400 mb-3" />
            <div className="text-3xl font-black text-white mb-1">
              {winrate}%
            </div>
            <div className="text-sm text-gray-400">Winrate (Click để sửa)</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-2xl"
            style={{
              background: 'rgba(0, 255, 0, 0.1)',
              border: '2px solid rgba(0, 255, 0, 0.3)'
            }}
          >
            <Settings size={32} className="text-green-400 mb-3" />
            <div className="text-xl font-black text-white mb-1">
              Active
            </div>
            <div className="text-sm text-gray-400">System Status</div>
          </motion.div>
        </div>

        {/* Users table */}
        <div 
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-xl font-bold text-white">Quản lý Users</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Coins</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Admin</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Banned</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-900 transition">
                    <td className="px-6 py-4 text-sm text-gray-300">{u.id}</td>
                    <td className="px-6 py-4 text-sm text-white font-medium">{u.username}</td>
                    <td className="px-6 py-4 text-sm text-yellow-400">{formatMoney(u.coins)}</td>
                    <td className="px-6 py-4 text-sm">
                      {u.is_admin ? (
                        <span className="px-2 py-1 bg-red-600 text-white text-xs rounded">Yes</span>
                      ) : (
                        <span className="text-gray-500">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {u.banned ? (
                        <span className="px-2 py-1 bg-red-600 text-white text-xs rounded">Banned</span>
                      ) : (
                        <span className="text-green-400">Active</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      {!u.is_admin && (
                        <>
                          <button
                            onClick={() => handleBanUser(u.id, u.banned)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs transition"
                          >
                            {u.banned ? 'Unban' : 'Ban'}
                          </button>
                          <button
                            onClick={() => handleUpdateCoins(u.id, u.coins)}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs transition"
                          >
                            Edit Coins
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
