import React from "react";
import { Link } from "react-router-dom";
import { CHeader, CContainer, CButton, CAvatar } from "@coreui/react";
import { useAuth } from "../hook/auth/AuthContext";

export const Header = () => {
  const { user } = useAuth();

  return (
    <CHeader position="sticky" className="bg-primary text-white shadow-sm py-3">
      <CContainer className="d-flex justify-content-between align-items-center">
        <Link
          to="/home"
          className="header-link text-decoration-none"
          style={{ fontSize: "1.5rem", fontWeight: "bold" }}
        >
          AgroSoS
        </Link>
        <div className="d-flex gap-4 align-items-center">
          <Link
            to="/farmbot"
            className="header-link text-decoration-none"
            style={{ fontSize: "1.5rem", fontWeight: "bold" }}
          >
            FarmBOT
          </Link>
          <Link
            to="/tractor"
            className="header-link text-decoration-none"
            style={{ fontSize: '1.5rem', fontWeight: 'bold' }}
          >
            Tractor
          </Link>
        </div>
        {user ? (
          <Link to={`/user/${user.id}`} className="text-decoration-none">
            <CButton color="light" className="d-flex align-items-center gap-2" style={{ maxWidth: '150px' }}>
              <CAvatar
                size="sm"
                src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
              />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.name}
              </span>
            </CButton>
          </Link>
        ) : (
          <Link to="/Login" className="text-decoration-none">
            <CButton color="light" style={{ width: '150px' }}>Iniciar sesión</CButton >
          </Link>
        )}
      </CContainer>
    </CHeader>
  );
};
