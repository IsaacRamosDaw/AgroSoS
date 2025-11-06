import React from 'react'
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
} from '@coreui/react'
import {  useNavigate } from 'react-router-dom';

export const FormLogin = () => {

const navigate = useNavigate();
const handleLogin = () => {
    alert('Datos guardados correctamente')
    navigate(`/user/1`)
}

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6} lg={4}>
            <CCard className="shadow-sm">
              <CCardHeader className="text-center fw-bold">Iniciar sesión</CCardHeader>
              <CCardBody>
                <CForm>
                  <div className="mb-3">
                    <CFormLabel htmlFor="email">Correo electrónico</CFormLabel>
                    <CFormInput type="email" id="email" placeholder="usuario@correo.com" />
                  </div>
                  <div className="mb-3">
                    <CFormLabel htmlFor="password">Contraseña</CFormLabel>
                    <CFormInput type="password" id="password" placeholder="********" />
                  </div>
                  <div className="d-grid">
                    <CButton color="primary" onClick={handleLogin}>Entrar</CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}
