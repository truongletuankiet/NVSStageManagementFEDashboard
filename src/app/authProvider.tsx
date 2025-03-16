import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoginForm from "./loginform";
import "tailwindcss/tailwind.css";

const logo = "/HCMCONS_Logo.png";
const backgroundMusic = "/music-bg.svg";

interface User {
  email: string;
  token: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (fullName: string, email: string, password: string, confirmPassword: string) => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser: User = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error("Lỗi khi parse user từ localStorage", error);
          localStorage.removeItem("user");
        }
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setError(null);
    try {
        const response = await axios.post("http://localhost:8080/auth/token", { email, password });

        if (!response.data || !response.data.result?.token) {
            throw new Error("❌ Đăng nhập thất bại. Phản hồi API không hợp lệ!");
        }

        const { token } = response.data.result; 
        const userData: User = { email, token };

        // ✅ Lưu vào sessionStorage thay vì localStorage
        sessionStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);

        // ✅ Cấu hình token cho axios
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        console.log("✅ Đăng nhập thành công:", userData);
    } catch (err) {
        console.error("❌ Lỗi đăng nhập:", err);
        setError("Đăng nhập thất bại. Kiểm tra lại thông tin!");
    }
};


  const register = async (fullName: string, email: string, password: string, confirmPassword: string): Promise<void> => {
    setError(null);
    if (password !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/v1/user/register", {
        fullName,
        dayOfBirth: new Date().toISOString().split("T")[0],
        email,
        password,
        department: null,
        pictureProfile: "https://source.unsplash.com/100x100/?music",
        createDate: new Date().toISOString(),
        role: null,
        status: "Active",
      });
      const userData: User = response.data;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (err) {
      setError("Đăng ký thất bại. Vui lòng thử lại!");
    }
  };

  const logout = (): void => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {loading ? (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 animate-fadeIn">
          <img src={logo} alt="Nhạc viện TP HCM" className="w-32 h-32 animate-pulse" />
          <p className="text-lg text-gray-600">Đang tải...</p>
        </div>
      ) : user ? (
        children
      ) : (
        <div
          className="relative min-h-screen flex justify-center items-center bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundMusic})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-700 opacity-80"></div>
          <div className="absolute top-10 left-10 animate-slideIn">
            <img src={logo} alt="Nhạc viện TP HCM" className="w-24 h-24 shadow-lg rounded-full" />
          </div>
          <LoginForm
            login={login}
            register={register}
            error={error}
            setIsRegistering={setIsRegistering}
            isRegistering={isRegistering}
          />
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được sử dụng trong AuthProvider");
  }
  return context;
};

export default AuthProvider;