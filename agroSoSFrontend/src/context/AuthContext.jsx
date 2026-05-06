import { createContext, useContext, useEffect, useState } from "react";
import { loginUser } from '../services/user.services';

const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: restore user from localStorage and refresh role from backend
  // to detect role changes made by an admin while the session was active
  useEffect(() => {
    const localData = localStorage.getItem("auth:user");
    if (!localData) {
      setLoading(false);
      return;
    }
    const cached = JSON.parse(localData);
    setUser(cached);
    fetch(`http://localhost:8080/api/user/${cached.id}`)
      .then(r => r.json())
      .then(fresh => setUser(prev => prev ? { ...prev, role: fresh.role } : prev))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Keep localStorage in sync whenever user state changes
  useEffect(() => {
    if (user) localStorage.setItem("auth:user", JSON.stringify(user));
    else localStorage.removeItem("auth:user");
  }, [user]);

  async function login(email, password) {
    if (!email || !password) { throw new Error("Credenciales inválidas"); }
    const data = await loginUser(email, password);
    const loggedUser = data.user;
    loggedUser.device = data.device;
    setUser(loggedUser);
    return loggedUser;
  }

  function updateUser(updatedFields) {
    setUser((prev) => {
      if (!prev) return prev;
      return { ...prev, ...updatedFields, updated_at: new Date().toISOString() };
    });
  }

  function isAdmin() { return user && user.role === "ADMIN"; }

  function logout() { setUser(null); localStorage.removeItem("auth:user"); }

  const value = { user, loading, login, logout, updateUser, isAdmin };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
