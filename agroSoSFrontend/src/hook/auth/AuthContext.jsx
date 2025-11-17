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
      } catch {}
    }
    setLoading(false);
  }, []);

  // Guardar cuando cambie
  useEffect(() => {
    if (user) localStorage.setItem("auth:user", JSON.stringify(user));
    else localStorage.removeItem("auth:user");
  }, [user]);

  // Simulación de login (valida si hay algo escrito)
  async function login(username, password) {
    // En real: llamar a API, recibir token/perfil…
    if (!username || !password) {
      throw new Error("Credenciales inválidas");
    }
    // "username" aquí es el email introducido por el usuario en el formulario.
    // Queremos almacenar `user.username` como la parte antes del '@'.
    let email = username;
    if (!email.includes("@")) {
      // Si el usuario no puso un @, agregamos un dominio por defecto
      email = `${username}@example.com`;
    }
    const localPart = email.split("@")[0];
    // Usuario "fake" con datos completos:
    const fakeUser = {
      id: 1,
      username: localPart,
      email: email,
      password: password,
      created_at: "2023-11-01T10:23:00.000Z",
      updated_at: new Date().toISOString(),
      terms_accepted: true,
      role: "user",
    };
    setUser(fakeUser);
    return fakeUser;
  }

  function logout() {
    // null==> usuario no logeado
    setUser(null);
  }

  // Permite actualizar campos del usuario (por ejemplo desde un formulario de edición)
  function updateUser(updatedFields) {
    setUser((prev) => {
      if (!prev) return prev;
      const merged = { ...prev, ...updatedFields, updated_at: new Date().toISOString() };
      return merged;
    });
  }

  const value = { user, loading, login, logout, updateUser };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
