import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { CButton } from "@coreui/react";
import { currentSensors, sensorHistory } from "../data/farmbotData";
import { PlantForm } from "../components/PlantForm";
import {
  getAllPlants,
  createPlant,
  updatePlant,
  deletePlant,
} from "../services/plant.services";

function FarmBot() {
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [plants, setPlants] = useState([]);

  // Modal control
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("create");

  // Fetch all plants on mount
  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    try {
      const data = await getAllPlants();
      setPlants(data);
    } catch (err) {
      console.error("Error fetching plants:", err);
    }
  };

  // Sensors update
  const handleUpdateSensors = () => {
    setLastUpdate(new Date().toLocaleTimeString());
    setSelectedDate(null);
  };

  const displaySensors = selectedDate ? selectedDate.sensors : currentSensors;

  // Form submit handler (Create / Edit)
  const handleFormSubmit = async (formData) => {
    try {
      if (formMode === "create") {
        const plantToCreate = {
          name: formData.name,
          x: formData.x,
          y: formData.y,
          z: 0,
          createdAt: new Date().toISOString().split(".")[0],
        };

        console.log("Creating plant:");
        console.log(plantToCreate);

        const created = await createPlant(plantToCreate);
        console.log("Plant created:");
        console.log(created);
         
        setPlants((prev) => [...prev, created]);
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
      }
      setShowForm(false);
      setSelectedPlant(null);
    } catch (err) {
      console.error("Error saving plant:", err);
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
    } catch (err) {
      console.error("Error deleting plant:", err);
    }
  };

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
