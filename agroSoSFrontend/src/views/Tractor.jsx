import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { CButton } from "@coreui/react";
import { currentSensors, sensorHistory } from "../data/tractorData";
import { useAuth } from "../hook/auth/AuthContext";

function Tractor() {
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());
  const [selectedDate, setSelectedDate] = useState(null);

  const handleUpdateSensors = () => {
    setLastUpdate(new Date().toLocaleTimeString());
    setSelectedDate(null);
  };

  const displaySensors = selectedDate ? selectedDate.sensors : currentSensors;
  const auth = useAuth();
  const user = auth.user;

  return (
    <>
      <Header />
      <div style={{ padding: "2rem" }}>
        <div style={{ display: "flex", gap: "2rem", justifyContent: "space-between", width: "100%" }}>
          <div style={{ width: "75vw" }}>
            <h1 style={{ textAlign: "center", fontSize: "2rem", fontWeight: "bold" }}>Tractor Sensors</h1>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", justifyContent: "center", flexWrap: "wrap" }}>
              <span>
                <strong>Última act.:</strong> {selectedDate ? `${selectedDate.date} ${selectedDate.time}` : lastUpdate}
              </span>
              <CButton color="primary" onClick={handleUpdateSensors}>
                Actualizar Sensores
              </CButton>
              {/* Temperatura Ambiente */}
              <div style={{ background: "#fff", border: "1px solid #ddd", padding: "0.5rem 0.75rem", borderRadius: "6px", fontSize: "0.95rem" }}>
                <strong>Temperatura Ambiente:</strong> 21°C
              </div>
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
