import React, { useEffect, useState } from 'react'
import { getSensorsByUserId } from '../services/sensor.services'
import { getUserStorage } from '../hook/getUserStorage'
import { Sensor } from './Sensor'

export const SensorList = () => {
  const [sensors, setSensors] = React.useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchSensors = async () => {
      const rawUser = getUserStorage()

      if (rawUser) {
        setUser(rawUser)
      }

      if (rawUser?.id) {
        const sensors = await getSensorsByUserId(rawUser.id)
        setSensors(sensors)
      }
    }

    fetchSensors()
  }, [])

  console.log(sensors)
  return (
    <div className="p-4">
      {sensors.map(sensor => (
        <Sensor key={sensor.id} {...sensor} />
      ))}
    </div>
  )
}
