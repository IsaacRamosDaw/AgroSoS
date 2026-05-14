import React from "react";
import { Link, useLocation } from "react-router-dom";
import { CHeader, CContainer, CButton, CAvatar } from "@coreui/react";
import { useAuth } from "../context/AuthContext";

export const Header = () => {
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  const onAdminPage = location.pathname.startsWith("/adminDashBoard");

  return (
    <CHeader position="sticky" className="bg-primary text-white shadow-sm py-3">
      <CContainer className="d-flex justify-content-between align-items-center">
        <h1 className="m-0" style={{ fontSize: "1.5rem" }}>
          <Link
            to="/home"
            className="header-link text-decoration-none text-white"
            style={{ fontWeight: "bold" }}
            aria-label="AgroSoS Home"
          >
            AgroSoS
          </Link>
        </h1>
        <nav className="d-flex gap-4 align-items-center" aria-label="Main Navigation">
          <Link
            to="/farmbot"
            className="header-link text-decoration-none"
            style={{ fontSize: "1.5rem", fontWeight: "bold" }}
            aria-label="Ir a FarmBOT"
          >
            FarmBOT
          </Link>
          <Link
            to="/tractor"
            className="header-link text-decoration-none"
            style={{ fontSize: '1.5rem', fontWeight: 'bold' }}
            aria-label="Ir a Tractor"
          >
            Tractor
          </Link>
          {isAdmin() && !onAdminPage && (
            <Link to={`/adminDashBoard/${user.id}`} className="text-decoration-none" aria-label="Panel de Administración">
              <CButton style={{ backgroundColor: '#ffc107', border: 'none', fontWeight: 'bold', color: '#000' }}>
                Admin
              </CButton>
            </Link>
          )}
        </nav>
        {user ? (
          <Link to={`/user/${user.id}`} className="text-decoration-none" aria-label="Perfil de Usuario">
            <CButton color="light" className="d-flex align-items-center gap-2" style={{ maxWidth: '150px' }}>
              <CAvatar
                size="sm"
                src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                alt={`Avatar de ${user.name}`}
              />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.name}
              </span>
            </CButton>
          </Link>
        ) : (
          <Link to="/Login" className="text-decoration-none" aria-label="Iniciar Sesión">
            <CButton color="light" style={{ width: '150px' }}>Iniciar sesión</CButton >
          </Link>
        )}
      </CContainer>
    </CHeader>
  );
};
