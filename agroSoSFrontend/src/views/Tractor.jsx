import React, { useState } from "react";
import { Header } from "../components/Header";
import { CButton } from "@coreui/react";

function Tractor() {
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());
  const [selectedDate, setSelectedDate] = useState(null);

  const handleUpdateSensors = () => {
    setLastUpdate(new Date().toLocaleTimeString());
    setSelectedDate(null);
  };

  // Historial con los sensores del tractor (se ajustan a los nombres requeridos)
  const sensorHistory = [
    {
      date: "2024-11-20",
      time: "14:30",
      sensors: [
        { name: "Voltaje Batería", value: "12.6", unit: "V" },
        { name: "Voltaje Placa", value: "18.4", unit: "V" },
        { name: "Intesidad Salida Batería", value: "3.2", unit: "A" },
        { name: "Intensidad Entrada Batería", value: "2.8", unit: "A" },
        { name: "Potencia Batería", value: "40.3", unit: "W" },
        { name: "Potencia Placa", value: "52.0", unit: "W" },
      ],
    },
    {
      date: "2024-11-20",
      time: "12:00",
      sensors: [
        { name: "Voltaje Batería", value: "12.4", unit: "V" },
        { name: "Voltaje Placa", value: "17.8", unit: "V" },
        { name: "Intesidad Salida Batería", value: "3.0", unit: "A" },
        { name: "Intensidad Entrada Batería", value: "2.6", unit: "A" },
        { name: "Potencia Batería", value: "37.2", unit: "W" },
        { name: "Potencia Placa", value: "48.5", unit: "W" },
      ],
    },
  ];

  // Sensores actuales del Tractor (nombres solicitados)
  const currentSensors = [
    { name: "Voltaje Batería", value: "12.6", unit: "V" },
    { name: "Voltaje Placa", value: "18.4", unit: "V" },
    { name: "Intesidad Salida Batería", value: "3.2", unit: "A" },
    { name: "Intensidad Entrada Batería", value: "2.8", unit: "A" },
    { name: "Potencia Batería", value: "40.3", unit: "W" },
    { name: "Potencia Placa", value: "52.0", unit: "W" },
  ];

  const displaySensors = selectedDate ? selectedDate.sensors : currentSensors;

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
              {/* Temperatura Ambiente: small metric displayed near controls */}
              <div style={{ background: "#fff", border: "1px solid #ddd", padding: "0.5rem 0.75rem", borderRadius: "6px", fontSize: "0.95rem" }}>
                <strong>Temperatura Ambiente:</strong> 21°C
              </div>
            </div>

            {/* Grid of sensors. */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "1.5rem",
                maxWidth: "900px",
                margin: "0 auto",
              }}
            >
              {(() => {
                // Classify sensors: batería, placa, intensidad (handle both 'Intesidad' and 'Intensidad'), others
                const bateria = displaySensors.filter(s => /Bater[ií]a|Bateria/i.test(s.name));
                const placa = displaySensors.filter(s => /Placa/i.test(s.name));
                const intensidad = displaySensors.filter(s => /Intens?idad|Intesidad/i.test(s.name));
                const others = displaySensors.filter(s => !/Bater[ií]a|Bateria|Placa|Intens?idad|Intesidad/i.test(s.name));

                const ordered = [];

                // Row 1: bateria col1, bateria col2, intensidad col3
                if (bateria[0]) ordered.push({ item: bateria[0], row: 1, col: 1 });
                if (bateria[1]) ordered.push({ item: bateria[1], row: 1, col: 2 });
                if (intensidad[0]) ordered.push({ item: intensidad[0], row: 1, col: 3 });

                // Row 2: placa col1, placa col2, intensidad col3 (second intensity)
                if (placa[0]) ordered.push({ item: placa[0], row: 2, col: 1 });
                if (placa[1]) ordered.push({ item: placa[1], row: 2, col: 2 });
                if (intensidad[1]) ordered.push({ item: intensidad[1], row: 2, col: 3 });

                // Place remaining intensidad items down column 3 starting at row 3
                for (let i = 2; i < intensidad.length; i++) {
                  const row = 3 + (i - 2);
                  ordered.push({ item: intensidad[i], row, col: 3 });
                }

                // Now place remaining bateria/placa/others into columns 1 and 2 starting at row 3
                let row = 3;
                let col = 1;
                const remainder = [];
                // take remaining bateria beyond first two
                for (let i = 2; i < bateria.length; i++) remainder.push(bateria[i]);
                // remaining placa beyond first two
                for (let i = 2; i < placa.length; i++) remainder.push(placa[i]);
                // other sensors
                for (let i = 0; i < others.length; i++) remainder.push(others[i]);

                remainder.forEach((item) => {
                  ordered.push({ item, row, col });
                  if (col === 1) col = 2;
                  else { col = 1; row += 1; }
                });

                return ordered.map((entry, index) => (
                  <div
                    key={index}
                    style={{
                      gridColumn: entry.col,
                      gridRow: entry.row,
                      backgroundColor: "#f9f9f9",
                      border: "2px solid #ddd",
                      borderRadius: "8px",
                      padding: "1.5rem",
                      textAlign: "center",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    <h3 style={{ marginBottom: "0.5rem", color: "#333" }}>{entry.item.name}</h3>
                    <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#0066cc", margin: 0 }}>{entry.item.value}</p>
                    <p style={{ fontSize: "0.9rem", color: "#666", margin: "0.5rem 0 0 0" }}>{entry.item.unit}</p>
                  </div>
                ));
              })()}
            </div>
          </div>

          {/* Right reserved history area - 25vw */}
          <div style={{ width: "25vw", position: "relative" }}>
            {/* Historial heading placed outside the scrollable box */}
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
