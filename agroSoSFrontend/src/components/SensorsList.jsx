import React from 'react'
import { fakeData } from '../data/sensor'
import { Sensor } from './Sensor'

export const SensorList = () => {
  return (
    <div className="p-4">
      {fakeData.map(sensor => (
        <Sensor key={sensor.id} {...sensor} />
      ))}
    </div>
  )
}
