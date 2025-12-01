import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import { LogIn, User, Lock, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.username, formData.password);

    if (result.success) {
      navigate('/game');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center casino-bg px-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-glow opacity-20 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-glow opacity-20 blur-3xl" />
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(26, 0, 0, 0.95) 0%, rgba(51, 0, 0, 0.9) 100%)',
            border: '2px solid rgba(255, 215, 0, 0.3)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(255, 0, 0, 0.3)'
          }}
        >
          {/* Header */}
          <div className="text-center py-8 px-6"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 0, 0, 0.2) 0%, rgba(139, 0, 0, 0.1) 100%)',
              borderBottom: '1px solid rgba(255, 215, 0, 0.2)'
            }}
          >
            <motion.div
              animate={{ 
                textShadow: [
                  '0 0 20px rgba(255, 215, 0, 0.5)',
                  '0 0 40px rgba(255, 215, 0, 0.8)',
                  '0 0 20px rgba(255, 215, 0, 0.5)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-5xl mb-2"
            >
              🐉
            </motion.div>
            <h1 
              className="text-3xl font-black mb-2"
              style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              DRAGON FIRE CASINO
            </h1>
            <p className="text-sm text-gray-400">TÀI XỈU VIP</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8">
            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-lg bg-red-600 bg-opacity-20 border border-red-500"
              >
                <p className="text-red-400 text-sm text-center">{error}</p>
              </motion.div>
            )}

            {/* Username */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tên đăng nhập
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <User size={20} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Nhập tên đăng nhập"
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-lg text-white placeholder-gray-500
                           focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
                  style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <Lock size={20} className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu"
                  required
                  className="w-full pl-12 pr-12 py-3 rounded-lg text-white placeholder-gray-500
                           focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
                  style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff size={20} className="text-gray-400" />
                  ) : (
                    <Eye size={20} className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-lg font-black text-lg uppercase
                       flex items-center justify-center gap-2 transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: loading 
                  ? 'linear-gradient(135deg, #666 0%, #444 100%)'
                  : 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                color: '#000',
                boxShadow: loading 
                  ? 'none'
                  : '0 4px 15px rgba(255, 215, 0, 0.5), inset 0 2px 5px rgba(255, 255, 255, 0.3)'
              }}
            >
              {loading ? (
                <>
                  <div className="spinner w-6 h-6 border-2 border-gray-900 border-t-transparent" />
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Đăng nhập
                </>
              )}
            </motion.button>

            {/* Register link */}
            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Chưa có tài khoản?{' '}
                <Link
                  to="/register"
                  className="text-yellow-400 hover:text-yellow-300 font-medium transition"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </div>

            {/* Quick login hint */}
            <div className="mt-8 p-4 rounded-lg bg-blue-600 bg-opacity-10 border border-blue-500 border-opacity-30">
              <p className="text-blue-400 text-xs text-center">
                💡 <strong>Demo:</strong> admin / admin123
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-gray-500">
          Dragon Fire Casino © 2024. Chỉ sử dụng xu ảo.
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
