import React, { useEffect, useState } from 'react'
import { useContext } from '../context/Context'
import axios from 'axios'
import { ToastContainer,toast } from 'react-toastify'

const Friends = () => {
    const {user,isSidebarOpen,selectedUser,value,setValue,setSelectedUser,setFetchAgain,fetchAgain}=useContext()
    const [userFriends,setUserFriends]=useState([])
    const getFriends=async ()=>{
        const config={
            headers:{
                "Authorization":   `Bearer ${user.token}`
            }

        }
        try {
            const {data}=await axios.get("/api/user/allfriends",config);
            console.log(data)
            if(data){
                setUserFriends(data)
            }
            
        } catch (error) {
            
            console.log(error)
        }
    }
    useEffect(()=>{
        getFriends();
    },[user])
    const handleRemoveFriend = async (friend) => {
        const userId=friend._id
        const config = {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        };
      
        if (!userId) {
          toast.error("No user selected to remove.");
          return;
        }
      
        try {
          const { data } = await axios.put(`/api/user/${userId}/remove`, {}, config);
          toast.success("Friend removed successfully");
          setUser((prevUser)=>({
            ...prevUser,
            friends: prevUser?.friends?.filter((friendId) => friendId !== userId)
          }))
          setValue("Add Friend")
          setFetchAgain(!fetchAgain)
          

       
          console.log(data)
          


        } catch (error) {
          console.error(error);
          toast.error(error.response?.data?.message || "Error removing friend");
        }
      };
      

      

  return (

    <div className={`h-full ${isSidebarOpen?"w-[60%] lg:w-full" : "w-full"} bg-orange-200`}>
        <div className='h-full w-full flex items-center justify-center'>
            <div className='w-full flex flex-col justify-center items-center gap-5'>
                <ToastContainer/>
                <h1 className='text-3xl font-bold '>Friends</h1>
                {
                    userFriends?.map((friend)=>(
                        <div className='flex gap-3 items-center min-w-44 bg-yellow-100 rounded-full p-2'>
                            <img className='h-10 w-10 rounded-full' src={friend?.pic} alt="" />
                            <h1>{friend?.name}</h1>
                            <h1>{friend?.email} </h1>
                            <button onClick={()=>handleRemoveFriend(friend)} className='h-10 w-32 rounded-full bg-orange-100 p-2 '>{user?.friends?.includes(friend?._id)?"Remove Friend":"Add Friend"}</button>
                        </div>
                    ))
                }

            </div>
        </div>

    </div>
  )
}

export default Friends