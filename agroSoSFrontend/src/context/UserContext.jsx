import React, {createContext, useState} from 'react'

export const userContext = createContext()

export function UserProvider({children}) {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <userContext.Provider value={{user, login, logout}}>
      {children}
    </userContext.Provider>
  )
}
