import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { updateUser as updateUserService } from '../services/user.services'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { validateModifyForm } from '../utils/validation.utils'
import {
  CForm,
  CFormInput,
  CFormLabel,
  CFormFeedback,
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
  const { showToast } = useToast()
  const [username, setUsername] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setUsername(user.name || '')
      setEmail(user.email || '')
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { isValid, field, error } = validateModifyForm({ name: username, email, password, confirmPassword })
    if (!isValid) {
      setErrors({ [field]: error })
      return
    }
    setErrors({})

    const payload = { id: id || user?.id, name: username, email }
    if (password) payload.password = password

    setLoading(true)
    try {
      const userModified = await updateUserService(payload)
      updateUser(userModified)
      showToast('Datos actualizados correctamente', 'success')
      navigate(`/user/${userModified.id}`)
    } catch (err) {
      showToast('Error al actualizar los datos. Inténtalo de nuevo.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <CRow className="justify-content-center">
      <CCol xs={12} md={8} lg={6}>
        <CCard className="shadow-lg border-0 rounded-4 mt-5">
          <CCardBody className="p-4">
            <h2 className="text-center mb-4">Modificar Datos del Usuario</h2>

            <CForm onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <CFormLabel htmlFor="username">Nombre de usuario</CFormLabel>
                <CFormInput
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setErrors(prev => ({ ...prev, name: undefined })) }}
                  invalid={!!errors.name}
                />
                {errors.name && <CFormFeedback invalid>{errors.name}</CFormFeedback>}
              </div>

              <div className="mb-3">
                <CFormLabel htmlFor="email">Correo electrónico</CFormLabel>
                <CFormInput
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: undefined })) }}
                  invalid={!!errors.email}
                />
                {errors.email && <CFormFeedback invalid>{errors.email}</CFormFeedback>}
              </div>

              <div className="mb-3">
                <CFormLabel htmlFor="password">Nueva contraseña <span style={{ color: '#999', fontSize: '0.85rem' }}>(opcional)</span></CFormLabel>
                <CFormInput
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: undefined })) }}
                  invalid={!!errors.password}
                  placeholder="Dejar vacío para no cambiar"
                />
                {errors.password && <CFormFeedback invalid>{errors.password}</CFormFeedback>}
              </div>

              <div className="mb-4">
                <CFormLabel htmlFor="confirmPassword">Confirmar nueva contraseña</CFormLabel>
                <CFormInput
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setErrors(prev => ({ ...prev, confirmPassword: undefined })) }}
                  invalid={!!errors.confirmPassword}
                  placeholder="Dejar vacío para no cambiar"
                />
                {errors.confirmPassword && <CFormFeedback invalid>{errors.confirmPassword}</CFormFeedback>}
              </div>

              <div className="text-center">
                <CButton type="submit" color="primary" size="lg" disabled={loading}>
                  {loading ? 'Guardando...' : 'Guardar cambios'}
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}
