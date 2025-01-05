import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {createBrowserRouter,createRoutesFromElements,RouterProvider,Route,BrowserRouter} from "react-router-dom"
import HomePage from './pages/HomePage.jsx'
import ContextProvider from './context/Context.jsx'
import Profile from './pages/Profile.jsx'
import Hex from './pages/Hex.jsx'
import UserPage from './pages/UserPage.jsx'
import AllRegisteredUsers from './pages/AllRegisteredUsers.jsx'
import Friends from './pages/Friends.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<HomePage />} />
      <Route path="profile" element={<Profile/>}>
        <Route index element={<UserPage />} />
        <Route path="notifications" element={<Hex/>}/>
        <Route path='allRegistered' element={<AllRegisteredUsers/>}/>
        <Route path='friends' element={<Friends/>} />

      </Route>
    </Route>
  )
);

createRoot(document.getElementById('root')).render(

    <RouterProvider router={router}>
        <ContextProvider>
        </ContextProvider>
    </RouterProvider>,

)
