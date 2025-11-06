import {BrowserRouter, Route, Routes} from 'react-router-dom'
import './App.css'
import Home from './views/Home';
import Login from './views/Login';
import User from './views/User';
import ModifyUser from './views/ModifyUser';
import CreateUser from './views/CreateUser';
import Admin from './views/Admin';
import 'bootstrap/dist/css/bootstrap.min.css'
import '@coreui/coreui/dist/css/coreui.min.css'

function App() {


  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/admin/' element={<Admin/>}/>
        <Route path='/user/:id' element={<User/>}/>
        <Route path="/user/edit/:id" element={<ModifyUser />} />
        <Route path='/login' element={<Login/>}/>
        <Route path='/signIn' element={<CreateUser/>}/>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App
