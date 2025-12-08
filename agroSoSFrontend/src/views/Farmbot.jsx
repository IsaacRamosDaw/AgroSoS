import React, { useState } from "react";
import { Header } from "../components/Header";
import { CButton } from "@coreui/react";
import { currentSensors, sensorHistory } from "../data/farmbotData";
import { plantsData } from "../data/plantsData";

function FarmBot() {
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null);

  const handleUpdateSensors = () => {
    setLastUpdate(new Date().toLocaleTimeString());
    setSelectedDate(null);
  };

  const handleSelectPlant = (id_plant) => {
    setSelectedPlant(id_plant);
  };

  const displaySensors = selectedDate ? selectedDate.sensors : currentSensors;

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
          {/* Tabla de plantas */}
          <div style={{ width: "25vw" }}>
            <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>
              FarmBot Plants
            </h1>
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
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>
                    Planta
                  </th>
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>
                    Días
                  </th>
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>X</th>
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>Y</th>
                  <th style={{ padding: "0.75rem", textAlign: "center" }}>
                    Select
                  </th>
                </tr>
              </thead>

              <tbody>
                {plantsData.map((plant) => {
                  // Calcular días sembrados
                  const daysPlanted = Math.floor(
                    (new Date() - new Date(plant.created_at)) /
                      (1000 * 60 * 60 * 24)
                  );

                  return (
                    <tr
                      key={plant.plant_id}
                      style={{ borderBottom: "1px solid #eee" }}
                    >
                      <td style={{ padding: "0.75rem" }}>{plant.name}</td>
                      <td style={{ padding: "0.75rem" }}>{daysPlanted}</td>
                      <td style={{ padding: "0.75rem" }}>{plant.pos_x}</td>
                      <td style={{ padding: "0.75rem" }}>{plant.pos_y}</td>

                      <td style={{ padding: "0.75rem", textAlign: "center" }}>
                        <input
                          type="checkbox"
                          checked={selectedPlant === plant.plant_id}
                          onChange={() =>
                            setSelectedPlant(
                              selectedPlant === plant.plant_id
                                ? null
                                : plant.plant_id
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

          {/* Sensores */}
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

          {/* Historial */}
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
                  <CButton
                    color="warning"
                    onClick={() => setSelectedDate(null)}
                  >
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
    </>
  );
}

export default FarmBot;
