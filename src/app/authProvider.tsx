import React, { createContext, useState, useEffect, useContext } from "react";
import { mockUsers } from "../../public/mockUsers";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Kiểm tra localStorage để duy trì đăng nhập
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Hàm đăng nhập giả lập bằng cách kiểm tra trong mockUsers
  const login = async (email, password) => {
    setError(null);
    const foundUser = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      localStorage.setItem("user", JSON.stringify(foundUser));
      setUser(foundUser);
    } else {
      setError("Email hoặc mật khẩu không đúng!");
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-lg">Đang tải...</p>
        </div>
      ) : user ? (
        children
      ) : (
        <LoginForm login={login} error={error} />
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được sử dụng trong AuthProvider");
  }
  return context;
};

const LoginForm = ({ login, error }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    await login(email, password);
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <form onSubmit={handleLogin} className="space-y-4">
          <h2 className="text-2xl font-semibold text-center">Đăng nhập</h2>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-400"
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-400"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthProvider;
