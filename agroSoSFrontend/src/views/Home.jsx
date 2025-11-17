import React from 'react'
import Login from './Login'
import {SensorList} from '../components/SensorsList'
import { Header } from '../components/Header'

function Home() {
  return (
    <div>
      <Header/>
      <SensorList/>
    </div>
  )
}

export default Home