export const getAllSensors = async () => {
    const response = await fetch(`http://localhost:8080/api/allSensor`);
    const data = await response.json();
    return data;
}

export const getSensorById = async (id) => {
    const response = await fetch(`http://localhost:8080/api/sensor/${id}`);
    const data = await response.json();
    return data;
}

export const getSensorsByUserId = async (id) => {
    const response = await fetch(`http://localhost:8080/api/sensor/user/${id}`);
    const data = await response.json();
    return data;
}

export const createSensor = async (sensor) => {
    const response = await fetch(`http://localhost:8080/api/sensor`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sensor)
    });
    const data = await response.json();
    return data;
}

export const updateSensor = async (sensor) => {
    const response = await fetch(`http://localhost:8080/api/sensor/${sensor.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sensor)
    });
    const data = await response.json();
    return data;
}

export const deleteSensor = async (id) => {
    const response = await fetch(`http://localhost:8080/api/sensor/${id}`, {
        method: 'DELETE'
    });
    const data = await response.json();
    return data;
}

