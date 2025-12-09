export const getAllReadings = async () => {
  const response = await fetch(`http://localhost:8080/api/reading`);
  const data = await response.json();
  return data;
}

export const getReadingById = async (id) => {
  const response = await fetch(`http://localhost:8080/api/reading/${id}`);
  const data = await response.json();
  return data;
}

export const getReadingByPlantId = async (plantId) => {
  const response = await fetch(`http://localhost:8080/api/reading/plant/${plantId}`);
  const data = await response.json();
  return data;
}

export const getReadingBySensorId = async (sensorId) => {
  const response = await fetch(`http://localhost:8080/api/reading/sensor/${sensorId}`);
  const data = await response.json();
  return data;
}

export const createReading = async (reading) => {
  const response = await fetch(`http://localhost:8080/api/reading`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(reading)
  });
  const data = await response.json();
  return data;
}

export const deleteReading = async (id) => {
  const response = await fetch(`http://localhost:8080/api/reading/${id}`, {
    method: 'DELETE'
  });
  const data = await response.text();
  return data;
}
