import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CButton } from '@coreui/react';
import { getDevicesByUser, createDevice, updateDevice, deleteDevice } from '../services/device.services';
import { useAuth } from '../hook/auth/AuthContext';
import { useToast } from '../hook/toast/ToastContext';
import { Loader } from './Loader';

export function DeviceListPanel({ type, accentColor, icon, basePath }) {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [formName, setFormName] = useState('');

  useEffect(() => {
    if (user) fetchDevices();
  }, [user]);

  const fetchDevices = async () => {
    try {
      const all = await getDevicesByUser(user.id);
      setDevices(all.filter(d => d.type === type));
    } catch {
      showToast('Error al cargar dispositivos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setFormMode('create');
    setFormName('');
    setSelectedDevice(null);
    setShowForm(true);
  };

  const openEdit = (device) => {
    setFormMode('edit');
    setFormName(device.name);
    setSelectedDevice(device);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!formName.trim()) {
      showToast('El nombre no puede estar vacío', 'error');
      return;
    }
    try {
      if (formMode === 'create') {
        const created = await createDevice({ name: formName.trim(), user: user.id, type });
        setDevices(prev => [...prev, created]);
        showToast(`"${created.name}" creado correctamente`, 'success');
      } else {
        const updated = await updateDevice({ ...selectedDevice, name: formName.trim() });
        setDevices(prev => prev.map(d => d.id === updated.id ? updated : d));
        showToast(`"${updated.name}" actualizado correctamente`, 'success');
      }
      setShowForm(false);
    } catch {
      showToast('Error al guardar el dispositivo', 'error');
    }
  };

  const handleDelete = async (device) => {
    if (!window.confirm(`¿Eliminar "${device.name}"?`)) return;
    try {
      await deleteDevice(device.id);
      setDevices(prev => prev.filter(d => d.id !== device.id));
      showToast(`"${device.name}" eliminado`, 'success');
    } catch {
      showToast('Error al eliminar el dispositivo', 'error');
    }
  };

  if (loading) return <Loader message={`Cargando ${type}s...`} />;

  return (
    <div style={{ padding: '2rem', maxWidth: '640px', margin: '0 auto' }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', justifyContent: 'center' }}>
        <img src={icon} alt={type} style={{ width: '56px', height: '56px', objectFit: 'contain' }} />
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{type} Units</h1>
      </div>

      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
        <CButton color="success" onClick={openCreate}>+ New {type}</CButton>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {devices.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#aaa', fontStyle: 'italic', padding: '2rem 0' }}>
            No {type} units found
          </p>
        ) : devices.map(device => (
          <div
            key={device.id}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '1rem 1.5rem', backgroundColor: '#fff', borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: `1px solid ${accentColor}44`,
            }}
          >
            <Link
              to={`/${basePath}/${device.id}`}
              style={{ fontWeight: '600', fontSize: '1.1rem', color: accentColor, textDecoration: 'none', flex: 1 }}
            >
              {device.name}
            </Link>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <CButton color="warning" size="sm" style={{ color: '#fff' }} onClick={() => openEdit(device)}>
                Edit
              </CButton>
              <CButton color="danger" size="sm" onClick={() => handleDelete(device)}>
                Delete
              </CButton>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 999,
        }}>
          <div style={{
            backgroundColor: '#fff', padding: '2rem', borderRadius: '12px',
            minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '1rem',
          }}>
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>
              {formMode === 'create' ? `New ${type}` : `Edit ${type}`}
            </h2>
            <input
              type="text"
              placeholder="Device name"
              value={formName}
              onChange={e => setFormName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              autoFocus
              style={{
                padding: '0.75rem', borderRadius: '8px',
                border: '1px solid #ddd', fontSize: '1rem', outline: 'none',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <CButton color="secondary" onClick={() => setShowForm(false)}>Cancel</CButton>
              <CButton color="primary" onClick={handleSubmit}>
                {formMode === 'create' ? 'Create' : 'Save'}
              </CButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
