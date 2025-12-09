import { useState } from "react";
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

import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../hook/auth/AuthContext";

export const FormLogin = () => {

  const { user, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={`/user/${user.id}`} />;
  // if (user.role !== "USER") return <Navigate to={`/admin/${user.id}`} />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password); // <— esto setea user en el contexto
    } catch (err) {
      setError(err.message || "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
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
                      <CButton color="secondary" className="w-100">
                        Crear cuenta
                      </CButton>
                    </Link>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};
