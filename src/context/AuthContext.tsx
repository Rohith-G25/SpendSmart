import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import API from "@/services/api";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading] = useState(false);

  // 🔥 restore user on reload
  useEffect(() => {
    const stored = localStorage.getItem("spendsmart_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // ✅ LOGIN (REAL BACKEND)
  const login = async (email: string, password: string) => {
    const res = await API.post("/auth/login", { email, password });

    const { token, user } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("spendsmart_user", JSON.stringify(user));

    setUser(user);
  };

  // ✅ REGISTER
  const register = async (name: string, email: string, password: string) => {
    await API.post("/auth/register", { name, email, password });
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("spendsmart_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}