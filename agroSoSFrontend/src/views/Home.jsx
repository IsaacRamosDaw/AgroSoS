import { Header } from '../components/Header'
import DeviceSelection from '../components/DeviceSelection'
import './style/home.css'

function Home() {
  return (
    <div className="home">
      <Header />
      <DeviceSelection />
    </div>
  )
}

export default Home