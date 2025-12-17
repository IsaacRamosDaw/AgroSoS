import { BrowserRouter, Route, Routes } from 'react-router-dom'

// Views
import Admin from './views/Admin';
import SignUp from './views/SignUp';
import Login from './views/Login';
import UserProfile from './views/UserProfile';
import ModifyUser from './views/ModifyUser';
import Home from './views/Home';
import Tractor from './views/Tractor';
import FarmBot from './views/FarmBot';

// Components
import { Footer } from './components/Footer';

// CSS
import 'bootstrap/dist/css/bootstrap.min.css'
import '@coreui/coreui/dist/css/coreui.min.css'
import './App.css'

function App() {
  return (<>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/*' element={<Login />} />
        <Route path='/home' element={<Home />} />
        <Route path='/adminDashBoard/:id' element={<Admin />} />
        <Route path='/user/:id' element={<UserProfile />} />
        <Route path="/user/edit/:id" element={<ModifyUser />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signIn' element={<SignUp />} />
        <Route path='/farmbot' element={<FarmBot />} />
        <Route path='/tractor' element={<Tractor />} />
      </Routes>
    </BrowserRouter>
    <Footer />
  </>);
}

export default App
