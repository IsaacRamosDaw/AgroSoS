import React from 'react'
import { CFooter, CContainer } from '@coreui/react'

export const Footer = () =>
(
  <CFooter className="bg-dark text-white py-3 mt-auto shadow-sm">
    <CContainer className="d-flex flex-column flex-md-row justify-content-between align-items-center text-center">
      <div>
        <strong>AgroSoS</strong> © {new Date().getFullYear()} Todos los derechos reservados.
      </div>
      <div className="mt-2 mt-md-0">
        <a
          href="https://agrosos.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white text-decoration-none mx-2"
        >
          Sitio web
        </a>
        <a
          href="https://twitter.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white text-decoration-none mx-2"
        >
          Twitter
        </a>
        <a
          href="https://github.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white text-decoration-none mx-2"
        >
          GitHub
        </a>
      </div>
    </CContainer>
  </CFooter>
)

