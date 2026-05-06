import React, { useState, useEffect } from "react";
import { CButton, CForm, CFormInput, CFormLabel, CFormFeedback } from "@coreui/react";
import { validatePlantForm } from "../utils/validation.utils";

export const PlantForm = ({ mode, plantData, onClose, onSubmit }) => {
  const isEdit = mode === "edit";

  const [form, setForm] = useState({ name: "", x: "", y: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit && plantData) {
      setForm({ id: plantData.id, name: plantData.name, x: plantData.x, y: plantData.y, z: 0, createdAt: plantData.createdAt });
    } else {
      setForm({ name: "", x: "", y: "", z: 0, createdAt: new Date().toISOString().split(".")[0] });
    }
    setErrors({});
  }, [isEdit, plantData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { isValid, field, error } = validatePlantForm(form);
    if (!isValid) {
      setErrors({ [field]: error });
      return;
    }
    onSubmit({ ...form, x: Number(form.x), y: Number(form.y) });
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0,
      width: "100vw", height: "100vh",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999,
    }}>
      <div style={{ backgroundColor: "#fff", padding: "2rem", borderRadius: "10px", minWidth: "350px", maxWidth: "500px" }}>
        <h2 style={{ marginBottom: "1rem", textAlign: "center" }}>
          {isEdit ? "Edit Plant" : "Create Plant"}
        </h2>

        <CForm onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <CFormLabel>Name</CFormLabel>
            <CFormInput
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              invalid={!!errors.name}
            />
            {errors.name && <CFormFeedback invalid>{errors.name}</CFormFeedback>}
          </div>

          <div className="mb-3" style={{ display: "flex", gap: "1rem" }}>
            <div style={{ flex: 1 }}>
              <CFormLabel>X</CFormLabel>
              <CFormInput
                type="text"
                name="x"
                value={form.x}
                onChange={handleChange}
                invalid={!!errors.x}
              />
              {errors.x && <CFormFeedback invalid>{errors.x}</CFormFeedback>}
            </div>
            <div style={{ flex: 1 }}>
              <CFormLabel>Y</CFormLabel>
              <CFormInput
                type="text"
                name="y"
                value={form.y}
                onChange={handleChange}
                invalid={!!errors.y}
              />
              {errors.y && <CFormFeedback invalid>{errors.y}</CFormFeedback>}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
            <CButton color="secondary" type="button" onClick={onClose}>Cancel</CButton>
            <CButton color="primary" type="submit">{isEdit ? "Save Changes" : "Create"}</CButton>
          </div>
        </CForm>
      </div>
    </div>
  );
};
