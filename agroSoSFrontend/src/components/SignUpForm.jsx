import React, { useState } from 'react'
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
  CFormCheck,
  CRow,
  CAlert,
} from '@coreui/react'

export const SignUpForm = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [accepted, setAccepted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    if (!accepted) {
      setError('Debes aceptar los términos de uso.')
      return
    }

    setError('')
    console.log('Usuario registrado correctamente')
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6} lg={5}>
            <CCard className="shadow-sm">
              <CCardHeader className="text-center fw-bold">
                Crear cuenta
              </CCardHeader>
              <CCardBody>
                <CForm onSubmit={handleSubmit}>
                  {error && <CAlert color="danger">{error}</CAlert>}

                  <div className="mb-3">
                    <CFormLabel htmlFor="username">Nombre de usuario</CFormLabel>
                    <CFormInput
                      type="text"
                      id="username"
                      placeholder="Tu nombre de usuario"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <CFormLabel htmlFor="email">Correo electrónico</CFormLabel>
                    <CFormInput
                      type="email"
                      id="email"
                      placeholder="usuario@correo.com"
                      required
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
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <CFormLabel htmlFor="confirmPassword">
                      Confirmar contraseña
                    </CFormLabel>
                    <CFormInput
                      type="password"
                      id="confirmPassword"
                      placeholder="********"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <CFormCheck
                      id="terms"
                      label="Acepto los términos de uso"
                      checked={accepted}
                      onChange={(e) => setAccepted(e.target.checked)}
                      required
                    />
                  </div>

                  <div className="d-grid">
                    <CButton color="success" type="submit">
                      Crear cuenta
                    </CButton>
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
