import React, { useState } from "react";
import { Header } from "../components/Header";
import { CButton } from "@coreui/react";

function FarmBot() {
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());
  const [selectedDate, setSelectedDate] = useState(null);

  const handleUpdateSensors = () => {
    setLastUpdate(new Date().toLocaleTimeString());
    setSelectedDate(null);
  };

  // Datos de ejemplo del historial
  const sensorHistory = [
    {
      date: "2024-11-20",
      time: "14:30",
      sensors: [
        { name: "Agua", value: "42%", unit: "%" },
        { name: "Luz", value: "750", unit: "lux" },
        { name: "Humedad", value: "62%", unit: "%" },
        { name: "Presión", value: "1010", unit: "mb" },
      ],
    },
    {
      date: "2024-11-20",
      time: "12:00",
      sensors: [
        { name: "Agua", value: "48%", unit: "%" },
        { name: "Luz", value: "850", unit: "lux" },
        { name: "Humedad", value: "68%", unit: "%" },
        { name: "Presión", value: "1015", unit: "mb" },
      ],
    },
    {
      date: "2024-11-19",
      time: "18:45",
      sensors: [
        { name: "Agua", value: "40%", unit: "%" },
        { name: "Luz", value: "700", unit: "lux" },
        { name: "Humedad", value: "60%", unit: "%" },
        { name: "Presión", value: "1012", unit: "mb" },
      ],
    },
  ];

  const plants = [
    { name: "Lechuga 1", days: 2 },
    { name: "Lechuga 2", days: 2 },
    { name: "Lechuga 3", days: 2 },
  ];

  const currentSensors = [
    { name: "Agua", value: "45%", unit: "%" },
    { name: "Luz", value: "800", unit: "lux" },
    { name: "Humedad", value: "65%", unit: "%" },
    { name: "Presión", value: "1013", unit: "mb" },
  ];

  // Mostrar datos históricos o actuales
  const displaySensors = selectedDate ? selectedDate.sensors : currentSensors;

  return (
    <>
      <Header />
      <div style={{ padding: "2rem" }}>
        {/* Contenedor principal con tabla y sensores lado a lado */}
        <div style={{ display: "flex", gap: "2rem", justifyContent: "space-between", width: "100%" }}>
          {/* Tabla de plantas - izquierda 25vw */}
          <div style={{ width: "25vw" }}>
            <h1 style={{fontSize: "2rem", fontWeight: "bold"}}>FarmBot Sensors</h1>
            <table style={{ width: "100%", borderCollapse: "collapse", borderRadius: "10px", overflow: "hidden", border: "5px solid #000" }}>
              <thead>
                <tr style={{ backgroundColor: "#f0f0f0", borderBottom: "2px solid #ccc" }}>
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>Planta</th>
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>Días Plantados</th>
                </tr>
              </thead>
              <tbody>
                {plants.map((plant, index) => (
                  <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "0.75rem" }}>{plant.name}</td>
                    <td style={{ padding: "0.75rem" }}>{plant.days}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Sección Control Sensores - central 50vw */}
          <div style={{ width: "50vw" }}>
            <h1 style={{textAlign:"center",fontSize: "2rem", fontWeight: "bold"}}>Control Sensores</h1>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", justifyContent: "center", flexWrap: "wrap" }}>
              <span>
                <strong>Última act.:</strong> {selectedDate ? `${selectedDate.date} ${selectedDate.time}` : lastUpdate}
              </span>
              <CButton color="primary" onClick={handleUpdateSensors}>
                Actualizar Sensores
              </CButton>
              {/* History is always visible in the right column now */}
            </div>

            {/* Grid de sensores */}
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
                  <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#0066cc", margin: 0 }}>
                    {sensor.value}
                  </p>
                  <p style={{ fontSize: "0.9rem", color: "#666", margin: "0.5rem 0 0 0" }}>
                    {sensor.unit}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Espacio reservado para historial - derecha 25vw */}
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
              {sensorHistory.map((entry, index) => (
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
                  onMouseEnter={(e) => {
                    if (selectedDate !== entry) {
                      e.target.style.backgroundColor = "#e9ecef";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedDate !== entry) {
                      e.target.style.backgroundColor = "#fff";
                    }
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

export default FarmBot;
