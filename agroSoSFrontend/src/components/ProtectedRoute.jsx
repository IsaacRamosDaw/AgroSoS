import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CButton } from '@coreui/react';
import { useAuth } from '../context/AuthContext';
import { Loader } from './Loader';
import { Header } from './Header';

export function ProtectedRoute({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      const timer = setTimeout(() => setShowError(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [authLoading, user]);

  if (authLoading || (!user && !showError)) {
    return (
      <>
        <Header />
        <Loader message="Verificando sesión..." />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Header />
        <div style={{
          minHeight: 'calc(100vh - 70px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1.5rem',
          backgroundColor: '#f4f6f9',
        }}>
          <h2 style={{ color: '#2c3e50', margin: 0 }}>No has iniciado sesión</h2>
          <p style={{ color: '#666', margin: 0 }}>Debes iniciar sesión para acceder a esta página.</p>
          <Link to="/login">
            <CButton color="primary" size="lg">Iniciar sesión</CButton>
          </Link>
        </div>
      </>
    );
  }

  return children;
}
