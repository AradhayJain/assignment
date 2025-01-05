import React, { useEffect } from 'react'
import { HiMagnifyingGlassCircle } from "react-icons/hi2"
import { HiArrowLeftStartOnRectangle } from "react-icons/hi2";
import { HiBell } from "react-icons/hi2";
import { useContext } from '../context/Context';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight } from "react-icons/fi";
import { FiArrowLeft } from "react-icons/fi";

const Sidebar = () => {
    const {user,setUser,isSidebarOpen,setIsSidebarOpen,selectedUser,setSelectedUser}=useContext();
    const [input, setInput] = React.useState("");
    const [users, setUsers] = React.useState([]);
    const navigate=useNavigate();
    // console.log(user);
   
    const handleSearch=async ()=>{
        const config={
            headers:{
                "Authorization":`Bearer ${user?.token}`
            }
        }
        try {
            const {data}=await axios.get(`/api/user?search=${input}`,config);
            if(data){
                setUsers(data);
                console.log(data);
            }else{
                console.log("error");
            }   
        } catch (error) {
            console.log(error);   
        }
        
    }
    
    const handleLogout=()=>{
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
        setSelectedUser(null);
        setUser(null);
        if(!localStorage.getItem('userInfo') && !localStorage.getItem('token')){
            navigate("/");
            console.log("logged out");
        }   
    }
    const handleProfile=()=>{
        setUsers([])
        // setSelectedUser(null);
        setInput("");
        setSelectedUser(null);
        navigate("/profile");
    }
    const handleNotifications=()=>{
        navigate("/profile/notifications");
    }

    
  return (
    <div  className={`   ${isSidebarOpen?"w-[40%] lg:w-[25%]":"w-[20%] lg:w-[5%]"} bg-red-200 h-screen`}>

        <div className=' flex flex-col h-[53%] w-full bg-green-200   p-2'>
            <div className='h-5 w-5'>
            {isSidebarOpen?<FiArrowLeft onClick={()=>setIsSidebarOpen(false)}/>:<FiArrowRight onClick={()=>setIsSidebarOpen(true)}/>}
            </div>

            
            <div className='flex gap-1 md:gap-5'>
{             isSidebarOpen && <input value={input} onChange={(e)=>setInput(e.target.value)} className='mt-5 w-28 md:w-44 h-10 p-2 rounded-full' placeholder="search user" type="text" />
}                <HiMagnifyingGlassCircle onClick={handleSearch} className='mt-5 h-10 w-10'/>
            </div>
            <div className={`${!isSidebarOpen?"hidden":"flex"} flex-col gap-2 mt-5 ml-1`}>
                {users && users.slice(0,4).map((user)=>(
                    <div className='flex gap-2 items-center' >
                        <img className='h-8 w-8 rounded-full' src={user.pic} alt="" />
                        <div onClick={()=>setSelectedUser(user)} key={user._id} className='w-[80%]  bg-red-100 rounded-full h-10 pt-2 text-center'>{user.name}</div>
                    </div>  
                )
                )}
            </div>
            
        </div>
        <div className='flex flex-col h-[47%] w-full bg-blue-200 pt-5 gap-3 pl-3'>
            <div onClick={handleProfile} className='flex gap-4 md:gap-8 cursor-pointer'>
                <div className='h-10 w-10 bg-green-100 flex justify-center items-center rounded-full' >
                    {user?.name[0]}
                </div>

{                isSidebarOpen && <h1 className='mt-2 text-sm md:text-lg font-semibold'>Profile</h1>
}            </div>
            {isSidebarOpen?<div onClick={()=>navigate("/profile/friends")} className='h-10 cursor-pointer w-32 bg-green-100 flex justify-center items-center rounded-full'>
                Get Friends
            </div>:<div onClick={()=>navigate("/profile/friends")} className='h-10 cursor-pointer w-10 bg-green-100 flex justify-center items-center rounded-full'>F</div>}
            
            <div onClick={handleLogout} className='flex gap-4 md:gap-8 cursor-pointer'>
                <HiArrowLeftStartOnRectangle className='h-8 w-8 '/>
{                isSidebarOpen && <h1 className='mt-2 text-sm md:text-lg font-semibold'>Logout</h1>
}
            </div>
            <div onClick={handleNotifications} className='flex gap-4 md:gap-8 cursor-pointer'>
                <HiBell className='h-8 w-8'/>
{                isSidebarOpen && <h1 className='mt-2 text-sm md:text-lg font-semibold'>Notifications</h1>
}            </div>
            <div className='flex gap-2 md:gap-8 cursor-pointer'>
                {isSidebarOpen?<button onClick={()=>navigate("/profile/allRegistered")} className='h-10 w-36 lg:w-44 rounded-full p-2 bg-yellow-100'>registered Users</button>:<div className='h-10 w-10 flex items-center justify-center rounded-full bg-yellow-100 '>R</div>}
            </div>
            

        </div>
    </div>
  )
}

export default Sidebar