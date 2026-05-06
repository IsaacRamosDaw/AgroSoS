import { CSpinner } from '@coreui/react'

export const Loader = ({ color = 'primary', message = 'Cargando...' }) => (
  <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-3">
    <CSpinner color={color} style={{ width: '3rem', height: '3rem' }} />
    {message && <p className="text-muted mb-0">{message}</p>}
  </div>
)
