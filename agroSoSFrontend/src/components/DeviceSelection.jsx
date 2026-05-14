import { CContainer } from "@coreui/react";
import { Link } from "react-router-dom";
import '../views/style/home.css';
import { useEffect, useState } from "react";
import farmbotIcon from "../assets/img/farmbot_icon.png";
import tractorIcon from "../assets/img/tractor_icon.png";
import { getDevicesByUser } from "../services/device.services";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Loader } from "./Loader";

function DeviceSelection() {
  const [farmBots, setFarmBots] = useState([]);
  const [tractors, setTractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (!user) return;
    const fetchDevices = async () => {
      try {
        const devices = await getDevicesByUser(user.id);
        setFarmBots(devices.filter(device => device.type === 'FarmBot'));
        setTractors(devices.filter(device => device.type === 'Tractor'));
      } catch (error) {
        showToast("Error al cargar los dispositivos", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchDevices();
  }, [user]);

  if (loading) return <Loader message="Cargando dispositivos..." />;

  return (
    <div className="device-selection-container">
      <h2 className="device-selection-title">
        Selecciona tu dispositivo
      </h2>
      <p className="device-selection-subtitle">Gestiona y monitoriza tu maquinaria agrícola desde un solo lugar</p>

      <CContainer className="d-flex justify-content-center align-items-stretch" style={{ gap: "4rem", flexWrap: "wrap" }}>
        
        {/* FarmBot Section */}
        <div className="device-card">
          <Link to="/farmbot" className="text-decoration-none d-flex flex-column align-items-center mb-4">
            <div className="device-icon-wrapper farmbot-wrapper">
              <img src={farmbotIcon} alt="FARMBOT" style={{ width: "120px", height: "120px", objectFit: "contain" }} />
            </div>
            <span className="device-name">FarmBOT</span>
            <span className="device-desc">Agricultura automatizada</span>
          </Link>
          
          <div className="device-list-container">
            <h3 className="device-list-title">Unidades disponibles</h3>
            <ul className="device-list">
              {farmBots.length > 0 ? farmBots.map(device => (
                <li key={device.id}>
                  <Link to={`/farmbot/${device.id}`} className="device-link farmbot-link">
                    {device.name}
                  </Link>
                </li>
              )) : (
                <li style={{ textAlign: "center", color: "#bdc3c7", fontStyle: "italic" }}>No se encontraron FarmBots</li>
              )}
            </ul>
          </div>
        </div>

        <div className="device-divider"></div>

        {/* Tractor Section */}
        <div className="device-card">
          <Link to="/tractor" className="text-decoration-none d-flex flex-column align-items-center mb-4">
             <div className="device-icon-wrapper tractor-wrapper">
              <img src={tractorIcon} alt="Tractor" style={{ width: "120px", height: "120px", objectFit: "contain" }} />
            </div>
            <span className="device-name">Tractor</span>
            <span className="device-desc">Maquinaria pesada</span>
          </Link>
          
          <div className="device-list-container">
            <h3 className="device-list-title">Unidades disponibles</h3>
            <ul className="device-list">
              {tractors.length > 0 ? tractors.map(device => (
                <li key={device.id}>
                  <Link to={`/tractor/${device.id}`} className="device-link tractor-link">
                    {device.name}
                  </Link>
                </li>
              )) : (
                <li style={{ textAlign: "center", color: "#bdc3c7", fontStyle: "italic" }}>No se encontraron tractores</li>
              )}
            </ul>
          </div>
        </div>
        
      </CContainer>
    </div>
  );
}

export default DeviceSelection;
