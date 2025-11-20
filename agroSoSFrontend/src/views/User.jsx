import React from 'react'
import { Link } from 'react-router-dom'
import { user } from '../data/user'
import { Header } from '../components/Header'
import {
  CCard, CCardBody, CCardTitle, CCardText, CButton, CRow, CCol, CAvatar, CContainer, CBadge,
} from '@coreui/react'
import { userContext } from '../context/UserContext'
import { useAuth } from '../hook/auth/AuthContext'
import { useNavigate } from 'react-router-dom'

export function User() {
  const { user: authUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(`/user/login`);
  };
  const userData = authUser || user;

  //const { userLogged } = useContext(UserContext)

  /**
   if (!userLogged) {
      return <p className="text-center mt-5">No hay usuario logeado.</p>
   }
   */
  return (<>
    <Header />
    <CContainer fluid className="bg-light min-vh-100 py-5">
      <CRow className="justify-content-center">
        <CCol xs={12} md={8} lg={6}>
          <CCard className="shadow-lg border-0 rounded-4">
            <CCardBody className="p-5">

              {/* Cabecera del perfil */}
              <div className="text-center mb-4">
                <CAvatar
                  size="xl"
                  src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  className="mb-3 border border-3 border-primary"
                />
                <CCardTitle className="h3 mb-0">{userData.name}</CCardTitle>
                <p className="text-muted">{userData.email}</p>
              </div>

              {/* Datos del usuario */}
              <div className="mb-4">
                <CRow className="mb-2">
                  <CCol xs={5} className="text-end fw-semibold text-secondary">
                    ID:
                  </CCol>
                  <CCol xs={7}>{userData.id}</CCol>
                </CRow>

                <CRow className="mb-2">
                  <CCol xs={5} className="text-end fw-semibold text-secondary">
                    Creado el:
                  </CCol>
                  <CCol xs={7}>{new Date(userData.createdAt).toLocaleDateString()}</CCol>
                </CRow>

                <CRow className="mb-2">
                  <CCol xs={5} className="text-end fw-semibold text-secondary">
                    Última actualización:
                  </CCol>
                  <CCol xs={7}>{new Date(userData.updatedAt).toLocaleDateString()}</CCol>
                </CRow>
                {/* 
                <CRow className="mb-2">
                  <CCol xs={5} className="text-end fw-semibold text-secondary">
                    Términos:
                  </CCol>
                  <CCol xs={7}>
                    {userData.terms_accepted ? (<CBadge color="success">Aceptados</CBadge>) : (
                      <CBadge color="danger">No aceptados</CBadge>)}
                  </CCol>
                </CRow> */}
              </div>

              {/* Botón */}
              <div className="text-center d-flex justify-content-center gap-3">

                <Link to={`/user/edit/${userData.id}`}>
                  <CButton color="primary" size="lg" className="px-5">
                    Modificar mis datos
                  </CButton>
                </Link>

                <Link to={`/login`}>
                  <CButton color="primary" size="lg" className="px-5" onClick={handleLogout}>
                    Cerrar sesión
                  </CButton>
                </Link>
              </div>

            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </>)
}

export default User