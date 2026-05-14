import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { Header } from '../components/Header'
import { CCard, CCardBody, CCardTitle, CCardText, CButton, CRow, CCol, CAvatar, CContainer, CBadge } from '@coreui/react'

export function User() {
  const { user, logout, loading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    showToast('Sesión cerrada correctamente', 'info');
    logout();
    navigate('/login');
  };

  // En lo que carga los datos del usuario se devuelve un mensaje de cargando un usuario
  if (loading) { return <div className="text-center py-5">Cargando usuario...</div>; }

  // Si el usuario no está logueado, lo redirige al login
  if (!user) { navigate('/login'); return null; }


  return (<>
    <Helmet>
      <title>Perfil de Usuario - AgroSoS</title>
      <meta name="description" content={`Gestiona tu cuenta de AgroSoS. Datos del usuario: ${user.name}.`} />
    </Helmet>
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
                  alt={`Foto de perfil de ${user.name}`}
                />
                <CCardTitle component="h2" className="h3 mb-0">{user.name}</CCardTitle>
                <p className="text-muted">{user.email}</p>
              </div>

              {/* Datos del usuario */}
              <section aria-labelledby="user-details-title">
                <h3 id="user-details-title" className="visually-hidden">Detalles de la cuenta</h3>
                <div className="mb-4">
                  <CRow className="mb-2">
                    <CCol xs={5} className="text-end fw-semibold text-secondary">
                      ID:
                    </CCol>
                    <CCol xs={7}>{user.id}</CCol>
                  </CRow>

                  <CRow className="mb-2">
                    <CCol xs={5} className="text-end fw-semibold text-secondary">
                      Creado el:
                    </CCol>
                    <CCol xs={7}>{new Date(user.createdAt).toLocaleDateString()}</CCol>
                  </CRow>

                  <CRow className="mb-2">
                    <CCol xs={5} className="text-end fw-semibold text-secondary">
                      Última actualización:
                    </CCol>
                    <CCol xs={7}>{new Date(user.updatedAt).toLocaleDateString()}</CCol>
                  </CRow>
                </div>
              </section>

              {/* Botones de acción */}
              <div className="text-center d-flex justify-content-center gap-3 flex-wrap">

                <Link to={`/user/edit/${user.id}`} aria-label="Editar mis datos personales">
                  <CButton color="primary" size="lg" className="px-5">
                    Modificar mis datos
                  </CButton>
                </Link>

                <CButton 
                  color="outline-danger" 
                  size="lg" 
                  className="px-5" 
                  onClick={handleLogout}
                  aria-label="Cerrar sesión de la cuenta"
                >
                  Cerrar sesión
                </CButton>
              </div>

              <div className="text-center mt-4 pt-4 border-top">
                <Link 
                  to="/fol-info" 
                  className="text-decoration-none text-success fw-bold"
                  aria-label="Más información sobre el proyecto FOL y compromiso ambiental"
                >
                  Comprometidos con el medio ambiente y la seguridad laboral agrícola
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