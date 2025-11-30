// Format số tiền (741,648,460 → 741.648.460)
export const formatMoney = (amount) => {
  if (!amount && amount !== 0) return '0';
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

// Format số tiền ngắn gọn (1000000 → 1M)
export const formatMoneyShort = (amount) => {
  if (!amount && amount !== 0) return '0';
  
  if (amount >= 1000000000) {
    return (amount / 1000000000).toFixed(1).replace('.0', '') + 'B';
  }
  if (amount >= 1000000) {
    return (amount / 1000000).toFixed(1).replace('.0', '') + 'M';
  }
  if (amount >= 1000) {
    return (amount / 1000).toFixed(1).replace('.0', '') + 'K';
  }
  return amount.toString();
};

// Format thời gian (ISO string → HH:MM)
export const formatTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

// Format ngày (ISO string → DD/MM/YYYY)
export const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Validate username
export const validateUsername = (username) => {
  if (!username || username.length < 3) {
    return 'Username phải có ít nhất 3 ký tự';
  }
  if (username.length > 20) {
    return 'Username không được quá 20 ký tự';
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return 'Username chỉ chứa chữ, số và dấu gạch dưới';
  }
  return null;
};

// Validate password
export const validatePassword = (password) => {
  if (!password || password.length < 6) {
    return 'Mật khẩu phải có ít nhất 6 ký tự';
  }
  return null;
};

// Get result color
export const getResultColor = (result) => {
  return result === 'tai' ? '#FF0000' : '#000000';
};

// Get result text
export const getResultText = (result) => {
  return result === 'tai' ? 'TÀI' : 'XỈU';
};

// Calculate total dice
export const calculateDiceTotal = (dice1, dice2, dice3) => {
  return dice1 + dice2 + dice3;
};

// Check if result is TAI or XIU
export const getResult = (total) => {
  return total >= 11 ? 'tai' : 'xiu';
};

// Play sound effect (nếu có)
export const playSound = (soundName) => {
  const soundEnabled = localStorage.getItem('dfc_sound_enabled') !== 'false';
  if (!soundEnabled) return;
  
  // Có thể thêm audio files sau
  // const audio = new Audio(`/sounds/${soundName}.mp3`);
  // audio.play();
};

// Shake effect
export const shakeScreen = () => {
  document.body.style.animation = 'shake 0.5s';
  setTimeout(() => {
    document.body.style.animation = '';
  }, 500);
};

// Copy to clipboard
export const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(
    () => {
      console.log('Copied to clipboard');
      return true;
    },
    (err) => {
      console.error('Failed to copy:', err);
      return false;
    }
  );
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
