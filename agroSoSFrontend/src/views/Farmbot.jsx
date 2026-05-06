import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Header } from "../components/Header";
import { CButton } from "@coreui/react";
import { PlantForm } from "../components/PlantForm";
import { Loader } from "../components/Loader";
import { getPlantsByDeviceId, createPlant, updatePlant, deletePlant } from "../services/plant.services";
import { getSensorsByDeviceId } from "../services/sensor.services";
import { getReadingsByDeviceId } from "../services/reading.services";
import { getDevicesByUser } from "../services/device.services";
import { useAuth } from "../hook/auth/AuthContext";
import { useToast } from "../hook/toast/ToastContext";
import { buildCurrentSensors, buildHistory } from "../utils/sensor.utils";
import { seedGenerator, startGenerator, stopGenerator, getGeneratorStatus, triggerReading, clearReadings, initDeviceSensors } from "../services/generator.services";

function FarmBot() {
  const { deviceId: deviceIdParam } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [deviceId, setDeviceId] = useState(null);
  const [sensors, setSensors] = useState([]);
  const [history, setHistory] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [plants, setPlants] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [noDevice, setNoDevice] = useState(false);
  const [noSensors, setNoSensors] = useState(false);
  const [generatorRunning, setGeneratorRunning] = useState(false);

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
      let farmId;
      if (deviceIdParam) {
        farmId = Number(deviceIdParam);
      } else {
        const devices = await getDevicesByUser(user.id);
        const farmbot = devices.find(d => d.type === "FarmBot");
        if (!farmbot) {
          setNoDevice(true);
          return;
        }
        farmId = farmbot.id;
      }
      setDeviceId(farmId);
      await Promise.all([fetchSensorData(farmId), fetchPlants(farmId), fetchGeneratorStatus()]);
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

  const handleClearData = async () => {
    if (!deviceId) return;
    if (!window.confirm("¿Eliminar todas las lecturas de este dispositivo?")) return;
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
      showToast("Error al cambiar estado del sensor", "error");
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

  const fetchPlants = async (devId) => {
    try {
      const data = await getPlantsByDeviceId(devId);
      setPlants(data);
    } catch (err) {
      showToast("Error al cargar las plantas", "error");
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

  const displaySensors = selectedDate ? selectedDate.sensors : sensors;

  // Form submit handler (Create / Edit)
  const handleFormSubmit = async (formData) => {
    try {
      if (formMode === "create") {
        const plantToCreate = {
          name: formData.name,
          x: formData.x,
          y: formData.y,
          z: 0,
          deviceId: deviceId,
          createdAt: new Date().toISOString().split(".")[0],
        };
        const created = await createPlant(plantToCreate);
        setPlants((prev) => [...prev, created]);
        showToast(`Planta "${created.name}" creada correctamente`, "success");
      } else if (formMode === "edit") {
        const plantToUpdate = {
          id: formData.id,
          name: formData.name,
          x: formData.x,
          y: formData.y,
          z: 0,
          createdAt: formData.createdAt,
        };
        const updated = await updatePlant(plantToUpdate);
        setPlants((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p))
        );
        showToast(`Planta "${updated.name}" actualizada correctamente`, "success");
      }
      setShowForm(false);
      setSelectedPlant(null);
    } catch (err) {
      showToast("Error al guardar la planta", "error");
    }
  };

  // Delete plant
  const handleDelete = async () => {
    if (!selectedPlant) return;
    const confirmDelete = window.confirm("¿Eliminar esta planta?");
    if (!confirmDelete) return;

    try {
      await deletePlant(selectedPlant);
      setPlants((prev) => prev.filter((p) => p.id !== selectedPlant));
      setSelectedPlant(null);
      showToast("Planta eliminada correctamente", "success");
    } catch (err) {
      showToast("Error al eliminar la planta", "error");
    }
  };

  if (loading) return <><Header /><Loader message="Cargando FarmBot..." /></>;

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
        <h2 style={{ marginBottom: "1rem" }}>No se encontró un FarmBot para este usuario</h2>
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
      <div style={{ padding: "2rem" }}>
        <div
          style={{
            display: "flex",
            gap: "2rem",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {/* PLANTS TABLE */}
          <div style={{ width: "25vw" }}>
            {/* CRUD BUTTONS */}
            <h1 style={{ fontSize: "2rem", fontWeight: "bold", textAlign: "center" }}>
              FarmBot Plants
            </h1>
            <div style={{ display: "flex", gap: ".5rem", marginBottom: "1rem",justifyContent: "center" }}>
              <CButton
                color="success"
                onClick={() => {
                  setFormMode("create");
                  setShowForm(true);
                }}
              >
                Create
              </CButton>

              <CButton
                color="warning"
                disabled={!selectedPlant}
                onClick={() => {
                  setFormMode("edit");
                  setShowForm(true);
                }}
              >
                Edit
              </CButton>

              <CButton
                color="danger"
                disabled={!selectedPlant}
                onClick={handleDelete}
              >
                Delete
              </CButton>
            </div>

            

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                borderRadius: "10px",
                overflow: "hidden",
                border: "5px solid #000",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "#f0f0f0",
                    borderBottom: "2px solid #ccc",
                  }}
                >
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>Planta</th>
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>Días</th>
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>X</th>
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>Y</th>
                  <th style={{ padding: "0.75rem", textAlign: "center" }}>Select</th>
                </tr>
              </thead>

              <tbody>
                {plants.map((plant) => {
                  const daysPlanted = Math.floor(
                    (new Date() - new Date(plant.createdAt)) / (1000 * 60 * 60 * 24)
                  );

                  return (
                    <tr key={plant.id} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "0.75rem" }}>{plant.name}</td>
                      <td style={{ padding: "0.75rem" }}>{daysPlanted}</td>
                      <td style={{ padding: "0.75rem" }}>{plant.x}</td>
                      <td style={{ padding: "0.75rem" }}>{plant.y}</td>
                      <td style={{ padding: "0.75rem", textAlign: "center" }}>
                        <input
                          type="checkbox"
                          checked={selectedPlant === plant.id}
                          onChange={() =>
                            setSelectedPlant(
                              selectedPlant === plant.id ? null : plant.id
                            )
                          }
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* SENSORS */}
          <div style={{ width: "50vw", height: "34vw" }}>
            <h1
              style={{
                textAlign: "center",
                fontSize: "2rem",
                fontWeight: "bold",
              }}
            >
              Control Sensores
            </h1>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1.5rem",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <span>
                <strong>Última act.:</strong>{" "}
                {selectedDate
                  ? `${selectedDate.date} ${selectedDate.time}`
                  : lastUpdate}
              </span>

              <CButton color="primary" onClick={handleUpdateSensors}>
                Actualizar Sensores
              </CButton>
              <CButton color="secondary" onClick={handleClearData}>
                Limpiar Datos
              </CButton>
              <CButton
                color={generatorRunning ? "danger" : "success"}
                onClick={handleToggleGenerator}
              >
                {generatorRunning ? "Disable Sensor" : "Enable Sensor"}
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

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "1.5rem",
                maxWidth: "600px",
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
                  <h3 style={{ marginBottom: "0.5rem", color: "#333" }}>
                    {sensor.name}
                  </h3>
                  <p
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      color: "#0066cc",
                      margin: 0,
                    }}
                  >
                    {sensor.value}
                  </p>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "#666",
                      margin: "0.5rem 0 0 0",
                    }}
                  >
                    {sensor.unit}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* HISTORY */}
          <div style={{ width: "25vw", position: "relative" }}>
            <h3
              style={{
                textAlign: "center",
                fontSize: "2rem",
                fontWeight: "bold",
                margin: "0 0 1.5rem 0",
              }}
            >
              Historial
            </h3>

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
                    backgroundColor:
                      selectedDate === entry ? "#007bff" : "#fff",
                    color: selectedDate === entry ? "#fff" : "#000",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ fontSize: "0.9rem", fontWeight: "bold" }}>
                    {entry.date}
                  </div>
                  <div style={{ fontSize: "0.85rem" }}>{entry.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* PLANT FORM MODAL */}
      {showForm && (
        <PlantForm
          mode={formMode}
          plantData={plants.find((p) => p.id === selectedPlant)}
          plants={plants}
          onClose={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
        />
      )}
    </>
  );
}

export default FarmBot;
