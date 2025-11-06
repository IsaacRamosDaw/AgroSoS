import React from 'react'
import { useNavigate } from 'react-router-dom'
import { user } from '../data/user'
import { ModifyForm } from '../components/ModifyForm'
import { CContainer } from '@coreui/react'

export function ModifyUser() {
  const navigate = useNavigate()

  const handleFormSubmit = (updatedUser) => {
    console.log('Datos actualizados:', updatedUser)
    alert('Datos guardados correctamente')
    navigate(`/user/${user.id}`)
  }

  return (
    <CContainer fluid className="bg-light min-vh-100 py-5">
      <ModifyForm user={user} onSubmit={handleFormSubmit} />
    </CContainer>
  )
}

export default ModifyUser
