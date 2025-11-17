import React from 'react'
import { useNavigate } from 'react-router-dom'
import { user } from '../data/user'
import { ModifyForm } from '../components/ModifyForm'
import { CContainer } from '@coreui/react'
import { useAuth } from '../hook/auth/AuthContext'

export function ModifyUser() {
  const navigate = useNavigate()
  const { user: authUser, updateUser } = useAuth()

  // usamos el usuario del contexto si existe, si no, el mock local `user`
  const currentUser = authUser || user

  const handleFormSubmit = (updatedUser) => {
    console.log('Datos actualizados:', updatedUser)
    // actualizar el usuario en el contexto (y localStorage via efecto)
    if (updateUser) {
      updateUser(updatedUser)
    }
    alert('Datos guardados correctamente')
    navigate(`/user/${updatedUser.id || currentUser.id}`)
  }

  return (
    <CContainer fluid className="bg-light min-vh-100 py-5">
      <ModifyForm user={currentUser} onSubmit={handleFormSubmit} />
    </CContainer>
  )
}

export default ModifyUser
