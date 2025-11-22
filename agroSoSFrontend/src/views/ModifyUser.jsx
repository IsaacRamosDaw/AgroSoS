import { user } from '../data/user'
import { ModifyForm } from '../components/ModifyForm'
import { CContainer } from '@coreui/react'
import { useAuth } from '../hook/auth/AuthContext'

export function ModifyUser() {
  const { user: authUser } = useAuth()

  const currentUser = authUser || user

  return (
    <CContainer fluid className="bg-light min-vh-100 py-5">
      <ModifyForm user={currentUser} />
    </CContainer>
  )
}

export default ModifyUser
