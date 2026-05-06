import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CButton } from '@coreui/react';
import { useAuth } from '../hook/auth/AuthContext';
import { Loader } from './Loader';
import { Header } from './Header';

export function AdminRoute({ children }) {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!authLoading && user && !isAdmin()) {
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            navigate('/home');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [authLoading, user]);

  if (authLoading) {
    return (
      <>
        <Header />
        <Loader message="Comprobando permisos..." />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Header />
        <div style={{
          minHeight: 'calc(100vh - 70px)',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center',
          gap: '1.5rem', backgroundColor: '#f4f6f9',
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

  if (!isAdmin()) {
    return (
      <>
        <Header />
        <div style={{
          minHeight: 'calc(100vh - 70px)',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center',
          gap: '1rem', backgroundColor: '#f4f6f9',
        }}>
          <h2 style={{ color: '#e74c3c', margin: 0 }}>Acceso denegado</h2>
          <p style={{ color: '#666', margin: 0 }}>No tienes permisos de administrador.</p>
          <p style={{ color: '#999', margin: 0, fontSize: '0.95rem' }}>
            Redirigiendo a inicio en {countdown} segundo{countdown !== 1 ? 's' : ''}...
          </p>
          <Link to="/home">
            <CButton color="primary">Ir a inicio ahora</CButton>
          </Link>
        </div>
      </>
    );
  }

  return children;
}
