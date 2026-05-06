import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { getAllUsers, promoteUser, revokeUser, deleteUser } from '../services/user.services';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CButton, CContainer, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';

function Admin() {
  const [users, setUsers] = useState([]);
  const [userToDelete, setUserToDelete] = useState(null);
  const { user: currentUser, updateUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      showToast("Error al cargar usuarios", "error");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handlePromote = async (targetUserId) => {
    if (!currentUser) return;
    try {
      await promoteUser(currentUser.id, targetUserId);
      if (targetUserId === currentUser.id) {
        updateUser({ role: 'ADMIN' });
      }
      fetchUsers();
      showToast("Usuario promovido a ADMIN correctamente", "success");
    } catch (error) {
      showToast("Error al promover usuario", "error");
    }
  };

  const handleRevoke = async (targetUserId) => {
    if (!currentUser) return;
    try {
      await revokeUser(currentUser.id, targetUserId);
      if (targetUserId === currentUser.id) {
        updateUser({ role: 'USER' });
        showToast("Has perdido los permisos de administrador", "info");
        navigate('/home');
        return;
      }
      fetchUsers();
      showToast("Permisos de ADMIN revocados correctamente", "success");
    } catch (error) {
      showToast("Error al revocar permisos", "error");
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteUser(userToDelete);
      setUserToDelete(null);
      fetchUsers();
      showToast("Usuario eliminado correctamente", "success");
    } catch (error) {
      showToast("Error al eliminar usuario", "error");
    }
  };

  return (
    <div style={{ backgroundColor: "#f4f6f9", minHeight: "100vh" }}>
      <Header />

      {/* DELETE USER CONFIRMATION MODAL */}
      {userToDelete && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999,
        }}>
          <div style={{
            backgroundColor: "#fff", padding: "2rem", borderRadius: "10px",
            minWidth: "300px", textAlign: "center",
          }}>
            <h3 style={{ marginBottom: "0.5rem" }}>¿Eliminar este usuario?</h3>
            <p style={{ color: "#666", margin: "0.5rem 0 1.5rem" }}>
              Esta acción no se puede deshacer.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
              <CButton color="secondary" onClick={() => setUserToDelete(null)}>Cancelar</CButton>
              <CButton color="danger" onClick={confirmDelete}>Eliminar</CButton>
            </div>
          </div>
        </div>
      )}
      <CContainer className="py-5">
        <h1 className="mb-4 text-center" style={{ color: "#2c3e50", fontWeight: "bold" }}>Panel de Administración</h1>

        <div className="bg-white p-4 rounded shadow-sm">
            <h3 className="mb-4" style={{borderBottom: "2px solid #f0f0f0", paddingBottom: "1rem"}}>Gestión de Usuarios</h3>
            <CTable hover responsive>
            <CTableHead>
                <CTableRow>
                <CTableHeaderCell>ID</CTableHeaderCell>
                <CTableHeaderCell>Nombre</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>Rol</CTableHeaderCell>
                <CTableHeaderCell>Acciones</CTableHeaderCell>
                </CTableRow>
            </CTableHead>
            <CTableBody>
                {users.map((user) => (
                <CTableRow key={user.id}>
                    <CTableDataCell>{user.id}</CTableDataCell>
                    <CTableDataCell>{user.name}</CTableDataCell>
                    <CTableDataCell>{user.email}</CTableDataCell>
                    <CTableDataCell>
                    <span className={`badge ${user.role === 'ADMIN' ? 'bg-danger' : 'bg-success'}`}>
                        {user.role}
                    </span>
                    </CTableDataCell>
                    <CTableDataCell>
                    <div className="d-flex gap-2">
                        {user.role !== 'ADMIN' && (
                        <CButton color="warning" size="sm" onClick={() => handlePromote(user.id)} style={{color: "white"}}>
                            Promover
                        </CButton>
                        )}
                        {user.role === 'ADMIN' && (
                        <CButton color="secondary" size="sm" onClick={() => handleRevoke(user.id)}>
                            Revocar
                        </CButton>
                        )}
                        <CButton color="danger" size="sm" onClick={() => setUserToDelete(user.id)} style={{color: "white"}}>
                        Eliminar
                        </CButton>
                    </div>
                    </CTableDataCell>
                </CTableRow>
                ))}
            </CTableBody>
            </CTable>
        </div>
      </CContainer>
    </div>
  );
}

export default Admin;