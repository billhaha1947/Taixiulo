import { io } from 'socket.io-client';
import { SOCKET_URL, STORAGE_KEYS } from '../utils/constants';

let socket = null;

// Initialize socket connection
export const initSocket = () => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  
  if (!token) {
    console.warn('No token found, cannot connect to socket');
    return null;
  }

  socket = io(SOCKET_URL, {
    auth: {
      token: token
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
  });

  // Connection events
  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('❌ Socket disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  return socket;
};

// Disconnect socket
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Get socket instance
export const getSocket = () => {
  return socket;
};

// ============================================
// EMIT EVENTS (Client → Server)
// ============================================

export const joinGame = () => {
  if (socket) {
    socket.emit('join_game');
  }
};

export const placeBet = (side, amount, callback) => {
  if (socket) {
    socket.emit('place_bet', { side, amount }, callback);
  }
};

export const sendChat = (message, room = 'table') => {
  if (socket) {
    socket.emit('send_chat', { message, room });
  }
};

export const requestBalance = () => {
  if (socket) {
    socket.emit('request_balance');
  }
};

// ============================================
// LISTEN EVENTS (Server → Client)
// ============================================

export const onUserConnected = (callback) => {
  if (socket) {
    socket.on('user_connected', callback);
  }
};

export const onRoundStart = (callback) => {
  if (socket) {
    socket.on('round_start', callback);
  }
};

export const onTimerUpdate = (callback) => {
  if (socket) {
    socket.on('timer_update', callback);
  }
};

export const onBettingLocked = (callback) => {
  if (socket) {
    socket.on('betting_locked', callback);
  }
};

export const onDiceRolling = (callback) => {
  if (socket) {
    socket.on('dice_rolling', callback);
  }
};

export const onRoundResult = (callback) => {
  if (socket) {
    socket.on('round_result', callback);
  }
};

export const onBetPlaced = (callback) => {
  if (socket) {
    socket.on('bet_placed', callback);
  }
};

export const onChatMessage = (callback) => {
  if (socket) {
    socket.on('chat_message', callback);
  }
};

export const onBalanceUpdate = (callback) => {
  if (socket) {
    socket.on('balance_update', callback);
  }
};

export const onBalanceUpdateAll = (callback) => {
  if (socket) {
    socket.on('balance_update_all', callback);
  }
};

export const onBetSuccess = (callback) => {
  if (socket) {
    socket.on('bet_success', callback);
  }
};

export const onBetError = (callback) => {
  if (socket) {
    socket.on('bet_error', callback);
  }
};

export const onChatError = (callback) => {
  if (socket) {
    socket.on('chat_error', callback);
  }
};

export const onCurrentRound = (callback) => {
  if (socket) {
    socket.on('current_round', callback);
  }
};

// ============================================
// REMOVE LISTENERS
// ============================================

export const removeAllListeners = () => {
  if (socket) {
    socket.removeAllListeners();
  }
};

export default {
  initSocket,
  disconnectSocket,
  getSocket,
  joinGame,
  placeBet,
  sendChat,
  requestBalance,
  onUserConnected,
  onRoundStart,
  onTimerUpdate,
  onBettingLocked,
  onDiceRolling,
  onRoundResult,
  onBetPlaced,
  onChatMessage,
  onBalanceUpdate,
  onBalanceUpdateAll,
  onBetSuccess,
  onBetError,
  onChatError,
  onCurrentRound,
  removeAllListeners
};
