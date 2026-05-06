import { describe, it, expect } from 'vitest'
import { buildCurrentSensors, buildHistory } from '../utils/sensor.utils'

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const sensors = [
  { id: 1, label: 'Temperature' },
  { id: 2, label: 'Humidity' },
  { id: 3, label: 'Soil Moisture' },
]

const makeReading = (sensorId, value, createdAt) => ({ sensor: sensorId, pin: sensorId, value, createdAt })

// ─── buildCurrentSensors ──────────────────────────────────────────────────────

describe('buildCurrentSensors', () => {
  it('retorna [] cuando sensorList está vacía', () => {
    expect(buildCurrentSensors([], [])).toEqual([])
  })

  it('retorna [] cuando sensorList es null o undefined', () => {
    expect(buildCurrentSensors(null, [])).toEqual([])
    expect(buildCurrentSensors(undefined, [])).toEqual([])
  })

  it('usa "Sin dato" cuando no hay lecturas para un sensor', () => {
    const result = buildCurrentSensors([sensors[0]], [])
    expect(result[0].value).toBe('Sin dato')
  })

  it('devuelve la lectura más reciente para cada sensor', () => {
    const readings = [
      makeReading(1, '20', '2024-01-01T10:00:00'),
      makeReading(1, '25', '2024-01-01T12:00:00'),
      makeReading(1, '22', '2024-01-01T11:00:00'),
    ]
    const result = buildCurrentSensors([sensors[0]], readings)
    expect(result[0].value).toBe('25')
  })

  it('mapea correctamente name, value y unit para cada sensor', () => {
    const readings = [makeReading(1, '21.5', '2024-01-01T10:00:00')]
    const result = buildCurrentSensors([sensors[0]], readings)
    expect(result[0]).toEqual({ name: 'Temperature', value: '21.5', unit: '°C' })
  })

  it('asigna unidades correctas según la etiqueta del sensor', () => {
    const readingSet = sensors.map((s, i) =>
      makeReading(s.id, String(i * 10), '2024-01-01T10:00:00')
    )
    const result = buildCurrentSensors(sensors, readingSet)
    expect(result[0].unit).toBe('°C')
    expect(result[1].unit).toBe('%')
    expect(result[2].unit).toBe('%')
  })

  it('devuelve un elemento por cada sensor aunque alguno no tenga lectura', () => {
    const readings = [makeReading(1, '21', '2024-01-01T10:00:00')]
    const result = buildCurrentSensors(sensors, readings)
    expect(result).toHaveLength(sensors.length)
    expect(result[1].value).toBe('Sin dato')
    expect(result[2].value).toBe('Sin dato')
  })
})

// ─── buildHistory ─────────────────────────────────────────────────────────────

describe('buildHistory', () => {
  it('retorna [] cuando readingList está vacía', () => {
    expect(buildHistory(sensors, [])).toEqual([])
  })

  it('retorna [] cuando readingList es null o undefined', () => {
    expect(buildHistory(sensors, null)).toEqual([])
    expect(buildHistory(sensors, undefined)).toEqual([])
  })

  it('agrupa lecturas del mismo minuto en una sola entrada', () => {
    const readings = [
      makeReading(1, '20', '2024-01-01T10:05:00'),
      makeReading(2, '60', '2024-01-01T10:05:30'),
    ]
    const result = buildHistory(sensors, readings)
    expect(result).toHaveLength(1)
    expect(result[0].sensors).toHaveLength(2)
  })

  it('crea entradas separadas para minutos distintos', () => {
    const readings = [
      makeReading(1, '20', '2024-01-01T10:00:00'),
      makeReading(1, '21', '2024-01-01T10:01:00'),
    ]
    const result = buildHistory(sensors, readings)
    expect(result).toHaveLength(2)
  })

  it('ordena las entradas de más reciente a más antigua', () => {
    const readings = [
      makeReading(1, '20', '2024-01-01T08:00:00'),
      makeReading(1, '21', '2024-01-01T10:00:00'),
      makeReading(1, '19', '2024-01-01T09:00:00'),
    ]
    const result = buildHistory(sensors, readings)
    expect(result[0].time).toBe(new Date('2024-01-01T10:00:00').toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }))
  })

  it('usa el label del sensor cuando está disponible', () => {
    const readings = [makeReading(1, '21', '2024-01-01T10:00:00')]
    const result = buildHistory(sensors, readings)
    expect(result[0].sensors[0].name).toBe('Temperature')
  })

  it('usa "Pin {n}" como fallback cuando el sensor no existe en la lista', () => {
    const readings = [makeReading(99, '21', '2024-01-01T10:00:00')]
    const result = buildHistory(sensors, readings)
    expect(result[0].sensors[0].name).toBe('Pin 99')
  })

  it('cada entrada tiene date, time y sensors', () => {
    const readings = [makeReading(1, '21', '2024-01-01T10:00:00')]
    const result = buildHistory(sensors, readings)
    expect(result[0]).toHaveProperty('date')
    expect(result[0]).toHaveProperty('time')
    expect(result[0]).toHaveProperty('sensors')
  })
})
