export const getAllPlants = async () => {
  const response = await fetch(`http://localhost:8080/api/plant`);
  const data = await response.json();
  return data;
}

export const getPlantById = async (id) => {
  const response = await fetch(`http://localhost:8080/api/plant/${id}`);
  const data = await response.json();
  return data;
}

export const createPlant = async (plant) => {
  const response = await fetch(`http://localhost:8080/api/plant`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(plant)
  });
  const data = await response.json();
  return data;
}

export const updatePlant = async (plant) => {
  const response = await fetch(`http://localhost:8080/api/plant/${plant.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(plant)
  });
  const data = await response.json();
  return data;
}

export const deletePlant = async (id) => {
  const response = await fetch(`http://localhost:8080/api/plant/${id}`, {
    method: 'DELETE'
  });
  const data = await response.text();
  return data;
}
