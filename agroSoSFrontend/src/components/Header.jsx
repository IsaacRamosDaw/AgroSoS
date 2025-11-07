import React from 'react'
import { Link } from 'react-router-dom'
import { CHeader, CContainer } from '@coreui/react'

export const Header = () =>
(
  <CHeader position="sticky" className="bg-primary text-white shadow-sm py-3">
    <CContainer className="d-flex justify-content-between align-items-center">
      <Link
        to="/home"
        className="text-white text-decoration-none"
        style={{ fontSize: '1.5rem', fontWeight: 'bold' }}
      >
        AgroSoS
      </Link>
    </CContainer>
  </CHeader>
)

