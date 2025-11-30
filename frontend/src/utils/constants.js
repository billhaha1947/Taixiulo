// API URLs
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// Chip values (giống như trong hình)
export const CHIP_VALUES = [
  { value: 1000, label: '1K' },
  { value: 10000, label: '10K' },
  { value: 50000, label: '50K' },
  { value: 100000, label: '100K' },
  { value: 500000, label: '500K' },
  { value: 5000000, label: '5M' },
  { value: 10000000, label: '10M' },
  { value: 50000000, label: '50M' }
];

// Game constants
export const BETTING_TIME = 15; // 15 seconds
export const ROLLING_TIME = 5; // 5 seconds

// Bet sides
export const BET_SIDES = {
  TAI: 'tai',
  XIU: 'xiu'
};

// Game status
export const GAME_STATUS = {
  OPEN: 'open',
  LOCKED: 'locked',
  ROLLING: 'rolling',
  RESULT: 'result'
};

// Chat rooms
export const CHAT_ROOMS = {
  TABLE: 'table',
  GLOBAL: 'global'
};

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'dfc_token',
  USER: 'dfc_user',
  SOUND: 'dfc_sound_enabled'
};

// Color scheme
export const COLORS = {
  TAI: '#FF0000', // Đỏ
  XIU: '#000000', // Đen
  GOLD: '#FFD700',
  DRAGON_RED: '#DC143C'
};
