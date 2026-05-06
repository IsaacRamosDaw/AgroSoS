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
import FarmBotList from './views/FarmBotList';
import TractorList from './views/TractorList';

// Components
import { Footer } from './components/Footer';
import { ToastNotification } from './components/ToastNotification';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';

// Context
import { ToastProvider } from './hook/toast/ToastContext';

// CSS
import 'bootstrap/dist/css/bootstrap.min.css'
import '@coreui/coreui/dist/css/coreui.min.css'
import './App.css'

function App() {
  return (
    <ToastProvider>
    <BrowserRouter>
      <div className="app-layout">
        <div className="app-content">
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/*' element={<Login />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signIn' element={<SignUp />} />

            <Route path='/home' element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path='/adminDashBoard/:id' element={<AdminRoute><Admin /></AdminRoute>} />
            <Route path='/user/:id' element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            <Route path='/user/edit/:id' element={<ProtectedRoute><ModifyUser /></ProtectedRoute>} />
            <Route path='/farmbot' element={<ProtectedRoute><FarmBotList /></ProtectedRoute>} />
            <Route path='/farmbot/:deviceId' element={<ProtectedRoute><FarmBot /></ProtectedRoute>} />
            <Route path='/tractor' element={<ProtectedRoute><TractorList /></ProtectedRoute>} />
            <Route path='/tractor/:deviceId' element={<ProtectedRoute><Tractor /></ProtectedRoute>} />
          </Routes>
        </div>
        <Footer />
      </div>
      <ToastNotification />
    </BrowserRouter>
    </ToastProvider>
  );
}

export default App
