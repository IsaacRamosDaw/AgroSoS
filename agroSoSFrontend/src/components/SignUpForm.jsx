import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../hook/auth/AuthContext'
import { createUser } from '../services/user.services'

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
  const navigate = useNavigate()
  const { login } = useAuth();

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [accepted, setAccepted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Comprobaciones
    if (!accepted) {
      setError('Debes aceptar los términos de uso.')
      return
    }

    if (!name) {
      setError('Debes ingresar un nombre.')
      return
    }

    if (!email) {
      setError('Debes ingresar un correo electrónico.')
      return
    }

    if (!password) {
      setError('Debes ingresar una contraseña.')
      return
    }

    if (!confirmPassword) {
      setError('Debes confirmar la contraseña.')
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    // Creación del objeto
    const userData = {
      name: name,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
      accepted: accepted,
    }

  // Creación del usuario con el servicio de create en user
    try {
      // Usuario con contraseña hasheada devuelto por el backend
      const createdUser = await createUser(userData)
      if (createdUser) {
        
        // Llamada al método login con lso datos no devueltos por el backend, El método update se encarga de hashear la contraseña
        await login(userData.email, userData.password)

        // Esto daría error porque la contraseña ya está hasheada
        // await login(createdUser.email, createdUser.password)

        // Navegamos al perfil del usuario en concreto
        navigate(`/user/${createdUser.id}`)
      }
    } catch (err) {
      console.error(err)
      setError('Error al crear el usuario. Inténtalo de nuevo.')
    }
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
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <CFormLabel htmlFor="email">Correo electrónico</CFormLabel>
                    <CFormInput
                      type="email"
                      id="email"
                      placeholder="usuario@correo.com"
                      required
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
