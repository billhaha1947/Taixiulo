import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, Settings, Mail, Menu, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = ({ onBack }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    localStorage.setItem('dfc_sound_enabled', !soundEnabled);
  };

  const IconButton = ({ icon: Icon, onClick, tooltip }) => {
    return (
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        className="icon-button relative group"
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease'
        }}
      >
        <Icon size={22} color="#FFD700" />
        
        {/* Tooltip */}
        {tooltip && (
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 
                          opacity-0 group-hover:opacity-100 transition-opacity
                          bg-black bg-opacity-80 px-3 py-1 rounded text-xs text-white whitespace-nowrap">
            {tooltip}
          </div>
        )}
      </motion.button>
    );
  };

  return (
    <header 
      className="header-container relative z-50"
      style={{
        background: 'linear-gradient(180deg, rgba(26, 0, 0, 0.95) 0%, rgba(26, 0, 0, 0.8) 100%)',
        borderBottom: '2px solid rgba(255, 215, 0, 0.2)',
        backdropFilter: 'blur(20px)'
      }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Back button */}
          <div className="flex items-center gap-3">
            <IconButton 
              icon={ArrowLeft} 
              onClick={onBack}
              tooltip="Quay lại"
            />
          </div>

          {/* Center - Logo/Title */}
          <div className="flex-1 flex justify-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <div 
                className="text-2xl font-black tracking-wider"
                style={{
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))'
                }}
              >
                🐉 DRAGON FIRE CASINO
              </div>
              <div className="text-xs text-gray-400 mt-1">
                TÀI XỈU VIP
              </div>
            </motion.div>
          </div>

          {/* Right side - Action icons */}
          <div className="flex items-center gap-2">
            <IconButton 
              icon={soundEnabled ? Volume2 : VolumeX}
              onClick={toggleSound}
              tooltip={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
            />
            
            <IconButton 
              icon={HelpCircle}
              onClick={() => alert('Hướng dẫn chơi:\n1. Chọn chip\n2. Click TÀI hoặc XỈU\n3. Click ĐẶT CƯỢC')}
              tooltip="Hướng dẫn"
            />
            
            <IconButton 
              icon={Mail}
              onClick={() => alert('Thông báo (Coming soon)')}
              tooltip="Thông báo"
            />
            
            <IconButton 
              icon={Settings}
              onClick={() => alert('Cài đặt (Coming soon)')}
              tooltip="Cài đặt"
            />
            
            <IconButton 
              icon={Menu}
              onClick={() => setShowMenu(!showMenu)}
              tooltip="Menu"
            />
          </div>
        </div>
      </div>

      {/* Menu dropdown */}
      {showMenu && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full right-4 mt-2 w-64 rounded-lg overflow-hidden"
          style={{
            background: 'rgba(26, 0, 0, 0.95)',
            border: '1px solid rgba(255, 215, 0, 0.3)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
          }}
        >
          <div className="p-4">
            <button 
              className="w-full text-left px-4 py-3 rounded hover:bg-white hover:bg-opacity-10 transition"
              onClick={() => {/* Navigate to profile */}}
            >
              <div className="text-sm text-gray-400">Hồ sơ</div>
            </button>
            <button 
              className="w-full text-left px-4 py-3 rounded hover:bg-white hover:bg-opacity-10 transition"
              onClick={() => {/* Navigate to history */}}
            >
              <div className="text-sm text-gray-400">Lịch sử</div>
            </button>
            <button 
              className="w-full text-left px-4 py-3 rounded hover:bg-white hover:bg-opacity-10 transition text-red-400"
              onClick={() => {/* Logout */}}
            >
              <div className="text-sm">Đăng xuất</div>
            </button>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
