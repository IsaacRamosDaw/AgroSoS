// Tractor sensor data and history

export const currentSensors = [
  { name: "Voltaje Batería", value: "12.6", unit: "V" },
  { name: "Voltaje Placa", value: "18.4", unit: "V" },
  { name: "Intesidad Salida Batería", value: "3.2", unit: "A" },
  { name: "Intensidad Entrada Batería", value: "2.8", unit: "A" },
  { name: "Potencia Batería", value: "40.3", unit: "W" },
  { name: "Potencia Placa", value: "52.0", unit: "W" },
];

export const sensorHistory = [
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

