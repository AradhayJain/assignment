import React from 'react'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

const Profile = () => {

  return (
    <>
        <div className='h-screen w-full flex'>
            
            <Sidebar/>
            <Outlet/>
        </div>
        
    </>
    
  )
}

export default Profile