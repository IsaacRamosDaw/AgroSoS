import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { getAllUsers, promoteUser, revokeUser, deleteUser } from '../services/user.services';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CButton, CContainer, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';

function Admin() {
  const [users, setUsers] = useState([]);
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

  const handleDelete = async (targetUserId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este usuario?")) return;
    try {
      await deleteUser(targetUserId);
      fetchUsers();
      showToast("Usuario eliminado correctamente", "success");
    } catch (error) {
      showToast("Error al eliminar usuario", "error");
    }
  };

  return (
    <div style={{ backgroundColor: "#f4f6f9", minHeight: "100vh" }}>
      <Header />
      <CContainer className="py-5">
        <h1 className="mb-4 text-center" style={{ color: "#2c3e50", fontWeight: "bold" }}>Admin Dashboard</h1>
        
        <div className="bg-white p-4 rounded shadow-sm">
            <h3 className="mb-4" style={{borderBottom: "2px solid #f0f0f0", paddingBottom: "1rem"}}>User Management</h3>
            <CTable hover responsive>
            <CTableHead>
                <CTableRow>
                <CTableHeaderCell>ID</CTableHeaderCell>
                <CTableHeaderCell>Name</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>Role</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
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
                            Promote
                        </CButton>
                        )}
                        {user.role === 'ADMIN' && (
                        <CButton color="secondary" size="sm" onClick={() => handleRevoke(user.id)}>
                            Revoke
                        </CButton>
                        )}
                        <CButton color="danger" size="sm" onClick={() => handleDelete(user.id)} style={{color: "white"}}>
                        Delete
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