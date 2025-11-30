import axios from 'axios';
import { API_URL, STORAGE_KEYS } from '../utils/constants';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================================
// AUTH APIs
// ============================================

export const authAPI = {
  register: (username, password) => 
    api.post('/api/auth/register', { username, password }),
  
  login: (username, password) => 
    api.post('/api/auth/login', { username, password }),
  
  changePassword: (currentPassword, newPassword) => 
    api.post('/api/auth/change-password', { currentPassword, newPassword })
};

// ============================================
// USER APIs
// ============================================

export const userAPI = {
  getProfile: () => 
    api.get('/api/user/profile'),
  
  updateAvatar: (avatar) => 
    api.post('/api/user/avatar', { avatar }),
  
  getBalance: () => 
    api.get('/api/user/balance')
};

// ============================================
// GAME APIs
// ============================================

export const gameAPI = {
  placeBet: (side, amount) => 
    api.post('/api/game/bet', { side, amount }),
  
  getCurrentRound: () => 
    api.get('/api/game/round/current'),
  
  getRoundResult: (roundId) => 
    api.get(`/api/game/result/${roundId}`),
  
  getRecentRounds: (limit = 20) => 
    api.get('/api/game/rounds/recent', { params: { limit } })
};

// ============================================
// HISTORY APIs
// ============================================

export const historyAPI = {
  getBetHistory: (limit = 50, offset = 0) => 
    api.get('/api/history/bet', { params: { limit, offset } }),
  
  getChatHistory: (room = 'table', limit = 50) => 
    api.get('/api/history/chat', { params: { room, limit } }),
  
  getLeaderboard: (limit = 10) => 
    api.get('/api/history/leaderboard', { params: { limit } })
};

// ============================================
// ADMIN APIs
// ============================================

export const adminAPI = {
  getAllUsers: (limit = 100, offset = 0) => 
    api.get('/api/admin/users', { params: { limit, offset } }),
  
  banUser: (userId, banned) => 
    api.post(`/api/admin/users/${userId}/ban`, { banned }),
  
  updateUserCoins: (userId, coins) => 
    api.post(`/api/admin/users/${userId}/coins`, { coins }),
  
  updateWinrate: (winrate) => 
    api.post('/api/admin/winrate', { winrate }),
  
  getSettings: () => 
    api.get('/api/admin/settings'),
  
  resetPassword: (userId, newPassword) => 
    api.post('/api/admin/reset-password', { userId, newPassword }),
  
  getAllBets: (limit = 100, offset = 0) => 
    api.get('/api/admin/bets', { params: { limit, offset } }),
  
  getAllChats: (limit = 100, offset = 0) => 
    api.get('/api/admin/chats', { params: { limit, offset } })
};

export default api;
