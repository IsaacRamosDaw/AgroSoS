const getUnit = (label) => {
  const l = label.toLowerCase();
  if (l.includes('suelo') || l.includes('soil') || l.includes('moisture')) return '%';
  if (l.includes('temp'))                                                   return '°C';
  if (l.includes('humid') || l.includes('humed'))                           return '%';
  if (l.includes('ph'))                                                     return 'pH';
  if (l.includes('rpm'))                                                    return 'RPM';
  if (l.includes('fuel') || l.includes('combustible'))                      return 'L';
  if (l.includes('battery') || l.includes('voltage') || l.includes('voltaje')) return 'V';
  return '';
};

export const buildCurrentSensors = (sensorList, readingList) => {
  if (!sensorList?.length) return []
  return sensorList.map(sensor => {
    const latest = readingList
      .filter(r => r.sensor === sensor.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
    return {
      name: sensor.label,
      value: latest?.value ?? 'Sin dato',
      unit: getUnit(sensor.label),
    }
  })
}

export const buildHistory = (sensorList, readingList) => {
  if (!readingList?.length) return []
  const grouped = {}
  readingList.forEach(reading => {
    const dt = new Date(reading.createdAt)
    const key = dt.toISOString().slice(0, 16)
    if (!grouped[key]) {
      grouped[key] = {
        isoKey: key,
        date: dt.toLocaleDateString('es-ES'),
        time: dt.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        sensors: [],
      }
    }
    const sensor = sensorList.find(s => s.id === reading.sensor)
    grouped[key].sensors.push({
      name: sensor?.label ?? `Pin ${reading.pin}`,
      value: reading.value,
      unit: sensor ? getUnit(sensor.label) : '',
    })
  })
  return Object.values(grouped).sort((a, b) => b.isoKey.localeCompare(a.isoKey))
}
