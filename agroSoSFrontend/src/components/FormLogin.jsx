import React, { useState } from "react";
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
import { Navigate } from "react-router-dom";
import { useAuth } from "../hook/auth/AuthContext";

export const FormLogin = () => {
  // const {login} = useContext(userContext)

  const { user, login } = useAuth();

  if (user) return <Navigate to={`/user/${user.id}`} />;

  // const fakeUser = {
  //   id: 1,
  //   username: 'juan',
  //   email: 'juan@example.com',
  // }

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password); // <— esto setea user en el contexto
    } catch (err) {
      setError(err.message || "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  // const navigate = useNavigate();
  // const handleLogin = () => {
  //   login(fakeUser);
  //   alert("Datos guardados correctamente");
  //   navigate(`/user/1`);
  // };

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
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
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
                  <div className="d-grid">
                    <CButton color="primary" type="submit" disabled={loading}>
                      {loading ? "Cargando..." : "Entrar"}
                    </CButton>
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
