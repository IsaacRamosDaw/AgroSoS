import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "../components/Header";
import { CButton } from "@coreui/react";
import { Loader } from "../components/Loader";
import { getSensorsByDeviceId } from "../services/sensor.services";
import { getReadingsByDeviceId } from "../services/reading.services";
import { getDevicesByUser } from "../services/device.services";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { buildCurrentSensors, buildHistory } from "../utils/sensor.utils";
import { seedGenerator, startGenerator, stopGenerator, getGeneratorStatus, triggerReading, clearReadings, initDeviceSensors } from "../services/generator.services";

function Tractor() {
  const { deviceId: deviceIdParam } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [deviceId, setDeviceId] = useState(null);
  const [sensors, setSensors] = useState([]);
  const [history, setHistory] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());
  const [selectedDate, setSelectedDate] = useState(null);
  const [noDevice, setNoDevice] = useState(false);
  const [noSensors, setNoSensors] = useState(false);
  const [generatorRunning, setGeneratorRunning] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const displaySensors = selectedDate ? selectedDate.sensors : sensors;

  useEffect(() => {
    if (!user) return;
    initDevice();
  }, [user, deviceIdParam]);

  useEffect(() => {
    if (!deviceId) return;
    const interval = setInterval(() => fetchSensorData(deviceId), 30000);
    return () => clearInterval(interval);
  }, [deviceId]);

  const fetchGeneratorStatus = async () => {
    try {
      const status = await getGeneratorStatus();
      setGeneratorRunning(status.running);
    } catch {}
  };

  const initDevice = async () => {
    try {
      let tractorId;
      if (deviceIdParam) {
        tractorId = Number(deviceIdParam);
      } else {
        const devices = await getDevicesByUser(user.id);
        const tractor = devices.find(d => d.type === "Tractor");
        if (!tractor) {
          setNoDevice(true);
          return;
        }
        tractorId = tractor.id;
      }
      setDeviceId(tractorId);
      await Promise.all([fetchSensorData(tractorId), fetchGeneratorStatus()]);
    } catch (err) {
      showToast("Error al inicializar el dispositivo", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSeedData = async () => {
    try {
      setLoading(true);
      await seedGenerator(user.id);
      await startGenerator();
      setGeneratorRunning(true);
      setNoDevice(false);
      showToast("Datos de demo creados y generador iniciado", "success");
      await initDevice();
    } catch (err) {
      showToast("Error al inicializar datos de demo", "error");
      setLoading(false);
    }
  };

  const handleClearData = () => {
    if (!deviceId) return;
    setShowClearConfirm(true);
  };

  const confirmClearData = async () => {
    setShowClearConfirm(false);
    try {
      await clearReadings(deviceId);
      setSensors([]);
      setHistory([]);
      setSelectedDate(null);
      showToast("Datos limpiados correctamente", "success");
    } catch (err) {
      showToast("Error al limpiar los datos", "error");
    }
  };

  const handleToggleGenerator = async () => {
    try {
      if (generatorRunning) {
        await stopGenerator();
        setGeneratorRunning(false);
        showToast("Sensor detenido", "info");
      } else {
        await startGenerator();
        setGeneratorRunning(true);
        showToast("Sensor iniciado", "success");
      }
    } catch (err) {
      showToast("Error al cambiar estado del sensor.", "error");
    }
  };

  const fetchSensorData = async (devId) => {
    const [sensorList, readingList] = await Promise.all([
      getSensorsByDeviceId(devId),
      getReadingsByDeviceId(devId),
    ]);
    if (!sensorList.length) {
      setNoSensors(true);
      return;
    }
    setNoSensors(false);
    setSensors(buildCurrentSensors(sensorList, readingList));
    setHistory(buildHistory(sensorList, readingList));
    setLastUpdate(new Date().toLocaleTimeString());
  };

  const handleInitSensors = async () => {
    try {
      await initDeviceSensors(deviceId);
      await fetchSensorData(deviceId);
      showToast("Sensores inicializados correctamente", "success");
    } catch {
      showToast("Error al inicializar los sensores", "error");
    }
  };

  const handleUpdateSensors = async () => {
    if (!deviceId) return;
    setSelectedDate(null);
    try {
      await triggerReading(deviceId);
      await fetchSensorData(deviceId);
      showToast("Sensores actualizados", "success");
    } catch (err) {
      showToast("Error al actualizar sensores", "error");
    }
  };

  if (loading) return <><Header /><Loader message="Cargando Tractor..." /></>;

  if (noSensors) return (
    <>
      <Header />
      <div style={{ padding: "3rem", textAlign: "center" }}>
        <h2 style={{ marginBottom: "1rem" }}>Este dispositivo no tiene sensores configurados</h2>
        <p style={{ marginBottom: "1.5rem", color: "#666" }}>
          Inicializa los sensores para empezar a recibir lecturas.
        </p>
        <CButton color="primary" size="lg" onClick={handleInitSensors}>
          Inicializar Sensores
        </CButton>
      </div>
    </>
  );

  if (noDevice) return (
    <>
      <Header />
      <div style={{ padding: "3rem", textAlign: "center" }}>
        <h2 style={{ marginBottom: "1rem" }}>No se encontró un Tractor para este usuario</h2>
        <p style={{ marginBottom: "1.5rem", color: "#666" }}>
          Inicializa los datos de demo para empezar a simular lecturas de sensores.
        </p>
        <CButton color="success" size="lg" onClick={handleSeedData}>
          Inicializar Datos Demo
        </CButton>
      </div>
    </>
  );

  return (
    <>
      <Header />

      {/* CLEAR DATA CONFIRMATION MODAL */}
      {showClearConfirm && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999,
        }}>
          <div style={{
            backgroundColor: "#fff", padding: "2rem", borderRadius: "10px",
            minWidth: "300px", textAlign: "center",
          }}>
            <h3 style={{ marginBottom: "0.5rem" }}>¿Eliminar todas las lecturas?</h3>
            <p style={{ color: "#666", margin: "0.5rem 0 1.5rem" }}>
              Esta acción no se puede deshacer.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
              <CButton color="secondary" onClick={() => setShowClearConfirm(false)}>Cancelar</CButton>
              <CButton color="danger" onClick={confirmClearData}>Eliminar</CButton>
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: "2rem" }}>
        <div style={{ display: "flex", gap: "2rem", justifyContent: "space-between", width: "100%" }}>
          <div style={{ width: "75vw" }}>
            <h1 style={{ textAlign: "center", fontSize: "2rem", fontWeight: "bold" }}>Sensores del Tractor</h1>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", justifyContent: "center", flexWrap: "wrap" }}>
              <span>
                <strong>Última act.:</strong> {selectedDate ? `${selectedDate.date} ${selectedDate.time}` : lastUpdate}
              </span>
              <CButton color="primary" onClick={handleUpdateSensors}>
                Actualizar Sensores
              </CButton>
              <CButton color="secondary" onClick={handleClearData}>
                Limpiar Datos
              </CButton>
              {/* Temperatura Ambiente */}
              <div style={{ background: "#fff", border: "1px solid #ddd", padding: "0.5rem 0.75rem", borderRadius: "6px", fontSize: "0.95rem" }}>
                <strong>Temperatura Ambiente:</strong> 21°C
              </div>
              <CButton
                color={generatorRunning ? "danger" : "success"}
                onClick={handleToggleGenerator}
              >
                {generatorRunning ? "Desactivar Sensor" : "Activar Sensor"}
              </CButton>
              <span style={{
                padding: "0.25rem 0.75rem",
                borderRadius: "12px",
                backgroundColor: generatorRunning ? "#28a745" : "#6c757d",
                color: "#fff",
                fontSize: "0.85rem",
              }}>
                {generatorRunning ? "● Activo" : "● Inactivo"}
              </span>
            </div>

            {/* Grid de sensores */}
            <div
              style={{  
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "1.5rem",
                maxWidth: "900px",
                margin: "0 auto",
              }}
            >
              {displaySensors.map((sensor, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: "#f9f9f9",
                    border: "2px solid #ddd",
                    borderRadius: "8px",
                    padding: "1.5rem",
                    textAlign: "center",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  <h3 style={{ marginBottom: "0.5rem", color: "#333" }}>{sensor.name}</h3>
                  <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#0066cc", margin: 0 }}>{sensor.value}</p>
                  <p style={{ fontSize: "0.9rem", color: "#666", margin: "0.5rem 0 0 0" }}>{sensor.unit}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 25vw Derecha */}
          <div style={{ width: "25vw", position: "relative" }}>
            <h3 style={{ textAlign: "center", fontSize: "2rem", fontWeight: "bold", margin: "0 0 1.5rem 0" }}>Historial</h3>
            <div
              style={{
                backgroundColor: "#f5f5f5",
                border: "2px solid #ddd",
                borderRadius: "8px",
                padding: "1rem",
                maxHeight: "500px",
                overflowY: "auto",
              }}
            >
              {selectedDate && (
                <div style={{ textAlign: "center", marginBottom: "0.75rem" }}>
                  <CButton color="warning" onClick={() => setSelectedDate(null)}>
                    Volver a Actual
                  </CButton>
                </div>
              )}
              {history.map((entry, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedDate(entry)}
                  style={{
                    padding: "0.75rem",
                    marginBottom: "0.5rem",
                    backgroundColor: selectedDate === entry ? "#007bff" : "#fff",
                    color: selectedDate === entry ? "#fff" : "#000",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ fontSize: "0.9rem", fontWeight: "bold" }}>{entry.date}</div>
                  <div style={{ fontSize: "0.85rem" }}>{entry.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Tractor;
