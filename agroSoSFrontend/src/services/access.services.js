export const getAllAccess = async () => {
  const response = await fetch(`http://localhost:8080/api/access`);
  const data = await response.json();
  return data;
}

export const getAccessById = async (id) => {
  const response = await fetch(`http://localhost:8080/api/access/${id}`);
  const data = await response.json();
  return data;
}

export const getAccessByUserId = async (userId) => {
  const response = await fetch(`http://localhost:8080/api/access/user/${userId}`);
  const data = await response.json();
  return data;
}

export const getAccessByDeviceId = async (deviceId) => {
  const response = await fetch(`http://localhost:8080/api/access/device/${deviceId}`);
  const data = await response.json();
  return data;
}

export const createAccess = async (userId, deviceId) => {
  const response = await fetch(`http://localhost:8080/api/access`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ user: { id: userId }, device: { id: deviceId } })
  });
  const data = await response.json();
  return data;
}

export const updateAccess = async (id, userId, deviceId) => {
  const response = await fetch(`http://localhost:8080/api/access/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user: { id: userId }, device: { id: deviceId } })
  });
  const data = await response.json();
  return data;
}

export const deleteAccess = async (id) => {
  const response = await fetch(`http://localhost:8080/api/access/${id}`, {
    method: 'DELETE'
  });
  const data = await response.text();
  return data;
}
