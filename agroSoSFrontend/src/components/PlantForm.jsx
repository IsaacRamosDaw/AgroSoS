import React, { useState, useEffect } from "react";
import { CButton, CForm, CFormInput, CFormLabel } from "@coreui/react";

export const PlantForm = ({ mode, plantData, plants, onClose, onSubmit }) => {
  const isEdit = mode === "edit";

  const [form, setForm] = useState({
    name: "",
    x: "",
    y: "",
    createdAt: "",
  });

  useEffect(() => {
    if (isEdit && plantData) {
      // Fill form with existing plant data
      setForm({
        name: plantData.name,
        x: plantData.x,
        y: plantData.y,
        createdAt: plantData.createdAt,
      });
    } else if (!isEdit) {

      setForm({
        name: "",
        x: "",
        y: "",
        createdAt: new Date().toISOString().split(".")[0], // ISO format
      });
    }
  }, [isEdit, plantData, plants]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "2rem",
          borderRadius: "10px",
          minWidth: "350px",
          maxWidth: "500px",
        }}
      >
        <h2 style={{ marginBottom: "1rem", textAlign: "center" }}>
          {isEdit ? "Edit Plant" : "Create Plant"}
        </h2>

        <CForm onSubmit={handleSubmit}>

          {/* Name */}
          <div className="mb-3">
            <CFormLabel>Name</CFormLabel>
            <CFormInput
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* X and Y inline */}
          <div className="mb-3" style={{ display: "flex", gap: "1rem" }}>
            <div style={{ flex: 1 }}>
              <CFormLabel>X</CFormLabel>
              <CFormInput
                type="text"
                name="x"
                value={form.x}
                onChange={handleChange}
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <CFormLabel>Y</CFormLabel>
              <CFormInput
                type="text"
                name="y"
                value={form.y}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
            <CButton color="secondary" onClick={onClose}>
              Cancel
            </CButton>
            <CButton color="primary" type="submit">
              {isEdit ? "Save Changes" : "Create"}
            </CButton>
          </div>
        </CForm>
      </div>
    </div>
  );
};
