import React from 'react'
import Login from './Login'
import {SensorList} from '../components/SensorsList'
import { Header } from '../components/Header'
import DeviceSelection from '../components/DeviceSelection'

function Home() {
  return (
    <div>
      <Header/>
      <DeviceSelection/>
      <SensorList/>
    </div>
  )
}

export default Home