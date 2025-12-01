import React, { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";

const LogoutPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout(); // Xóa token localStorage
    setTimeout(() => navigate("/login"), 1200);
  }, []);

  return (
    <div className="min-h-screen casino-bg flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <LogOut size={64} className="text-red-500 mx-auto mb-4" />
        <h2 className="text-4xl font-black text-white mb-2">ĐANG ĐĂNG XUẤT</h2>
        <p className="text-gray-400 text-lg">Hẹn gặp lại, quay lại sảnh game...</p>

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          className="w-6 h-6 border-4 border-t-red-500 rounded-full mx-auto mt-6"
        />
      </motion.div>
    </div>
  );
};

export default LogoutPage;
