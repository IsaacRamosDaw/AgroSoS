
import { createContext, useContext, useEffect, useState } from "react";
import { loginUser } from '../../services/user.services';

// 1) Creamos el contexto
const AuthContext = createContext(null);

// 2) Hook para usar el contexto
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}

export function AuthProvider({ children }) {
  // User que se guarda en el localStorage, si es modificado, Se cambia su valor y se vuelve a añadir
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Recoge los datos del usuario del localStorage y establece la variable user
  // Si no hay user porque no se ha registrado o logeado todavía este será null
  useEffect(() => {
    const localData = localStorage.getItem("auth:user");
    if (localData) { setUser(JSON.parse(localData)); }
    setLoading(false);
  }, []);

  // En el momento que haya un registro o login, la variable user es modificado, activando este useEffect
  // Guarda los datos del usuario en el localStorage en el momento que la variable user cambia
  useEffect(() => {
    if (user) localStorage.setItem("auth:user", JSON.stringify(user));
    else localStorage.removeItem("auth:user");
  }, [user]);

  // Login real contra el backend
  async function login(email, password) {
    if (!email || !password) { throw new Error("Credenciales inválidas"); }

    try {
      // Llama al servicio de login en user.service
      const data = await loginUser(email, password);

      // El device está separado de la variable user por lo que se añade manualmente
      const user = data.user;
      user.device = data.device;

      setUser(user);
      return user;

    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }
  
  // Permite actualizar campos del usuario
  function updateUser(updatedFields) {
    setUser((prev) => {
      if (!prev) return prev;
      const merged = { ...prev, ...updatedFields, updated_at: new Date().toISOString() };
      return merged;
    });
  }

  // Comprueba si el usuario es admin
  function isAdmin() { return user && user.role === "ADMIN"; }

  // Logout, elimina la clave del localStorage
  function logout() { setUser(null); localStorage.removeItem("auth:user"); }

  // Valor que se pasa al contexto para que los componentes puedan acceder a las funciones
  const value = { user, loading, login, logout, updateUser, isAdmin };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
