export const getAllDevices = async () => {
  const response = await fetch(`http://localhost:8080/api/device`);
  const data = await response.json();
  return data;
}

export const getDeviceById = async (id) => {
  const response = await fetch(`http://localhost:8080/api/device/${id}`);
  const data = await response.json();
  return data;
}

export const getDevicesByUser = async (userId) => {
  const response = await fetch(`http://localhost:8080/api/device/user/${userId}`);
  const data = await response.json();
  return data;
}

export const createDevice = async (device) => {
  const response = await fetch(`http://localhost:8080/api/device`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(device)
  });
  const data = await response.json();
  return data;
}

export const updateDevice = async (device) => {
  const response = await fetch(`http://localhost:8080/api/device/${device.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(device)
  });
  const data = await response.json();
  return data;
}

export const deleteDevice = async (id) => {
  const response = await fetch(`http://localhost:8080/api/device/${id}`, {
    method: 'DELETE'
  });
  const data = await response.text();
  return data;
}
