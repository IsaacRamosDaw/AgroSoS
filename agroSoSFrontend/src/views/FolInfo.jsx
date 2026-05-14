import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { CContainer, CRow, CCol, CCard, CButton, CCardBody, CBadge } from '@coreui/react'
import { Header } from '../components/Header'
import './style/fol-info.css'

export function FolInfo() {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Memoria FOL - AgroSoS</title>
        <meta name="description" content="Información sobre el proyecto FOL de AgroSoS: seguridad laboral, medio ambiente y trabajo en equipo en el sector agrícola." />
      </Helmet>
      <Header />
      <main className="fol-container" id="main-content">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol xs={12} lg={10}>
              <CCard className="fol-card border-0 shadow-lg">
                <header className="fol-header text-white text-center py-5" style={{ background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)' }}>
                  <h1 className="display-4 fw-bold mb-2">AgroSoS: Innovación, Seguridad y Trabajo en Equipo</h1>
                </header>
                
                <CCardBody className="p-5">
                  <section className="mb-5" aria-labelledby="analisis-sector">
                    <h2 id="analisis-sector" className="h3 mb-4 text-success border-bottom pb-2">
                      Análisis del Sector Agro-Tecnológico
                    </h2>
                    <p className="text-muted lh-lg">
                      Nuestro proyecto nace de una investigación exhaustiva del <strong className="text-dark">ecosistema agrícola actual</strong>, donde la tecnología no es solo un complemento, sino un motor de cambio. Hemos analizado cómo la digitalización del campo redefine las <strong className="text-dark">condiciones laborales</strong>, permitiendo una transición hacia empleos más técnicos y cualificados, pero que requieren una formación continua y específica en el manejo de maquinaria avanzada y sistemas de monitorización.
                    </p>
                  </section>

                  <section className="mb-5" aria-labelledby="gestion-riesgos">
                    <h2 id="gestion-riesgos" className="h3 mb-4 text-success border-bottom pb-2">
                     Gestión de Riesgos y Prevención
                    </h2>
                    <CRow className="g-4">
                      <CCol md={6}>
                        <article className="p-4 rounded-4 bg-light h-100 shadow-sm" aria-labelledby="campo-title">
                          <h3 id="campo-title" className="h5 fw-bold mb-3">Entorno de Campo</h3>
                          <p className="small text-muted mb-0">
                            Estudiamos los riesgos físicos tradicionales (fatiga, condiciones climáticas, manejo de cargas) y cómo las herramientas de AgroSoS ayudan a mitigarlos mediante la automatización de tareas pesadas.
                          </p>
                        </article>
                      </CCol>
                      <CCol md={6}>
                        <article className="p-4 rounded-4 bg-light h-100 shadow-sm" aria-labelledby="tech-title">
                          <h3 id="tech-title" className="h5 fw-bold mb-3">Entorno Tecnológico</h3>
                          <p className="small text-muted mb-0">
                            Evaluamos los riesgos ergonómicos y psicosociales asociados al uso de terminales digitales y la supervisión remota, implementando medidas preventivas para asegurar un entorno de trabajo saludable.
                          </p>
                        </article>
                      </CCol>
                    </CRow>
                  </section>

                  <section className="mb-5" aria-labelledby="sinergia-multidisciplinar">
                    <h2 id="sinergia-multidisciplinar" className="h3 mb-4 text-success border-bottom pb-2">
                    Sinergia Multidisciplinar
                    </h2>
                    <p className="text-muted lh-lg">
                      La clave del éxito en AgroSoS es el <strong className="text-dark">trabajo en equipo</strong>. Entendemos que el desarrollo de soluciones agrícolas requiere la colaboración entre perfiles técnicos, agrónomos y operativos. Hemos integrado dinámicas de <strong className="text-dark">comunicación profesional</strong> eficaces y protocolos de actuación que permiten una <strong className="text-dark">adaptación ágil</strong> a los entornos laborales cambiantes y a los imprevistos propios del sector agrícola.
                    </p>
                    <div className="mt-4">
                      <h3 className="h6 fw-bold text-secondary mb-3">Valores y habilidades clave:</h3>
                      <div 
                        className="d-flex flex-wrap gap-2" 
                        role="list" 
                        aria-label="Lista de valores y habilidades clave del proyecto"
                      >
                        <CBadge color="success" shape="rounded-pill" className="px-3 py-2" role="listitem">Comunicación Asertiva</CBadge>
                        <CBadge color="success" shape="rounded-pill" className="px-3 py-2" role="listitem">Liderazgo Compartido</CBadge>
                        <CBadge color="success" shape="rounded-pill" className="px-3 py-2" role="listitem">Resiliencia</CBadge>
                        <CBadge color="success" shape="rounded-pill" className="px-3 py-2" role="listitem">Flexibilidad</CBadge>
                      </div>
                    </div>
                  </section>

                  <div className="text-center mt-5 pt-4">
                    <CButton 
                      color="dark" 
                      className="btn-regresar text-white px-5 py-3 shadow-sm"
                      onClick={() => navigate(-1)}
                      aria-label="Volver a la página de Perfil de Usuario"
                    >
                      Volver al Perfil de Usuario
                    </CButton>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
      </main>
    </>
  )
}

export default FolInfo
