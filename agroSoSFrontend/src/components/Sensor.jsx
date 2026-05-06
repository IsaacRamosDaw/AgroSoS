/**
 * @deprecated En desuso ya que se recogen datos autogenerados por la aplicación.
 * Los datos de sensores ahora se obtienen directamente desde el backend y se
 * procesan mediante sensor.utils.js (buildCurrentSensors / buildHistory).
 */
import React from 'react'
import { CCard, CCardBody, CCardHeader, CBadge, CAlert } from '@coreui/react'

export const Sensor = ({ id, created_at, updated_at, mode, pin, label }) => {
  return (
    <CCard className="mb-3 shadow-sm">
      <CAlert color="warning" className="mb-0 rounded-0" style={{ borderRadius: 0 }}>
        En desuso: los datos de sensores ahora se obtienen directamente desde el backend y se procesan mediante sensor.utils.js.
      </CAlert>
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <span className="fw-bold">{label}</span>
        <CBadge color={mode === 1 ? 'info' : 'secondary'}>
          {mode === 1 ? 'Analógico' : 'Digital'}
        </CBadge>
      </CCardHeader>
      <CCardBody>
        <p><strong>ID:</strong> {id}</p>
        <p><strong>Pin:</strong> {pin}</p>
        <p><strong>Creado:</strong> {new Date(created_at).toLocaleString()}</p>
        <p><strong>Actualizado:</strong> {new Date(updated_at).toLocaleString()}</p>
      </CCardBody>
    </CCard>
  )
}
