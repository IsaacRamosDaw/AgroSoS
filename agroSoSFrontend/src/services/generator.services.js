const BASE = "http://localhost:8080/api/generator";

export const seedGenerator = async (userId) => {
  const response = await fetch(`${BASE}/seed/${userId}`, { method: "POST" });
  return response.json();
};

export const startGenerator = async () => {
  const response = await fetch(`${BASE}/start`, { method: "POST" });
  return response.json();
};

export const stopGenerator = async () => {
  const response = await fetch(`${BASE}/stop`, { method: "POST" });
  return response.json();
};

export const getGeneratorStatus = async () => {
  const response = await fetch(`${BASE}/status`);
  return response.json();
};

export const triggerReading = async (deviceId) => {
  const response = await fetch(`${BASE}/trigger/${deviceId}`, { method: "POST" });
  return response.json();
};

export const clearReadings = async (deviceId) => {
  const response = await fetch(`${BASE}/clear/${deviceId}`, { method: "DELETE" });
  return response.json();
};

export const initDeviceSensors = async (deviceId) => {
  const response = await fetch(`http://localhost:8080/api/device/${deviceId}/init-sensors`, { method: "POST" });
  return response.json();
};
