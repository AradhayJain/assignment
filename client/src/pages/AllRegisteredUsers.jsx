import React, { useEffect, useState } from 'react'
import { useContext } from '../context/Context'
import axios from 'axios'

const AllRegisteredUsers =  () => {
    const {isSidebarOpen,user}= useContext()
    const [registedUsers,setRegisteredUsers]=useState([])
    const getAllRegistered= async()=>{
        const config={
            headers:{
                "Authorization":`Bearer ${user?.token} `
            }
        }
        try {
            const {data}=await axios.get("/api/user/allRegistered",config)
            console.log(data)
            if(data){
                setRegisteredUsers(data)
            }

        } catch (error) {
            
        }
    }
    useEffect(()=>{
        getAllRegistered();
    },[user])

  return (
    <div className={`h-full ${isSidebarOpen?"w-[60%] lg:w-full":"w-full"} bg-yellow-50 flex justify-center items-center`}>
        <div className='h-full w-full flex items-center justify-center'>
            <div className='w-full flex flex-col gap-5 items-center'>
                <h1 className='text-xl lg:text-3xl font-bold text-blue-600'>All Registered Users</h1>
                {
                    registedUsers?.map((user)=>(
                        <div key={user._id} className='bg-white p-5 min-w-52 rounded-full shadow-md flex gap-2'>
                            <img className='h-10 w-10 rounded-full' src={user.pic} alt="" />
                            <h2 className='text-lg font-bold text-blue-600'>{user.name}</h2>
                            <p className='text-lg text-gray-600'>{user.email}</p>

                        </div>
                        
                    ))

                }
            </div>

        </div>
    </div>
  )
}

export default AllRegisteredUsers