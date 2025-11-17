import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {UserProvider} from './context/UserContext.jsx'
import {AuthProvider} from './hook/auth/AuthContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <UserProvider>
        <App/>
      </UserProvider>
    </AuthProvider>
  </StrictMode>,)