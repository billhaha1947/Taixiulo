import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, UserPlus, Trophy, Zap } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const Feature = ({ icon: Icon, title, description }) => (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className="p-6 rounded-2xl text-center"
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 215, 0, 0.2)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <Icon size={48} className="text-yellow-400 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </motion.div>
  );

  return (
    <div className="min-h-screen casino-bg flex flex-col">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-glow opacity-10 blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-glow opacity-10 blur-3xl animate-pulse-slow" />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo/Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="text-9xl mb-6"
          >
            🐉
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-7xl font-black mb-4"
            style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.5))'
            }}
          >
            DRAGON FIRE CASINO
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-2xl text-gray-300 mb-2"
          >
            TÀI XỈU VIP
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-500 mb-12"
          >
            Game Tài Xỉu real-time với xu ảo - Hoàn toàn miễn phí!
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-6 mb-16"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="px-10 py-5 rounded-2xl font-black text-xl flex items-center gap-3"
              style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                color: '#000',
                boxShadow: '0 8px 30px rgba(255, 215, 0, 0.5), inset 0 2px 10px rgba(255, 255, 255, 0.3)'
              }}
            >
              <Play size={28} />
              CHƠI NGAY
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/register')}
              className="px-10 py-5 rounded-2xl font-black text-xl flex items-center gap-3"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#FFF',
                border: '2px solid rgba(255, 215, 0, 0.5)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <UserPlus size={28} />
              ĐĂNG KÝ
            </motion.button>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <Feature
              icon={Zap}
              title="Real-time"
              description="Chơi trực tuyến với người chơi khác"
            />
            <Feature
              icon={Trophy}
              title="Nhận 10K xu"
              description="Miễn phí khi đăng ký tài khoản"
            />
            <Feature
              icon={Play}
              title="Dễ chơi"
              description="Giao diện đơn giản, dễ hiểu"
            />
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center py-6 text-sm text-gray-500">
        <p>Dragon Fire Casino © 2024</p>
        <p className="text-xs mt-1">Chỉ sử dụng xu ảo - Không dùng tiền thật</p>
      </div>
    </div>
  );
};

export default LandingPage;
