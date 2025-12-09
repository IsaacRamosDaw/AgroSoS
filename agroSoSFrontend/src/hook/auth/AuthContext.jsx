import { createContext, useContext, useEffect, useState } from "react";

// 1) Creamos el contexto
const AuthContext = createContext(null);

// 2) Hook de conveniencia
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}

/**
 * AuthProvider
 * - Mantiene el estado de la sesión { user: {...} | null }
 * - Expone login() y logout()
 * - Persiste en localStorage para recordar sesión al recargar
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null = no autenticado
  const [loading, setLoading] = useState(true); // para el "arranque"

  // Cargar sesión guardada al montar
  useEffect(() => {
    const raw = localStorage.getItem("auth:user");
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch { }
    }
    setLoading(false);
  }, []);

  // Guardar cuando cambie
  useEffect(() => {
    if (user) localStorage.setItem("auth:user", JSON.stringify(user));
    else localStorage.removeItem("auth:user");
  }, [user]);

  // Login real contra el backend
  async function login(email, password) {
    if (!email || !password) {
      throw new Error("Credenciales inválidas");
    }

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      console.log(data);

      if (!data.success) {
        throw new Error(data.message || "Error al iniciar sesión");
      }

      const user = data.user;
      user.device = data.device;
      setUser(user);
      return user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  function isAdmin() {
    return user && user.role === "ADMIN";
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("auth:user");
  }

  // Permite actualizar campos del usuario (por ejemplo desde un formulario de edición)
  function updateUser(updatedFields) {
    setUser((prev) => {
      if (!prev) return prev;
      const merged = { ...prev, ...updatedFields, updated_at: new Date().toISOString() };
      return merged;
    });
  }

  const value = { user, loading, login, logout, updateUser, isAdmin };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
