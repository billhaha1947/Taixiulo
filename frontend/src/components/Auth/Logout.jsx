import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Logout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  React.useEffect(() => {
    // Thực hiện logout khi component được mount
    logout();
    navigate("/login", { replace: true });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center casino-bg text-white text-xl">
      Đang đăng xuất...
    </div>
  );
}
