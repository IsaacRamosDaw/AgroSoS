import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { updateUser as updateUserService } from '../services/user.services'
import { useAuth } from '../hook/auth/AuthContext'
import {
  CForm,
  CFormInput,
  CFormLabel,
  CButton,
  CCard,
  CCardBody,
  CRow,
  CCol,
} from '@coreui/react'

export function ModifyForm({ user }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { updateUser } = useAuth()
  const [username, setUsername] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    if (user) {
      setUsername(user.name || '')
      setEmail(user.email || '')
    }
  }, [user])

  const userData = {}

  const handleSubmit = (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden')
      return
    }

    userData.id = id
    userData.name = username
    userData.email = email
    userData.password = password

    handleEditUser()
  }

  const handleEditUser = async () => {
    const userModified = await updateUserService(userData)

    console.log("userModified")
    console.log(userModified)

    updateUser(userModified)

    navigate(`/user/${userModified.id}`)
  }

  return (
    <CRow className="justify-content-center">
      <CCol xs={12} md={8} lg={6}>
        <CCard className="shadow-lg border-0 rounded-4 mt-5">
          <CCardBody className="p-4">
            <h2 className="text-center mb-4">Modificar Datos del Usuario</h2>

            <CForm onSubmit={handleSubmit}>
              <div className="mb-3">
                <CFormLabel htmlFor="username">Nombre de usuario</CFormLabel>
                <CFormInput
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <CFormLabel htmlFor="email">Correo electrónico</CFormLabel>
                <CFormInput
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <CFormLabel htmlFor="password">Contraseña</CFormLabel>
                <CFormInput
                  type="password"
                  id="password"
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <CFormLabel htmlFor="confirmPassword">Confirmar contraseña</CFormLabel>
                <CFormInput
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="text-center">
                <CButton type="submit" color="primary" size="lg">
                  Guardar cambios
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}
