import React from 'react'
import ContextProvider, { useContext } from './context/Context'
import { Outlet } from 'react-router-dom'
import Sidebar from './pages/Sidebar'

const App = () => {


  return (
    <ContextProvider>
      <div className="h-screen w-full">

        <Outlet/>
        
      </div>
        
    </ContextProvider>
  )
}

export default App