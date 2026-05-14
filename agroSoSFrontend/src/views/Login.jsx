import { Header } from "../components/Header";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { validateLoginForm } from "../utils/validation.utils";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
} from "@coreui/react";

function Login() {
  // Trae la variable user y la funcion login del contexto
  const { user, login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Si el usuario ya esta logueado, redirige a la pagina del usuario
  if (user) { return <Navigate to={`/user/${user.id}`} />; }

  async function handleSubmit(e) {
    e.preventDefault();

    const validation = validateLoginForm(email, password);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setError("");
    setLoading(true);

    try {
      const loggedUser = await login(email, password);
      showToast(`¡Bienvenido, ${loggedUser.name}!`, "success");
    } catch (err) {
      const msg = err.message || "No se pudo iniciar sesión. Inténtalo de nuevo.";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* <Header /> */}
      <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={6} lg={4}>
              <CCard className="shadow-sm">
                <CCardHeader className="text-center fw-bold">
                  Iniciar sesión
                </CCardHeader>
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    {error && (
                      <div className="alert alert-danger" role="alert">
                        {error}
                      </div>
                    )}
                    <div className="mb-3">
                      <CFormLabel htmlFor="email">Correo electrónico</CFormLabel>
                      <CFormInput
                        type="email"
                        id="email"
                        placeholder="usuario@correo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <CFormLabel htmlFor="password">Contraseña</CFormLabel>
                      <CFormInput
                        type="password"
                        id="password"
                        placeholder="********"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div className="d-grid gap-2">
                      <CButton color="primary" type="submit" disabled={loading}>
                        {loading ? "Cargando..." : "Entrar"}
                      </CButton>
                      <Link to="/signIn">
                        <CButton color="secondary" className="w-100"> Crear cuenta </CButton>
                      </Link>
                    </div>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </>
  );
}

export default Login;
