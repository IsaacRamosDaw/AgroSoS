import { ModifyForm } from '../components/ModifyForm'
import { Header } from '../components/Header'
import { CContainer } from '@coreui/react'
import { useAuth } from '../context/AuthContext'

export function ModifyUser() {
  const { user: authUser } = useAuth()

  return (
    <div style={{ backgroundColor: '#f4f6f9', minHeight: '100vh' }}>
      <Header />
      <CContainer className="py-5">
        <ModifyForm user={authUser} />
      </CContainer>
    </div>
  )
}

export default ModifyUser
